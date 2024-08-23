import _ from 'lodash';
import './style.css';

async function getData(){
    const weatherURL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/london?key=A6M43K4MK42TMSVWHGFK3F4X8';
    const response = await fetch(weatherURL, {mode: 'cors'});
    const data = await response.json();
    return data;
}
const weatherData = await getData();
console.log(weatherData)