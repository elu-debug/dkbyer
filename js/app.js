const apiKey = '4026be34041646fbd34bb6757ed62cbf'; 
let map;
let markers;

let allCities = [];

initMap();
loadCSV();

function initMap() {

  map = L.map('map').setView([56.2, 10.2], 7);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
  }).addTo(map);

  markers = L.markerClusterGroup();
  map.addLayer(markers);
}
async function loadCSV() {

  const res = await fetch("dk.csv");
  const text = await res.text();

  Papa.parse(text, {
    header: true,
    skipEmptyLines: true,
    complete: function(results) {

      allCities = results.data;

      createMarkers(allCities);
    }
  });
}

function createMarkers(cities) {

  markers.clearLayers();

  cities.forEach(city => {

    const lat = parseFloat(city.lat);
    const lng = parseFloat(city.lng);

    if (!lat || !lng) return;

    const marker = L.marker([lat, lng]);

    marker.on("click", async () => {

      const weather = await getWeather(lat, lng, city.city);

      if (!weather) {
        marker.bindPopup("Kunne ikke hente vejr").openPopup();
        return;
      }

      const iconUrl =
        `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;

      marker.bindPopup(`
        <b>${weather.city}</b><br><br>

        <img src="${iconUrl}"><br>

        🌤 ${weather.desc}<br><br>

        🌡 <b>${weather.temp} °C</b><br>
        🤗 Føles som ${weather.feels_like} °C<br>
        💧 ${weather.humidity}%<br>
        🌬 ${weather.wind} m/s, ${weather.wind * 3.6 } km/t<br>
        📈 ${weather.pressure} hPa, ${Number(weather.pressure/1013.25).toFixed(2)} bar

      `).openPopup();

    });

    markers.addLayer(marker);
  });
}

  console.log("Byer loaded:", cities.length);


document.getElementById("searchBox").addEventListener("input", function(e) {

  const value = e.target.value.toLowerCase();

  const filtered = allCities.filter(c =>
    c.city && c.city.toLowerCase().includes(value)
  );

  createMarkers(filtered);
});