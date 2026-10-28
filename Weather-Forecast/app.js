const API_KEY = "16ed7edbf9b5e7f9187208e9c65b761c";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

async function getWeather() {

    const cityInput = document.getElementById("cityInput");
    const cityName = cityInput.value.trim(); 

    if (cityName === "") {
        alert("Please enter a city name!");
        return;
    }

    hideElement("errorMessage");
    hideElement("weatherCard");
    hideElement("forecastSection");

    showElement("loadingSpinner");

    try {
        const weatherData = await fetchCurrentWeather(cityName);

        const forecastData = await fetchForecast(cityName);

        hideElement("loadingSpinner");

        displayCurrentWeather(weatherData);
        displayForecast(forecastData);

        cityInput.value = "";

    } catch (error) {
        console.log("Error fetching weather:", error.message);

        hideElement("loadingSpinner");
        showElement("errorMessage");
    }
}

async function fetchCurrentWeather(city) {
    const url = `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("City not found");
    }

    const data = await response.json();
    return data;
}

async function fetchForecast(city) {
    const url = `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Forecast not available");
    }

    const data = await response.json();
    return data;
}

function displayCurrentWeather(data) {
    const city        = data.name;
    const country     = data.sys.country;
    const temp        = Math.round(data.main.temp);
    const feelsLike   = Math.round(data.main.feels_like);
    const humidity    = data.main.humidity;
    const windSpeed   = Math.round(data.wind.speed * 3.6);
    const pressure    = data.main.pressure;
    const description = data.weather[0].description;
    const weatherMain = data.weather[0].main;
    const isNight     = data.dt > data.sys.sunset || data.dt < data.sys.sunrise;

    document.getElementById("cityName").textContent    = city;
    document.getElementById("countryName").textContent = `📍 ${country}`;
    document.getElementById("temperature").textContent  = `${temp}°C`;
    document.getElementById("weatherDesc").textContent  = description;
    document.getElementById("humidity").textContent     = `${humidity}%`;
    document.getElementById("windSpeed").textContent    = `${windSpeed} km/h`;
    document.getElementById("pressure").textContent    = `${pressure} hPa`;
    document.getElementById("feelsLike").textContent   = `${feelsLike}°C`;

    const icon = getWeatherEmoji(weatherMain, isNight);
    document.getElementById("weatherIcon").textContent = icon;

    changeBackground(weatherMain, isNight);

    showElement("weatherCard");
}

function displayForecast(data) {
    const forecastContainer = document.getElementById("forecastCards");

    forecastContainer.innerHTML = "";

    const dailyForecasts = [];
    const seenDays = []; 

    for (let i = 0; i < data.list.length; i++) {
        const item = data.list[i];

        const date = item.dt_txt.split(" ")[0];

        if (!seenDays.includes(date) && item.dt_txt.includes("12:00:00")) {
            seenDays.push(date);
            dailyForecasts.push(item);
        }

        if (dailyForecasts.length === 5) break;
    }

    if (dailyForecasts.length < 5) {
        for (let i = 0; i < data.list.length; i++) {
            const item = data.list[i];
            const date = item.dt_txt.split(" ")[0];
            if (!seenDays.includes(date)) {
                seenDays.push(date);
                dailyForecasts.push(item);
            }
            if (dailyForecasts.length === 5) break;
        }
    }

    dailyForecasts.map(function(forecast) {
        const dateObj = new Date(forecast.dt_txt);
        const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" });

        const temp     = Math.round(forecast.main.temp);
        const tempMin  = Math.round(forecast.main.temp_min);
        const tempMax  = Math.round(forecast.main.temp_max);
        const weather  = forecast.weather[0].main;
        const icon     = getWeatherEmoji(weather, false);

        const card = document.createElement("div");
        card.className = "forecast-card";

        card.innerHTML = `
            <span class="forecast-day">${dayName}</span>
            <span class="forecast-icon">${icon}</span>
            <span class="forecast-temp-high">↑ ${tempMax}°</span>
            <span class="forecast-temp-low">↓ ${tempMin}°</span>
        `;
        
        forecastContainer.appendChild(card);
    });

    showElement("forecastSection");
}

function getWeatherEmoji(weatherMain, isNight) {
        switch (weatherMain) {
        case "Clear":
            return isNight ? "🌙" : "☀️";
        case "Clouds":
            return "☁️";
        case "Rain":
            return "🌧️";
        case "Drizzle":
            return "🌦️";
        case "Thunderstorm":
            return "⛈️";
        case "Snow":
            return "❄️";
        case "Mist":
        case "Fog":
        case "Haze":
            return "🌫️";
        case "Tornado":
            return "🌪️";
        default:
            return "🌤️";  
            }
}

function changeBackground(weatherMain, isNight) {
    document.body.classList.remove("sunny-bg", "rainy-bg", "night-bg", "snowy-bg");

    if (isNight) {
        document.body.classList.add("night-bg");
    } else if (weatherMain === "Clear") {
        document.body.classList.add("sunny-bg");
    } else if (weatherMain === "Rain" || weatherMain === "Drizzle" || weatherMain === "Thunderstorm" || weatherMain === "Clouds") {
        document.body.classList.add("rainy-bg");
    } else if (weatherMain === "Snow") {
        document.body.classList.add("snowy-bg");
    }
}

function showElement(elementId) {
    document.getElementById(elementId).classList.remove("hidden");
}

function hideElement(elementId) {
    document.getElementById(elementId).classList.add("hidden");
}

document.getElementById("cityInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        getWeather(); 
    }
});