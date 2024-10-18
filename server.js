// server.js
const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 5000;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/weatherapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

// Weather search schema and model
const searchSchema = new mongoose.Schema({
  city: String,
  date: { type: Date, default: Date.now }
});

const Search = mongoose.model('Search', searchSchema);

// Get weather data from external API
app.get('/api/weather/:city', async (req, res) => {
  const city = req.params.city;
  try {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`);
    const weatherData = response.data;

    // Save search history in MongoDB
    const search = new Search({ city });
    await search.save();

    res.json(weatherData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching weather data' });
  }
});

// Get search history
app.get('/api/history', async (req, res) => {
  const history = await Search.find().sort({ date: -1 });
  res.json(history);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
