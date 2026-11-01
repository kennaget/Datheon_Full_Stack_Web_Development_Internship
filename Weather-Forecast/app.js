const API_KEY = "16ed7edbf9b5e7f9187208e9c65b761c";
const BASE_URL = "https://api.openweathermap.org/data/2.5";
const GEO_URL = "https://api.openweathermap.org/geo/1.0/direct";

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

const CITY_MISSPELLINGS = {
    "mokadisho": "Mogadishu",
    "mogadisho": "Mogadishu",
    "addis abeba": "Addis Ababa",
    "addis": "Addis Ababa",
    "nairobi": "Nairobi",
    "london": "London",
    "paris": "Paris",
    "new york": "New York",
    "tokyo": "Tokyo",
    "dubai": "Dubai",
    "cairo": "Cairo"
};

const cityInput = document.getElementById("cityInput");
const suggestionsBox = document.getElementById("suggestionsBox");
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

let searchTimeout;


async function getWeather() {
    let city = cityInput.value.trim();

    if (city === "") {
        alert("Please enter a city or street name!");
        return;
    }

    const lowerCity = city.toLowerCase();
    if (CITY_MISSPELLINGS[lowerCity]) {
        city = CITY_MISSPELLINGS[lowerCity];
    }

    hideElement(suggestionsBox);
    hideElement(errorMessage);
    hideElement(weatherCard);
    hideElement(forecastSection);
    showElement(loadingSpinner);

    try {
        const geoData = await fetchLocationCoordinates(city);
        
        if (geoData.length === 0) {
            throw new Error("Location not found");
        }

        const lat = geoData[0].lat;
        const lon = geoData[0].lon;
        const displayName = geoData[0].name;
        const displayCountry = geoData[0].country;

        const currentWeather = await fetchCurrentWeatherByCoords(lat, lon, displayName, displayCountry);
        const forecast = await fetchForecastByCoords(lat, lon);

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


async function fetchLocationCoordinates(query) {
    const url = `${GEO_URL}?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) return [];
    return response.json();
}

async function fetchCurrentWeatherByCoords(lat, lon, name, country) {
    const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Weather data not available");
    }

    const data = await response.json();
 
    data.name = name;
    if (country) data.sys.country = country;
    
    return data;
}

async function fetchForecastByCoords(lat, lon) {
    const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Forecast not available");
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


async function fetchCitySuggestions(query) {
    const lowerQuery = query.toLowerCase();
    let finalQuery = query;

    if (CITY_MISSPELLINGS[lowerQuery]) {
        finalQuery = CITY_MISSPELLINGS[lowerQuery];
    }

    try {
        const url = `${GEO_URL}?q=${encodeURIComponent(finalQuery)}&limit=5&appid=${API_KEY}`;
        const response = await fetch(url);
        
        if (!response.ok) return [];
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.log("Error fetching suggestions:", error);
        return [];
    }
}

function displaySuggestions(locations) {
    suggestionsBox.innerHTML = "";

    if (locations.length === 0) {
        hideElement(suggestionsBox);
        return;
    }

    for (const loc of locations) {
        const item = document.createElement("div");
        item.className = "suggestion-item";
        
        const name = loc.name;
        const state = loc.state ? `, ${loc.state}` : "";
        const country = loc.country;

        item.innerHTML = `
            <span><strong>${name}</strong>${state}</span>
            <span class="suggestion-country">${country}</span>
        `;

        item.addEventListener("click", function () {
            cityInput.value = `${name}${state}, ${country}`;
            hideElement(suggestionsBox);
            
            getWeatherForLocation(loc);
        });

        suggestionsBox.appendChild(item);
    }

    showElement(suggestionsBox);
}

async function getWeatherForLocation(loc) {
    hideElement(suggestionsBox);
    hideElement(errorMessage);
    hideElement(weatherCard);
    hideElement(forecastSection);
    showElement(loadingSpinner);

    try {
        const currentWeather = await fetchCurrentWeatherByCoords(loc.lat, loc.lon, loc.name, loc.country);
        const forecast = await fetchForecastByCoords(loc.lat, loc.lon);

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


cityInput.addEventListener("input", function () {
    clearTimeout(searchTimeout);
    const query = cityInput.value.trim();

    if (query.length < 2) {
        hideElement(suggestionsBox);
        return;
    }

    searchTimeout = setTimeout(async function () {
        const locations = await fetchCitySuggestions(query);
        displaySuggestions(locations);
    }, 300);
});

cityInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        hideElement(suggestionsBox);
        getWeather();
    }
});

document.addEventListener("click", function (event) {
    if (!event.target.closest(".search-input-wrapper")) {
        hideElement(suggestionsBox);
    }
});