// frontend/src/SleepPlanner.js
import { useEffect, useState } from 'react';
import axios from 'axios';

function SleepPlanner() {
  const [form, setForm] = useState({ date: '', sleepTime: '', wakeTime: '' });
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/sleeps').then(res => setSchedules(res.data));
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    axios.post('http://localhost:5000/sleeps', form).then(res => {
      setSchedules([...schedules, res.data]);
      setForm({ date: '', sleepTime: '', wakeTime: '' });
    });
  };

  return (
    <div>
      <h2>Sleep Schedule Planner</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
        <input placeholder="Sleep Time" value={form.sleepTime} onChange={e => setForm({...form, sleepTime: e.target.value})} />
        <input placeholder="Wake Time" value={form.wakeTime} onChange={e => setForm({...form, wakeTime: e.target.value})} />
        <button type="submit">Save</button>
      </form>
      <ul>
        {schedules.map((s, i) => (
          <li key={i}>{s.date}: {s.sleepTime} - {s.wakeTime}</li>
        ))}
      </ul>
    </div>
  );
}

export default SleepPlanner;
