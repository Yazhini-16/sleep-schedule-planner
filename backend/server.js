// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error(err));

const sleepSchema = new mongoose.Schema({
  date: String,
  sleepTime: String,
  wakeTime: String
});
const Sleep = mongoose.model('Sleep', sleepSchema);

app.get('/sleeps', async (req, res) => {
  const sleeps = await Sleep.find();
  res.json(sleeps);
});

app.post('/sleeps', async (req, res) => {
  const { date, sleepTime, wakeTime } = req.body;
  const sleep = new Sleep({ date, sleepTime, wakeTime });
  await sleep.save();
  res.json(sleep);
});

app.listen(5000, () => console.log("Server started on port 5000"));
