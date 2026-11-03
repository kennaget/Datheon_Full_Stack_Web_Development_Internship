# Developer Portfolio

My personal developer portfolio, built with **plain HTML, CSS and JavaScript**, with no frameworks and no build step.

> 🔗 **Live site:** https://portfoliokennaget.vercel.app
> 📸 **Screenshot:** `<add a screenshot here, e.g. ![Portfolio](./screenshot.png)>`

---

## ✨ What It Does

- **Responsive layout** that works on phones, tablets and desktops
- **Hamburger menu** on screens 600px wide or narrower
- **Dark / light theme toggle** (🌙 / ☀️) that remembers your choice with `localStorage`
- **Sections:** hero, About Me, Skills (13 cards), Projects (3 cards), Contact, footer with links
- **Live Demo buttons** on the online store and weather app project cards
- **Downloadable résumé** button
- **Contact form validation** with messages for a missing name, an invalid email, and an empty message

## 🛠️ Tech Stack

| Layer   | Technology                                                       |
| ------- | ---------------------------------------------------------------- |
| Markup  | HTML5                                                            |
| Styling | CSS3: custom properties (for the themes), Flexbox, Grid, media queries |
| Logic   | Vanilla JavaScript (`localStorage`, DOM events)                  |
| Hosting | Vercel                                                           |

## 🚀 Run It Locally

No installation needed. Open `index.html` in your browser, or serve the folder:

```bash
python3 -m http.server 8000
```

Then visit **http://localhost:8000**.

## 📁 Project Structure

```
portfolio/
├── index.html    # All the page content
├── style.css     # All styling, including both colour themes
├── main.js       # Menu, theme toggle and contact form behaviour
├── vercel.json   # Vercel deployment settings and security headers
├── resume.pdf    # The file behind the "Download Resume" button
└── README.md
```

## 🧭 How the Code Is Organised

### `main.js`

| Part         | Functions                                                      | What it does                                             |
| ------------ | -------------------------------------------------------------- | -------------------------------------------------------- |
| Menu         | `toggleMenu`, `closeMenu`                                      | Opens and closes the mobile menu                         |
| Contact form | `getContactFormError`, `handleContactSubmit`                   | Checks the fields and shows the right message            |
| Theme        | `isDarkMode`, `applyTheme`, `toggleTheme`                      | Switches between light and dark and saves the choice     |

### How dark mode works

All colours live in **CSS variables** at the top of `style.css`:

```css
:root {
  --page-background: #fff;
  --text: #333;
}

body.dark-mode {
  --page-background: #121212;
  --text: #e0e0e0;
}
```

Every rule below uses the variables (`background-color: var(--page-background)`), so adding the `dark-mode` class to `<body>` re-colours the whole page. To change a theme colour, change it in one place.

### Naming rules used across all files

- **IDs describe the element:** `navLinks`, `themeToggle`, `contactForm`, `formError`
- **Classes describe what it is:** `section-gray`, `button-outline`, `contact-form`, `error-message`
- **Functions are named for what they do and do one job each:** `getContactFormError`, `applyTheme`
- **Words are written out in full**, so it is `button`, not `btn`
- **Plain `for...of` loops** instead of index counters

## 📖 Reading Guide

**Beginner:** start with `toggleMenu` and `closeMenu` in `main.js`, then open the page, shrink the window and watch the menu work. Next read `getContactFormError`, which is just three `if` checks.

**Intermediate:** follow the theme from click to screen: `themeToggle` click → `toggleTheme` → `applyTheme` → the `dark-mode` class on `<body>` → the variables in `body.dark-mode` change → everything re-colours.

**Advanced:** look at how `style.css` handles the gray sections (`.section-gray` overrides `.section`, and its children get their own width and padding), and at the CSS specificity rules that decide which colour wins when two rules compete.

## 🗺️ Roadmap and Known Limitations

- [ ] **The contact form does not send messages yet.** It checks the fields and shows a confirmation, but there is no backend. Next step: connect a form service such as Formspree or EmailJS.
- [ ] Smooth scrolling between sections (`scroll-behavior: smooth`)
- [ ] Popup windows with full project details
- [ ] Links to each project's source code (the store and weather app already have Live Demo buttons)
- [ ] Error and success messages use the colours written in the CSS (red and green) instead of gray
- [ ] Mobile-first CSS (base styles for phones, then `min-width` queries for larger screens)
- [ ] Keyboard focus styles for the menu and theme toggle

## 🚢 Deploying

Push the repository to GitHub, then import it into [Vercel](https://vercel.com). `vercel.json` tells browsers to keep `.css` and `.js` files for one year without checking for changes. The page links to `style.css?v=2` and `main.js?v=2`, so **every time you change either file, increase the number** (`?v=3`, and so on) in `index.html`. Then visitors' browsers download the new version instead of an old saved copy. Upload `index.html`, `style.css` and `main.js` together.

## 🤖 AI Assistance

I used AI (Claude) as a helper on this project, and I want to be clear about where.

**What I did myself:** `<fill in, e.g. the page content, the first version of the layout and the dark mode>`

**What AI helped with:**

- Replaced about 120 lines of separate dark-mode overrides in `style.css` with a set of colour variables that switch with one class
- Reorganised `main.js` into small single-purpose functions with clear names
- Renamed IDs and classes so they read in plain English, and removed unused CSS
- Replaced HTML character codes like `&#127769;` with the actual characters
- Added the `?v=2` version number to the CSS and JS links, so the renamed files are not mixed with old saved copies
- Rewrote this README so it matches what the site really does

**How I checked it:** the old and new versions were run side by side in a real browser through 64 checks: light and dark mode, hover and focus states (including the Live Demo buttons), every contact-form message, the mobile menu, and 10 screen widths. The text and the computed styles of 49 page elements matched exactly. Screenshots matched pixel for pixel, apart from tiny differences that also appeared when the old version was compared with itself.

**What I did after:** `<fill in, e.g. read every function, traced a click from button to screen, changed X myself>`

## 👤 Author

**Kenna Getachew**: Computer Science student at St. Mary's University, Addis Ababa

- GitHub: https://github.com/kennaget
- LinkedIn: https://www.linkedin.com/in/kenna-getachew-03aa902a9
