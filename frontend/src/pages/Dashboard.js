import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SleepCard from '../components/SleepCard';

function Dashboard() {
  const [form, setForm] = useState({ date: '', sleepTime: '', wakeTime: '' });
  const [schedules, setSchedules] = useState([]);

  // Fetch schedules on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    axios.get('http://localhost:5000/sleeps', config)
      .then(res => setSchedules(res.data))
      .catch(err => console.error(err));
  }, []);

  // Handle form submit
  const handleSubmit = e => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    axios.post('http://localhost:5000/sleeps', form, config)
      .then(res => {
        setSchedules([...schedules, res.data]);
        setForm({ date: '', sleepTime: '', wakeTime: '' });
      })
      .catch(err => console.error(err));
  };

  return (
    <div style={{ maxWidth: '600px', margin: '30px auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>Sleep Schedule Planner</h2>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="date"
          value={form.date}
          onChange={e => setForm({ ...form, date: e.target.value })}
          required
          style={inputStyle}
        />
        <input
          type="time"
          value={form.sleepTime}
          onChange={e => setForm({ ...form, sleepTime: e.target.value })}
          required
          style={inputStyle}
        />
        <input
          type="time"
          value={form.wakeTime}
          onChange={e => setForm({ ...form, wakeTime: e.target.value })}
          required
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>Save</button>
      </form>

      <div>
        {schedules.map(s => (
          <SleepCard
            key={s._id}
            date={s.date}
            sleepTime={s.sleepTime}
            wakeTime={s.wakeTime}
          />
        ))}
      </div>
    </div>
  );
}

const inputStyle = {
  padding: '8px',
  marginRight: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  fontSize: '16px',
};

const buttonStyle = {
  padding: '8px 20px',
  borderRadius: '5px',
  border: 'none',
  backgroundColor: '#007bff',
  color: 'white',
  fontSize: '16px',
  cursor: 'pointer',
};

export default Dashboard;
