const express = require('express');
const jwt = require('jsonwebtoken');
const SleepSchedule = require('../models/SleepSchedule');

const router = express.Router();

const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token found' });

  try {
    console.log('Verifying token:', token);
    console.log('Using secret:', process.env.JWT_SECRET);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email }
    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

router.get('/', authMiddleware, async (req, res) => {
  try {
    const schedules = await SleepSchedule.find({ userId: req.user.id });
    res.json(schedules);
  } catch (err) {
    console.error('Error fetching schedules:', err.message);
    res.status(500).json({ message: 'Server error fetching schedules' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  const { sleepTime, wakeTime, date } = req.body;
  if (!sleepTime || !wakeTime || !date) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newSchedule = new SleepSchedule({
      userId: req.user.id,
      sleepTime,
      wakeTime,
      date,
    });

    const saved = await newSchedule.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error saving schedule:', err.message);
    res.status(500).json({ message: 'Server error adding schedule' });
  }
});

module.exports = router;
