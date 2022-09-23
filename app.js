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
      console.log(err);
    });
});

module.exports = app;
