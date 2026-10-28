import { MOVIE_API_KEY } from './config.js';

const weatherForm = document.querySelector('#weather-form');
const cityInput = document.querySelector('#city-input');
const weatherMessage = document.querySelector('#weather-message');
const weatherResult = document.querySelector('#weather-result');

const showWeatherMessage = (message, isError = false) => {
  weatherMessage.textContent = message;
  weatherMessage.classList.toggle('error', isError);
};

const getWeatherDescription = (code) => {
  const descriptions = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog', 48: 'Depositing rime fog',
    51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
    56: 'Freezing drizzle', 57: 'Heavy freezing drizzle',
    61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
    66: 'Freezing rain', 67: 'Heavy freezing rain',
    71: 'Slight snow', 73: 'Moderate snow', 75: 'Heavy snow', 77: 'Snow grains',
    80: 'Slight rain showers', 81: 'Moderate rain showers', 82: 'Violent rain showers',
    85: 'Slight snow showers', 86: 'Heavy snow showers',
    95: 'Thunderstorm', 96: 'Thunderstorm with hail', 99: 'Heavy thunderstorm with hail'
  };
  return descriptions[code] || 'Weather information unavailable';
};

const getWeatherIcon = (code, isDay) => {
  if (code === 0) return isDay ? '☀️' : '🌙';
  if ([1, 2].includes(code)) return isDay ? '🌤️' : '☁️';
  if ([3, 45, 48].includes(code)) return '☁️';
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return '🌧️';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return '❄️';
  if ([95, 96, 99].includes(code)) return '⛈️';
  return '🌤️';
};

const renderWeather = (place, current, daily) => {
  const description = getWeatherDescription(current.weather_code);
  const icon = getWeatherIcon(current.weather_code, current.is_day);
  weatherResult.innerHTML = `
    <div class="weather-top">
      <div>
        <div class="city-name">${place.name}, ${place.country || ''}</div>
        <div class="weather-description">${description}</div>
      </div>
      <div class="weather-icon" aria-hidden="true">${icon}</div>
    </div>
    <div class="temperature">${Math.round(current.temperature_2m)}°C</div>
    <div class="weather-details">
      <div class="detail"><span>Feels like</span><strong>${Math.round(current.apparent_temperature)}°C</strong></div>
      <div class="detail"><span>Humidity</span><strong>${current.relative_humidity_2m}%</strong></div>
      <div class="detail"><span>Wind speed</span><strong>${current.wind_speed_10m} km/h</strong></div>
      <div class="detail"><span>High / low</span><strong>${Math.round(daily.temperature_2m_max[0])}° / ${Math.round(daily.temperature_2m_min[0])}°</strong></div>
    </div>`;
  weatherResult.hidden = false;
};

weatherForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const city = cityInput.value.trim();
  if (!city) return;

  showWeatherMessage('Checking the weather…');
  weatherResult.hidden = true;

  try {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
    const geoResponse = await fetch(geoUrl);
    if (!geoResponse.ok) throw new Error('Could not search for that city. Please try again.');
    const geoData = await geoResponse.json();
    const place = geoData.results?.[0];

    if (!place) throw new Error('City not found. Check the spelling and try again.');

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`;
    const weatherResponse = await fetch(weatherUrl);
    if (!weatherResponse.ok) throw new Error('Weather data is unavailable right now. Please try again.');
    const weatherData = await weatherResponse.json();

    renderWeather(place, weatherData.current, weatherData.daily);
    showWeatherMessage(`Here is the latest weather for ${place.name}.`);
  } catch (error) {
    showWeatherMessage(error.message || 'Something went wrong. Please try again.', true);
  }
});
