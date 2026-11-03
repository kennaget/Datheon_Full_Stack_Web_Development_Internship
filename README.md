# Datheon Full Stack Web Development Internship

Project submission by **Kenna Getachew** for the Datheon Full Stack Web Development Internship program.

This repository contains three web projects. Each one is deployed live and can be tried without installing anything.

| Project              | What it is                                     | Live demo                                       |
| -------------------- | ---------------------------------------------- | ----------------------------------------------- |
| Developer Portfolio  | Personal portfolio website                     | https://portfoliokennagetachew.vercel.app       |
| ShopVibe             | E-commerce product catalog with a working cart | https://ecommercecatalog-puce.vercel.app        |
| Weather Forecast App | City weather search with a 5-day forecast      | https://weather-forecast-eight-umber.vercel.app |

---

## 1. Developer Portfolio

A responsive personal website that introduces me, lists my skills, and links to my other projects.

**Features**

- Sections for About, Skills, Projects and Contact, with a mobile-friendly navigation menu
- Light and dark theme toggle
- Project cards linking to the live demos of ShopVibe and the Weather Forecast App
- Downloadable resume
- Contact form with input validation

**Built with:** HTML5, CSS3, JavaScript. Deployed on Vercel.

---

## 2. ShopVibe (E-Commerce Product Catalog)

An online store front where products are loaded from a public API and shoppers can fill a cart and check out.

**Features**

- Products fetched live from the [Fake Store API](https://fakestoreapi.com)
- Category filters: All, Electronics, Jewelry, Men's Clothing, Women's Clothing
- Product search and sorting (price low to high, price high to low, top rated)
- Slide-out cart drawer with item quantities
- Automatic subtotal, 8% tax and shipping calculation (free shipping on orders over $20)
- Checkout flow that ends with an order confirmation message

**Built with:** HTML5, CSS3 (Grid and Flexbox), vanilla JavaScript, Fetch API. Deployed on Vercel.

---

## 3. Weather Forecast App

A weather lookup tool where users can search any city in the world.

**Features**

- Search by city name
- Current conditions: temperature, weather description, humidity, wind speed, pressure and "feels like" temperature
- 5-day forecast
- Friendly error message when a city is not found
- Loading state while data is being fetched

**Built with:** HTML5, CSS3, vanilla JavaScript, Fetch API with async/await, [OpenWeatherMap API](https://openweathermap.org/api). Deployed on Vercel.

---

## Repository Structure

```
Datheon_Full_Stack_Web_Development_Internship/
├── portfolio/
├── shopvibe-store/
├── weather-app/
└── README.md
```

Each folder holds the complete source code of its project, with an `index.html` entry point.

## Running a Project Locally

1. Clone the repository:
   ```
   git clone https://github.com/kennaget/Datheon_Full_Stack_Web_Development_Internship.git
   ```
2. Open the folder of the project you want to run.
3. Open `index.html` in your browser, or serve the folder with a simple local server such as the VS Code Live Server extension.
4. For the Weather Forecast App, add your own OpenWeatherMap API key where the app asks for it.

## Skills Demonstrated

- Responsive layout with modern CSS
- Consuming REST APIs with `fetch` and `async/await`
- Handling JSON data and rendering it dynamically in the DOM
- Client-side state management for the shopping cart
- Form validation and user-friendly error handling
- Deployment with Vercel and version control with Git and GitHub

## AI Assistance

In the spirit of transparency, here is how AI tools were used in this work:

- **ShopVibe:** AI was used to assist with part of the code, including structuring the cart logic.
- **Done by me:** Designed the complete UI/UX layout using responsive CSS Grid and Flexbox, built the dynamic client-side filtering, search, and multi-criteria sorting algorithms from scratch, integrated the Fetch API architecture with async/await, and independently handled state synchronization, edge-case debugging, and the final Vercel deployment pipeline.

## About the Author

**Kenna Getachew** is a Computer Science student at St. Mary's University in Addis Ababa, Ethiopia, with skills in HTML, CSS, JavaScript, React, Node.js, Express.js, SQL, Java , Data Struction and Algorithm , Object-Oriented Programming and C++. She is looking for a remote entry-level role or internship.

- Email: kennaget04@gmail.com
- GitHub: https://github.com/kennaget
- LinkedIn: https://www.linkedin.com/in/kenna-getachew-03aa902a9
- Portfolio: https://portfoliokennagetachew.vercel.app
