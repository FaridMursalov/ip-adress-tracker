const form = document.querySelector("form");
const input = document.querySelector("input");
const ipAddress = document.querySelector(".ipAddress");
const Location = document.querySelector(".location");
const timezone = document.querySelector(".timezone");
const isp = document.querySelector(".isp");

var map = L.map("map");
map.setView([40.409264, 49.867092], 13);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

function addMarkerAndCircle(lat, lng, accuracy) {
 
  map.eachLayer(function (layer) {
    if (layer instanceof L.Marker || layer instanceof L.Circle) {
      map.removeLayer(layer);
    }
  });

  
  const marker = L.marker([lat, lng]).addTo(map);
  const circle = L.circle([lat, lng], {
    radius: accuracy,
  }).addTo(map);

  map.fitBounds(circle.getBounds());
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  e.stopPropagation();
  ipAdress();
});

ipAdress();
function ipAdress() {
  fetch(
    `https://geo.ipify.org/api/v2/country,city?apiKey=at_zy6RhW3pldXrXrNPIkLGmFACcb0y5&ipAddress=${input.value}`
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);

      ipAddress.innerHTML = data.ip;
      Location.innerHTML = `${data.location.country}, ${
        data.location.region ? data.location.region : ""
      }`;
      timezone.innerHTML = `UTC ${data.location.timezone}`;
      isp.innerHTML = data.isp;
      if (input.value) {
        const lat = data.location.lat;
        const lng = data.location.lng;
        const accuracy = data.accuracy;
        map.setView([lat, lng], 13);

        L.marker([lat, lng]).addTo(map);

        addMarkerAndCircle(lat, lng, accuracy);
      }
    });
}
var marker = L.marker([40.409264, 49.867092]).addTo(map);

navigator.geolocation.watchPosition(success, error);

function success(pos) {
  const lat = pos.coords.latitude;
  const lng = pos.coords.longitude;
  const accuracy = pos.coords.accuracy;
  console.log(lat, lng);

  L.marker([lat, lng]).addTo(map);
  map.setView([lat, lng], 13);
  L.circle([lat, lng], {
    radius: accuracy,
  }).addTo(map);
  addMarkerAndCircle(lat, lng, accuracy);
}

function error(err) {
  if (err.code === 1) {
    console.log("Please allow geolocation access");
  } else {
    console.log("Cannot get current location");
  }
}


