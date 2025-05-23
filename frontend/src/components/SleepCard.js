import React from 'react';

function SleepCard({ date, sleepTime, wakeTime }) {
  return (
    <div style={styles.card}>
      <h4 style={styles.date}>{date}</h4>
      <p style={styles.time}>
        <strong>Sleep:</strong> {sleepTime} &nbsp; | &nbsp; <strong>Wake:</strong> {wakeTime}
      </p>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: '#f5f8fa',
    padding: '12px 20px',
    marginBottom: '10px',
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  },
  date: {
    margin: 0,
    fontWeight: '600',
    color: '#333',
  },
  time: {
    margin: '6px 0 0',
    color: '#666',
  }
};

export default SleepCard;
