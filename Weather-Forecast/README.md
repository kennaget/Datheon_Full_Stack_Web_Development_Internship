# 🌍 Weather Forecast App

Search any city in the world and see the current weather and a 5-day forecast. The page background changes with the weather. Built with **plain HTML, CSS and JavaScript**, with no frameworks and no build step.

> 🔗 **Live demo:** `https://weatherforecast-phi-ebon.vercel.app`

---

## ✨ Features

- **Search any city** by clicking the button or pressing `Enter`
- **Current weather**: temperature, feels like, humidity, wind speed (km/h), pressure and a weather icon
- **5-day forecast** with the high and low for each day
- **Background changes with the weather**: sunny, rainy or cloudy, snowy, and night
- **Day and night aware**: a clear sky shows ☀️ by day and 🌙 at night
- **Loading spinner** while data is fetched
- **Friendly error message** when something goes wrong
- **Responsive** layout for desktop and mobile

## 🛠️ Tech Stack

| Layer   | Technology                                                                                |
| ------- | ----------------------------------------------------------------------------------------- |
| Markup  | HTML5                                                                                     |
| Styling | CSS3 (custom properties, Flexbox, glass-style cards, animations)                          |
| Logic   | Vanilla JavaScript (`async/await`, Fetch API)                                             |
| Data    | [OpenWeatherMap API](https://openweathermap.org/api) (current weather and 5-day forecast) |

## 🚀 Getting Started

1. **Get a free API key** at [openweathermap.org](https://openweathermap.org/api). New keys can take a little while to activate.
2. **Put your key in `app.js`:**

   ```js
   const API_KEY = "16ed7edbf9b5e7f9187208e9c65b761c";
   ```

3. **Open `index.html`** in your browser, or serve the folder locally:

   ```bash
   python3 -m http.server 8000
   ```

   Then visit **http://localhost:8000**.

> ⚠️ **About the API key:** this app runs entirely in the browser, so anyone who opens the page can see the key. That is normal for a free-tier learning project, but don't use a paid key, and create a new one if yours has been published somewhere you didn't intend.

## 📁 Project Structure

```
weather-app/
├── index.html   # Page structure: search box, weather card, forecast
├── style.css    # All styling, weather backgrounds and responsive rules
└── app.js       # All behaviour: fetching data and updating the page
```

## 🧭 How the Code Is Organised

### `app.js`, from top to bottom

| Part                  | Functions                                                                    | What it does                                           |
| --------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------ |
| Settings              | `API_KEY`, `BASE_URL`, `FORECAST_DAYS`, …                                    | Values that never change                               |
| Page elements         | `cityInput`, `weatherCard`, `forecastCards`, …                               | Finds each HTML element once, so the code can reuse it |
| The main action       | `getWeather`                                                                 | Runs when you search: validate → fetch → show          |
| Talking to the API    | `fetchCurrentWeather`, `fetchForecast`, `fetchJson`                          | Downloads data and throws an error if it fails         |
| Current weather       | `showCurrentWeather`, `isNightTime`, `convertToKmh`                          | Fills in the weather card                              |
| Forecast              | `showForecast`, `pickDailyForecasts`, `getForecastDay`, `createForecastCard` | Chooses one reading per day and builds the cards       |
| Icons and backgrounds | `getWeatherEmoji`, `changeBackground`                                        | Picks the emoji and the page colour                    |
| Small helpers         | `showElement`, `hideElement`                                                 | Show or hide something by toggling the `hidden` class  |

### What happens when you search

1. `getWeather()` reads the city and stops with an alert if it is empty.
2. It hides the old results and shows the spinner.
3. It downloads the current weather, then the forecast.
4. On success it fills in the card, builds the forecast cards, changes the background and clears the input.
5. On any failure it logs the problem and shows the error message.

### How the 5 forecast days are chosen

The API returns a reading every 3 hours. `pickDailyForecasts` takes the **12:00 reading of each day**. If that gives fewer than 5 days, it fills the gaps with the first reading of each remaining day.

### Naming rules used across all three files

- **Functions are named for what they do:** `showCurrentWeather`, `pickDailyForecasts`, `convertToKmh`. Each does one job.
- **Names are written out in full:** `weather-description`, not `weather-desc`, and `search-button`, not `search-btn`.
- **Class names describe the element:** everything inside the forecast starts with `forecast-` (`forecast-card`, `forecast-day`, `forecast-high`, `forecast-low`).
- **Loops are plain `for` loops**, so beginners can follow them line by line.
- **Repeated numbers and values have names:** `FORECAST_DAYS`, `NOON`, `KMH_PER_METER_PER_SECOND`.
- **Repeated CSS values are variables** at the top of `style.css` (`--glass-background`, `--soft-shadow`, …).

## 📖 Reading Guide

**Beginner:** start with `convertToKmh` and `getWeatherEmoji` (small, one job each), then `showElement` and `hideElement`, then `getWeather`. Search for a city and match each thing you see to a line of code.

**Intermediate:** follow one search from end to end. Click → `getWeather` → `fetchCurrentWeather` → `fetchJson` → `showCurrentWeather` → `changeBackground`.

**Advanced:** look at `fetchJson` (turning a failed HTTP status into an exception), the two-pass logic in `pickDailyForecasts`, and think about what happens when the forecast request fails after the weather request succeeded.

## 🗺️ Roadmap and Known Limitations

- [ ] Show a different message for "network down" versus "city not found" (right now every failure says _City not found_)
- [ ] Encode the city with `encodeURIComponent` so names with special characters work
- [ ] Fetch weather and forecast at the same time with `Promise.all` to make it faster
- [ ] Search by the user's location
- [ ] °C / °F toggle
- [ ] Move the API key behind a small server so it isn't visible in the browser
- [ ] Parse forecast dates in a format that every browser accepts (some Safari versions don't read `"2026-10-31 12:00:00"`)

## 🤖 AI Assistance

I used AI (Claude) as a helper on this project, and I want to be clear about where.

**What AI helped with:**

- Reorganised `app.js` into small single-purpose functions with clear names
- Merged two near-identical fetch functions into one shared `fetchJson`
- Replaced chained `.map()` used as a loop with a plain `for` loop, and `document.getElementById` calls scattered through the code with elements looked up once at the top
- Renamed CSS classes and HTML ids so they read in plain English, and replaced repeated CSS values with variables
- Replaced the deprecated `keypress` event with `keydown` for the Enter key
- Wrote the first draft of this README

**How I checked it:** the old and new versions were run side by side in a real browser with a fake weather API. Searches for every weather type, day and night, errors, a failed forecast, a slow connection, a short forecast list and four screen widths gave the same results, the same API requests and pixel-identical screenshots.

## 👤 Author

**Kenna Getachew**: Computer Science student and full-stack web developer

- GitHub: `https://github.com/kennaget`
- LinkedIn: `https://www.linkedin.com/in/kenna-getachew-03aa902a9`

---

_Weather data is provided by [OpenWeatherMap](https://openweathermap.org/)._
