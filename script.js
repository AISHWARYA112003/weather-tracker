// script.js
const API_URL = 'http://localhost:5000/api';

// Get weather information
async function getWeather() {
  const city = document.getElementById('cityInput').value;
  if (!city) return;

  try {
    const response = await fetch(`${API_URL}/weather/${city}`);
    const data = await response.json();

    if (data.message) {
      document.getElementById('weatherInfo').innerText = 'City not found.';
      return;
    }

    document.getElementById('weatherInfo').innerHTML = `
      <h3>Weather in ${data.name}</h3>
      <p>Temperature: ${data.main.temp}°C</p>
      <p>Weather: ${data.weather[0].description}</p>
      <p>Humidity: ${data.main.humidity}%</p>
    `;

    fetchHistory();
  } catch (error) {
    document.getElementById('weatherInfo').innerText = 'Error fetching weather data.';
  }
}

// Fetch search history
async function fetchHistory() {
  const response = await fetch(`${API_URL}/history`);
  const history = await response.json();
  const searchHistory = document.getElementById('searchHistory');
  searchHistory.innerHTML = '';
  history.forEach(entry => {
    const li = document.createElement('li');
    li.textContent = `${entry.city} - ${new Date(entry.date).toLocaleString()}`;
    searchHistory.appendChild(li);
  });
}

// Load search history on page load
fetchHistory();
