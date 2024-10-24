import _ from "lodash";
import "./style.css";

const dayTemplate = document.querySelector("[data-day-template]");
const hoursTemplate = document.querySelector("[data-hours-template]");
const searchButton = document.querySelector("#search-btn");

searchButton.addEventListener("click", (e) => {
  e.preventDefault();
  if (e.target.tagName.toLowerCase() === "button") {
    const location = e.target.parentElement[0].value;
    getWeather(location);
  }
});

async function getWeather(location) {
  const response = await fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=A6M43K4MK42TMSVWHGFK3F4X8`,
    {
      mode: "cors",
    }
  );
  const data = await response.json();

  const currWeather = parseCurrentWeather(data);
  const dailyWeather = parseDailyWeather(data);
  parseHourlyCurrWeather(data);

  renderCurrentWeather(currWeather);
  renderDaysWeather(dailyWeather);
  renderCurrHourly(dailyWeather);
}

function parseCurrentWeather(data) {
  const { conditions, datetime: time, icon, temp } = data.currentConditions;

  const location = data.resolvedAddress;
  const highTemp = data.days[0].tempmax;
  const lowTemp = data.days[0].tempmin;

  return {
    conditions,
    time,
    icon,
    temp,
    location,
    highTemp,
    lowTemp,
  };
}

function parseDailyWeather({ days }) {
  return Object.entries(days).map(([day, data]) => {
    return {
      day: day,
      date: data.datetime,
      icon: data.icon,
      tempMax: data.tempmax,
      tempMin: data.tempmin,
      hours: parseHourlyCurrWeather(data.hours),
    };
  });
}

function parseHourlyCurrWeather(hours) {
  return Object.entries(hours).map(([hour, data]) => {
    return {
      hour: hour,
      time: data.datetime,
      icon: data.icon,
      temp: data.temp,
    };
  });
}

/* RENDER DATA */

function renderCurrentWeather(weatherObj) {
  const currWeatherSection = document.querySelector("#current-weather");
  currWeatherSection.querySelector("[data-current-location]").innerText =
    weatherObj.location;
  currWeatherSection.querySelector("[data-current-time]").innerText =
    weatherObj.time;
  currWeatherSection.querySelector("[data-current-icon]").className =
    renderIcon(weatherObj.icon);
  currWeatherSection.querySelector("[data-current-conditions]").innerText =
    weatherObj.conditions;
  currWeatherSection.querySelector("[data-current-temp]").innerText =
    weatherObj.temp;
  currWeatherSection.querySelector("[data-current-temp-high]").innerText =
    weatherObj.highTemp;
  currWeatherSection.querySelector("[data-current-temp-low]").innerText =
    weatherObj.lowTemp;
}

function renderDaysWeather(weatherObj) {
  const weekViewContainer = document.querySelector("#week_view");
  weekViewContainer.innerHTML = "";

  weatherObj.forEach((day) => {
    const dayContainer = dayTemplate.content.cloneNode(true);
    dayContainer.querySelector("[data-date]").innerText = day.date;
    dayContainer.querySelector("[data-day-icon]").className = renderIcon(
      day.icon
    );
    dayContainer.querySelector("[data-temp-high]").innerText = day.tempMax;
    dayContainer.querySelector("[data-temp-low]").innerText = day.tempMin;

    weekViewContainer.appendChild(dayContainer);
  });
}

function renderCurrHourly(weatherObj) {
  let todayHours = weatherObj[0].hours;
  const currHoursContainer = document.querySelector("#current-hours");
  currHoursContainer.innerHTML = "";

  todayHours.forEach((hour) => {
    const hourContainer = hoursTemplate.content.cloneNode(true);
    hourContainer.querySelector("[data-time]").innerText = hour.time;
    hourContainer.querySelector("[data-hour-icon]").className = renderIcon(
      hour.icon
    );
    hourContainer.querySelector("[data-hour-temp]").innerText = hour.temp;

    currHoursContainer.appendChild(hourContainer);
  });
}

//render different icons
function renderIcon(iconId) {
  switch (iconId) {
    case "snow":
      return "fa-regular fa-snowflake";
    case "rain":
      return "fa-solid fa-cloud-rain";
    case "fog":
      return "fa-solid fa-smog";
    case "wind":
      return "fa-solid fa-wind";
    case "cloudy":
      return "fa-solid fa-cloud";
    case "partly-cloudy-day":
      return "fa-solid fa-cloud-sun";
    case "partly-cloudy-night":
      return "fa-solid fa-cloud-moon";
    case "clear-day":
      return "fa-solid fa-sun";
    case "clear-night":
      return "fa-regular fa-moon";
    default:
  }
}
