import _ from 'lodash';
import './style.css';

const dayTemplate = document.querySelector('[data-day-template]');
const hoursTemplate = document.querySelector('[data-hours-template');

async function getData(){
    const weatherURL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/london?key=A6M43K4MK42TMSVWHGFK3F4X8';
    const response = await fetch(weatherURL, {mode: 'cors'});
    const data = await response.json();
    console.log(data);
    return data;
}
const weatherData = await getData();

function parseCurrentWeather(data){
    const {
        conditions,
        datetime: time,
        icon,
        temp,
    } = data.currentConditions;

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
        lowTemp
    }
}

function parseDailyWeather({days}){
    return Object.entries(days).map(([day, data]) => {
        return {
            day: day,
            date: data.datetime,
            icon: data.icon,
            tempMax: data.tempmax,
            tempMin: data.tempmin,
            hours: parseHourlyCurrWeather(data.hours)
        }
    })
}

function parseHourlyCurrWeather(hours){
    return Object.entries(hours).map(([hour, data]) => {
        return {
            hour: hour,
            time: data.datetime,
            icon: data.icon,
            temp: data.temp
        }
    })
}


const currentWeather = parseCurrentWeather(weatherData);
const dailyWeather = parseDailyWeather(weatherData);
console.log(dailyWeather)
/* RENDER DATA */

function renderCurrentWeather(weatherObj){
    const currWeatherSection = document.querySelector('#current-weather');
    currWeatherSection.querySelector('[data-current-location]').innerText = weatherObj.location;
    currWeatherSection.querySelector('[data-current-time]').innerText = weatherObj.time;
    currWeatherSection.querySelector('[data-current-icon]').innerText = weatherObj.icon;
    currWeatherSection.querySelector('[data-current-conditions]').innerText = weatherObj.conditions;
    currWeatherSection.querySelector('[data-current-temp]').innerText = weatherObj.temp;
    currWeatherSection.querySelector('[data-current-temp-high]').innerText = weatherObj.highTemp;
    currWeatherSection.querySelector('[data-current-temp-low]').innerText = weatherObj.lowTemp;
}

function renderDaysWeather(weatherObj){
    const weekViewContainer = document.querySelector('#week_view');
    weatherObj.forEach(day => {
        const dayContainer = dayTemplate.content.cloneNode(true);
        dayContainer.querySelector('[data-date]').innerText = day.date;
        dayContainer.querySelector('[data-day-icon]').innerText = day.icon;
        dayContainer.querySelector('[data-temp-high]').innerText = day.tempMax;
        dayContainer.querySelector('[data-temp-low]').innerText = day.tempMin;

        weekViewContainer.appendChild(dayContainer);
    });
}

function renderCurrHourly(weatherObj){
    let todayHours = weatherObj[0].hours;
    console.log(todayHours);
    const currHoursContainer = document.querySelector('#current-hours');
    todayHours.forEach(hour => {
        const hourContainer = hoursTemplate.content.cloneNode(true);
        hourContainer.querySelector('[data-time]').innerText = hour.time;
        hourContainer.querySelector('[data-hour-icon]').innerText = hour.icon;
        hourContainer.querySelector('[data-hour-temp]').innerText = hour.temp;

        currHoursContainer.appendChild(hourContainer);
    })
    

}

renderCurrentWeather(currentWeather);
renderDaysWeather(dailyWeather);
renderCurrHourly(dailyWeather)