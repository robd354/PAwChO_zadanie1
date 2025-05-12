const API_KEY   = 'd507a529f2b0b9ea7101f42775511dda';
const form      = document.getElementById('form-weather');
const outputDiv = document.getElementById('weather-output');
const select    = document.getElementById('city-select');

form.addEventListener('submit', async e => {
  e.preventDefault();
  const city = select.value;
  const url  = `http://api.weatherstack.com/current?access_key=${API_KEY}&query=${encodeURIComponent(city)}&units=m`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`network error: ${res.status}`);
    const data = await res.json();

    if (data.error) {
      throw new Error(data.error.info || 'unknown API error');
    }

    const cur = data.current;
    outputDiv.innerHTML = `
      <h2>${data.location.name}, ${data.location.country}</h2>
      <ul>
        <li>Temperature: ${cur.temperature.toFixed(1)} °C</li>
        <li>Description: ${cur.weather_descriptions[0]}</li>
        <li>Humidity: ${cur.humidity}%</li>
        <li>Wind speed: ${cur.wind_speed} m/s</li>
      </ul>
    `;
  } catch (err) {
    outputDiv.textContent = `Something went wrong: ${err.message}`;
  }
});
