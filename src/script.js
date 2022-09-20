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

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[day];
}

document.querySelector("#date").innerHTML = formatDate(new Date());
document.querySelector("#time").innerHTML = formatTime(new Date());

function currentTemperature(response) {
  document.querySelector("#city").innerHTML = response.data.name;
  celciusTemperature = response.data.main.temp;
  document.querySelector("#currentDegrees").innerHTML =
    Math.round(celciusTemperature);
  let iconCode = response.data.weather[0].icon;
  document
    .querySelector("#currentIcon")
    .setAttribute(
      "src",
      `https://openweathermap.org/img/wn/${iconCode}@2x.png`
    );
  document.querySelector("#windSpeed").innerHTML = `${Math.round(
    response.data.wind.speed
  )} km/h`;
  document.querySelector("#tempDescription").innerHTML =
    response.data.weather[0].description;
  document.querySelector("#feelsLike").innerHTML = `${Math.round(
    response.data.main.feels_like
  )}°C`;
  document.querySelector(
    "#humidity"
  ).innerHTML = `${response.data.main.humidity}%`;
  getForecast(response.data.coord);
}

function getForecast(coordinates) {
  let apiKey = "9eca7aac0b071aa16e3cb063adba0785";
  axios
    .get(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`
    )
    .then(displayForecast);
}

function displayForecast(response) {
  console.log(response);
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `<div class="col-4">
            ${formatDay(forecastDay.dt)}<br />
          </div>
          <div class="col-2">
            <img src="https://openweathermap.org/img/wn/${
              forecastDay.weather[0].icon
            }@2x.png" class="forecast-icon">
            <br />            
          </div>
          <div class="col-2 forecast-minimum">
            ${Math.round(forecastDay.temp.min)}<br />           
          </div>
          <div class="col-2 bar">
            <hr />
            <br />            
          </div>
          <div class="col-2 forecast-maximum">
            ${Math.round(forecastDay.temp.max)}<br />            
          </div>`;
    }
    forecastHTML = forecastHTML + `</div>`;
    forecastElement.innerHTML = forecastHTML;
  });
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
