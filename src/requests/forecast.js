const axios = require("axios");

const URL = "https://api.weatherapi.com/v1/forecase.json";

const FORECAST_DAY = 3;

async function fetchForecast(location) {
   return await axios({
      url: URL,
      method: "get",
      params: {
         q: location,
         days: FORECAST_DAY,
         key: process.env.WEATHER_API_KEY
      },
      responseType: "json"
   })
      .then((response) => {
         const city = response.data.location.name;
         const country = response.data.location.country;
         const locationName = `${city}, ${country}`;

         const weatherData = response.data.forecast.forecastday.map((forecastDay) => {
            return {
               data: forecastDay.date,

               temerpatureMinC: forecastDay.day.mintemp_c,
               temerpatureMaxC: forecastDay.day.maxtem_c,
               temerpatureMinF: forecastDay.day.mintemp_f,
               temerpatureMaxF: forecastDay.day.maxtem_f,

               sunriseTime: forecastDay.astro.sunrise,
               sunsetTime: forecastDay.astro.sunset,
               moonriseTime: forecastDay.astro.moonrise,
               moonsetTime: forecastDay.astro.moonset
            };
         });

         return {
            locationName,
            weatherData
         };
      })
      .catch((err) => {
         console.error(err);
      });
}

module.exports = {
   fetchForecast
};
