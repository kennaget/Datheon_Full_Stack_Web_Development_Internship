const API_KEY = "16ed7edbf9b5e7f9187208e9c65b761c";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

const FORECAST_DAYS = 5;
const NOON = "12:00:00";
const KMH_PER_METER_PER_SECOND = 3.6;

const RAINY_WEATHER = ["Rain", "Drizzle", "Thunderstorm", "Clouds"];
const BACKGROUND_CLASSES = [
    "sunny-background",
    "rainy-background",
    "night-background",
    "snowy-background"
];

const cityInput = document.getElementById("cityInput");
const loadingSpinner = document.getElementById("loadingSpinner");
const errorMessage = document.getElementById("errorMessage");
const weatherCard = document.getElementById("weatherCard");
const forecastSection = document.getElementById("forecastSection");
const forecastCards = document.getElementById("forecastCards");

const cityNameText = document.getElementById("cityName");
const countryNameText = document.getElementById("countryName");
const weatherIcon = document.getElementById("weatherIcon");
const temperatureText = document.getElementById("temperature");
const weatherDescriptionText = document.getElementById("weatherDescription");
const humidityText = document.getElementById("humidity");
const windSpeedText = document.getElementById("windSpeed");
const pressureText = document.getElementById("pressure");
const feelsLikeText = document.getElementById("feelsLike");


async function getWeather() {
    const city = cityInput.value.trim();

    if (city === "") {
        alert("Please enter a city name!");
        return;
    }

    hideElement(errorMessage);
    hideElement(weatherCard);
    hideElement(forecastSection);
    showElement(loadingSpinner);

    try {
        const currentWeather = await fetchCurrentWeather(city);
        const forecast = await fetchForecast(city);

        hideElement(loadingSpinner);
        showCurrentWeather(currentWeather);
        showForecast(forecast);

        cityInput.value = "";
    } catch (error) {
        console.log("Error fetching weather:", error.message);

        hideElement(loadingSpinner);
        showElement(errorMessage);
    }
}


function fetchCurrentWeather(city) {
    return fetchJson("weather", city, "City not found");
}

function fetchForecast(city) {
    return fetchJson("forecast", city, "Forecast not available");
}

async function fetchJson(endpoint, city, errorText) {
    const url = `${BASE_URL}/${endpoint}?q=${city}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(errorText);
    }

    return response.json();
}


function showCurrentWeather(data) {
    const weatherType = data.weather[0].main;
    const isNight = isNightTime(data);

    cityNameText.textContent = data.name;
    countryNameText.textContent = `📍 ${data.sys.country}`;
    temperatureText.textContent = `${Math.round(data.main.temp)}°C`;
    weatherDescriptionText.textContent = data.weather[0].description;
    humidityText.textContent = `${data.main.humidity}%`;
    windSpeedText.textContent = `${convertToKmh(data.wind.speed)} km/h`;
    pressureText.textContent = `${data.main.pressure} hPa`;
    feelsLikeText.textContent = `${Math.round(data.main.feels_like)}°C`;

    weatherIcon.textContent = getWeatherEmoji(weatherType, isNight);
    changeBackground(weatherType, isNight);

    showElement(weatherCard);
}

function isNightTime(data) {
    return data.dt > data.sys.sunset || data.dt < data.sys.sunrise;
}

function convertToKmh(metersPerSecond) {
    return Math.round(metersPerSecond * KMH_PER_METER_PER_SECOND);
}


function showForecast(data) {
    const dailyForecasts = pickDailyForecasts(data.list);

    forecastCards.innerHTML = "";

    for (const forecast of dailyForecasts) {
        forecastCards.appendChild(createForecastCard(forecast));
    }

    showElement(forecastSection);
}

function pickDailyForecasts(forecastList) {
    const dailyForecasts = [];
    const seenDays = [];

    for (const item of forecastList) {
        const day = getForecastDay(item);
        const isNoon = item.dt_txt.includes(NOON);

        if (!seenDays.includes(day) && isNoon) {
            seenDays.push(day);
            dailyForecasts.push(item);
        }

        if (dailyForecasts.length === FORECAST_DAYS) break;
    }

    if (dailyForecasts.length < FORECAST_DAYS) {
        for (const item of forecastList) {
            const day = getForecastDay(item);

            if (!seenDays.includes(day)) {
                seenDays.push(day);
                dailyForecasts.push(item);
            }

            if (dailyForecasts.length === FORECAST_DAYS) break;
        }
    }

    return dailyForecasts;
}

function getForecastDay(forecastItem) {
    return forecastItem.dt_txt.split(" ")[0];
}

function createForecastCard(forecast) {
    const date = new Date(forecast.dt_txt);
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
    const highTemperature = Math.round(forecast.main.temp_max);
    const lowTemperature = Math.round(forecast.main.temp_min);
    const icon = getWeatherEmoji(forecast.weather[0].main, false);

    const card = document.createElement("div");
    card.className = "forecast-card";
    card.innerHTML = `
        <span class="forecast-day">${dayName}</span>
        <span class="forecast-icon">${icon}</span>
        <span class="forecast-high">↑ ${highTemperature}°</span>
        <span class="forecast-low">↓ ${lowTemperature}°</span>
    `;

    return card;
}


function getWeatherEmoji(weatherType, isNight) {
    switch (weatherType) {
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

function changeBackground(weatherType, isNight) {
    document.body.classList.remove(...BACKGROUND_CLASSES);

    if (isNight) {
        document.body.classList.add("night-background");
    } else if (weatherType === "Clear") {
        document.body.classList.add("sunny-background");
    } else if (RAINY_WEATHER.includes(weatherType)) {
        document.body.classList.add("rainy-background");
    } else if (weatherType === "Snow") {
        document.body.classList.add("snowy-background");
    }
}


function showElement(element) {
    element.classList.remove("hidden");
}

function hideElement(element) {
    element.classList.add("hidden");
}


cityInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        getWeather();
    }
});
