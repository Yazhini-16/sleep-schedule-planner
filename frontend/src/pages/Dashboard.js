import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [date, setDate] = useState('');
  const [sleepTime, setSleepTime] = useState('');
  const [wakeTime, setWakeTime] = useState('');
  const chartRef = useRef(null);

  const fetchSchedules = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:5000/api/schedules', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setSchedules(data);
      } else {
        alert(data.message || 'Failed to fetch schedules');
      }
    } catch {
      alert('Server error fetching schedules');
    }
  }, [user.token]);

  useEffect(() => {
    if (user) {
      fetchSchedules();
    }
  }, [user, fetchSchedules]);

  useEffect(() => {
    if (!chartRef.current || schedules.length === 0) return;

    const ctx = chartRef.current.getContext('2d');
    if (ctx._chart) ctx._chart.destroy(); // destroy old chart instance if exists

    const sleepHoursData = schedules.map(s => {
      const sleep = new Date(`1970-01-01T${s.sleepTime}`);
      const wake = new Date(`1970-01-01T${s.wakeTime}`);
      let hours = (wake - sleep) / 36e5;
      if (hours < 0) hours += 24;
      return hours;
    });

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: schedules.map(s => s.date),
        datasets: [{
          label: 'Hours Slept',
          data: sleepHoursData,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        }],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 12,
          },
        },
      },
    });

    ctx._chart = chart;
  }, [schedules]);

  const handleAddSchedule = async (e) => {
    e.preventDefault();
    if (!date || !sleepTime || !wakeTime) {
      return alert('All fields are required');
    }

    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      return alert('Cannot select past date');
    }

    if (sleepTime === wakeTime) {
      return alert('Sleep time and wake time cannot be the same');
    }

    try {
      const res = await fetch('http://localhost:5000/api/schedules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ date, sleepTime, wakeTime }),
      });
      const data = await res.json();
      if (res.ok || res.status === 201) {
        setSchedules(prev => [...prev, data]);
        setDate('');
        setSleepTime('');
        setWakeTime('');
      } else {
        alert(data.message || 'Failed to add schedule');
      }
    } catch {
      alert('Server error adding schedule');
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Welcome, {user.email}</h2>
        <button onClick={() => { logout(); navigate('/login'); }} className="logout-btn">Logout</button>
      </div>

      <form onSubmit={handleAddSchedule} className="schedule-form">
        <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
        <input type="time" value={sleepTime} onChange={e => setSleepTime(e.target.value)} required />
        <input type="time" value={wakeTime} onChange={e => setWakeTime(e.target.value)} required />
        <button type="submit">Add Schedule</button>
      </form>

      <h3>Your Sleep Schedules</h3>
      <canvas ref={chartRef} width="600" height="300"></canvas>

      <ul className="schedule-list">
        {schedules.map((s) => (
          <li key={s._id}>
            <strong>{s.date}</strong>: Sleep at {s.sleepTime}, Wake at {s.wakeTime}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
