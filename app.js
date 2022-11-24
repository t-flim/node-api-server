require("dotenv").config();
const cors = require("cors");
const express = require("express");
const fetch = require("node-fetch");
const bodyParser = require("body-parser");

const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(bodyParser.urlencoded({ extended: true }));

// random-quote-api
app.get("/api/random-quote", (req, res) => {
  const url = "https://quotes15.p.rapidapi.com/quotes/random/";

  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": process.env.X_RAPIDAPI_KEY,
      "X-RapidAPI-Host": process.env.X_RAPIDAPI_HOST,
    },
  };

  fetch(url, options)
    .then((res) => res.json())
    .then((data) => res.send(data))
    .catch((err) => res.send(err));
});


// random-user-api
app.get("/api/user", (req, res) => {
  const size = req.query.size || 1
  const url = `${process.env.RANDOM_DATA_API_URL}users?size=${size}`;

  fetch(url, {method: "GET"})
    .then((res) => res.json())
    .then((data) => res.send(data))
    .catch((err) => res.send(err));
});


// weather-api
app.get("/api/weather", (req, res) => {
  const endPoint = process.env.WEATHER_API_URL;
  const appId = process.env.WEATHER_API_ID;
  const { cityName, units } = req.query;
  const unitMeasurement = units || "metric";
  const params = `q=${cityName}&units=${unitMeasurement}&appId=${appId}`;
  const weatherUrl = `${endPoint}weather?${params}`;
  const forecastUrl = `${endPoint}forecast?${params}`;

  // res.send({weatherUrl, forecastUrl});
  const weatherReq = fetch(weatherUrl);
  const forecastReq = fetch(forecastUrl);

  Promise.all([weatherReq, forecastReq])
    .then((responses) => {
      return Promise.all(
        responses.map((response) => {
          return response.json();
        })
      );
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.send(err);
    });
});

module.exports = app;
