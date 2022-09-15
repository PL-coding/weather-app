function formatDate(date) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let dayIndex = date.getDay();
  let day = days[dayIndex];
  let month = months[date.getMonth()];
  let currentDate = date.getDate();
  return `${day}, ${currentDate} ${month}`;
}

function formatTime(time) {
  let hour = time.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }
  let minute = time.getMinutes();
  if (minute < 10) {
    minute = `0${minute}`;
  }
  return `${hour}:${minute}  `;
}

let currently = new Date();
document.querySelector("#date").innerHTML = formatDate(new Date());
document.querySelector("#time").innerHTML = formatTime(new Date());

function currentTemperature(response) {
  document.querySelector("#city").innerHTML = response.data.name;
  document.querySelector("#currentDegrees").innerHTML = Math.round(
    response.data.main.temp
  );
  document.querySelector("#feelsLike").innerHTML = `${Math.round(
    response.data.main.feels_like
  )}°C`;
  document.querySelector(
    "#humidity"
  ).innerHTML = `${response.data.main.humidity}%`;
}

function searchCity(city) {
  let apiKey = "9eca7aac0b071aa16e3cb063adba0785";
  let apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=";
  axios
    .get(`${apiUrl}${city}&appid=${apiKey}&units=metric`)
    .then(currentTemperature);
}

function changeCity(event) {
  event.preventDefault();
  let city = document.querySelector("#selected-city").value;
  searchCity(city);
}

document.querySelector("#change-city").addEventListener("submit", changeCity);
document.querySelector("#myLocation").addEventListener("click", geolocate);

function geolocate(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(uploadCoordinates);
  function uploadCoordinates(response) {
    let apiKey = "9eca7aac0b071aa16e3cb063adba0785";
    let apiUrl = "https://api.openweathermap.org/data/2.5/weather?";
    axios
      .get(
        `${apiUrl}lat=${response.coords.latitude}&lon=${response.coords.longitude}&appid=${apiKey}&units=metric`
      )
      .then(currentTemperature);
  }
}

searchCity("Sydney");
