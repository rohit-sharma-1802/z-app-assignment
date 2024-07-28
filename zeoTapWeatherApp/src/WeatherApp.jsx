import React, { useState, useEffect } from "react";
import "./App.css"; 

const WeatherApp = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState("Bangalore");
  const [unit, setUnit] = useState("C");

  const fetchWeather = async (city) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=29bd84e33289f196e453fde9559b7bbd`
      );
      if (!response.ok) {
        alert("No weather found.");
        throw new Error("No weather found.");
      }
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = () => {
    fetchWeather(city);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      fetchWeather(city);
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, [city, unit]);

  const convertTemp = (temp, unit) => {
    if (unit === "F") {
      return ((temp * 9) / 5 + 32).toFixed(2);
    } else if (unit === "K") {
      return (temp + 273.15).toFixed(2);
    } else {
      return temp.toFixed(2);
    }
  };

  if (!weatherData) {
    return <div>Loading...</div>;
  }

  const {
    city: { name },
    list,
  } = weatherData;
  const { icon, description } = list[0].weather[0];
  const { temp, feels_like, humidity, temp_min, temp_max } = list[0].main;
  const { speed } = list[0].wind;
  const datetime = list[0].dt_txt;

  return (
    <div>
      <div id="dropdown">
        <select
          name="degree"
          id="deg"
          className="dropkey"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
        >
          <option value="C">°Celsius ▼</option>
          <option value="K">°Kelvin ▼</option>
          <option value="F">°Fahrenheit ▼</option>
        </select>
      </div>
      <br />
      <div className="topcard">
        <div className="card">
          <div className="search">
            <input
              type="text"
              className="search-bar"
              placeholder="Search"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button onClick={handleSearch}>
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 1024 1024"
                height="1.5em"
                width="1.5em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0 0 11.6 0l43.6-43.5a8.2 8.2 0 0 0 0-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z"></path>
              </svg>
            </button>
          </div>
          <div className="weather loading">
            <h2 className="city">Weather in {name}</h2>
            <h1 className="temp">{convertTemp(temp, unit)}°{unit}</h1>
            <h1 className="temp-feels-like">Feels like: {convertTemp(feels_like, unit)}°{unit}</h1>
            <div className="flex">
              <img
                src={`https://openweathermap.org/img/wn/${icon}.png`}
                alt=""
                className="icon"
              />
              <div className="description">{description}</div>
            </div>
            <p className="dt">Last updated: {datetime}</p>
          </div>
        </div>
        <div className="card2">
          <div className="card">
            <div className="humidity">Humidity: {humidity}%</div>
            <div className="wind">Wind speed: {speed} km/h</div>
          </div>
          <div className="card">
            <h5>Weather Summary</h5>
            <div className="temp-avg">Avg Temp of a day: {convertTemp((temp_min + temp_max) / 2, unit)}°{unit}</div>
            <div className="temp-min">Min Temp of a day: {convertTemp(temp_min, unit)}°{unit}</div>
            <div className="temp-max">Max Temp of a day: {convertTemp(temp_max, unit)}°{unit}</div>
          </div>
        </div>
      </div>
      <div className="bottomcard">
        <div className="card3">
          <h5>Weather forecast</h5>
          <div className="boxes">
            {[6, 12, 18, 24, 30].map((idx, i) => (
              <div className="box" key={i}>
                <img
                  src={`https://openweathermap.org/img/wn/${list[idx].weather[0].icon}.png`}
                  alt=""
                  className={`icon${i + 1}`}
                />
                <div className={`temp${i + 1}`}>
                  {convertTemp(list[idx].main.temp, unit)}°{unit}
                </div>
                <div className={`dt${i + 1} ddt`}>{list[idx].dt_txt}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;
