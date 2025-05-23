import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';

function WeekView() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/sleeps', {
      headers: { Authorization: `Bearer ${user.token}` }
    }).then(res => {
      const sorted = res.data
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(-7)
        .map(entry => {
          const sleep = new Date(`${entry.date}T${entry.sleepTime}`);
          const wake = new Date(`${entry.date}T${entry.wakeTime}`);
          const duration = (wake - sleep) / (1000 * 60 * 60); // in hours
          return {
            date: entry.date,
            hours: duration < 0 ? 24 + duration : duration
          };
        });
      setData(sorted);
    });
  }, [user]);

  return (
    <div>
      <h2>Weekly Sleep Overview</h2>
      <button onClick={() => navigate('/dashboard')}>← Back to Dashboard</button>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis unit=" hrs" />
          <Tooltip />
          <Bar dataKey="hours" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default WeekView;
