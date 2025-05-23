const mongoose = require('mongoose');

const sleepScheduleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  sleepTime: { type: String, required: true },
  wakeTime: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('SleepSchedule', sleepScheduleSchema);
