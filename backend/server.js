const express = require('express');
const authRoutes = require('./routes/auth');


const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();   // <-- app must be defined before using it

app.use('/api', authRoutes);

app.use(cors());
app.use(express.json());

  // require after app declaration

app.use('/api/auth', authRoutes);  // use routes after app defined

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error(err));

// your sleepSchema and routes here...

app.listen(5000, () => console.log("Server started on port 5000"));
