//const apiKey = '4026be34041646fbd34bb6757ed62cbf';  // Replace with your OpenWeatherMap API key
const weatherCache = {};

async function getWeather(lat, lon, cityName) {

  const key = `${lat},${lon}`;

  // CACHE
  if (weatherCache[key]) {
    console.log("CACHE:", cityName);
    return weatherCache[key];
  }

  const url =
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&lang=da&units=metric`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    const weather = {
      city: cityName,
      desc: data.weather[0].description,
      icon: data.weather[0].icon,
      temp: data.main.temp,
      feels_like: data.main.feels_like,
      humidity: data.main.humidity,
      wind: data.wind.speed,
      pressure: data.main.pressure
    };

    weatherCache[key] = weather;
    return weather;

  } catch (err) {
    console.error(err);
    return null;
  }
}