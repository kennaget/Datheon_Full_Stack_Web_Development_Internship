# ⚡ ShopVibe

A responsive e-commerce storefront built with **plain HTML, CSS and JavaScript**. It loads products from a public API and lets you search, filter, sort, and manage a shopping cart through to a checkout confirmation, with no frameworks and no build step.

> 🔗 **Live demo:** `https://ecommerceapp-five-roan.vercel.app`

---

## ✨ Features

- **Live product data** fetched from the [Fake Store API](https://fakestoreapi.com/)
- **Search** by product title or description (press `Enter` or click 🔍)
- **Category filters**: Electronics, Jewelry, Men's and Women's Clothing
- **Sorting**: price low → high, high → low, and top rated
- **Shopping cart drawer** with add, remove and quantity controls
- **Live totals**: subtotal, 8% tax, and shipping (free over $20, otherwise $4.99)
- **Product badges** (⭐ Top Rated, 🔥 Hot Deal) and star ratings
- **Checkout flow** with an order summary popup
- **Loading spinner and error handling**: if the API fails, a message with a **Try again** button appears inside the product grid, and the rest of the page keeps working
- **Responsive layout** for desktop, tablet and mobile

## 🛠️ Tech Stack

| Layer   | Technology                                                            |
| ------- | --------------------------------------------------------------------- |
| Markup  | HTML5                                                                 |
| Styling | CSS3 (custom properties, Grid, Flexbox, animations)                   |
| Logic   | Vanilla JavaScript (`async/await`, Fetch API)                         |
| Data    | [Fake Store API](https://fakestoreapi.com/products)                   |
| Fonts   | [Poppins](https://fonts.google.com/specimen/Poppins) via Google Fonts |

## 🚀 Getting Started

No installation or build tools are needed.

```bash
git clone https://github.com/kennaget/shopvibe.git
cd shopvibe
```

Open `index.html` in your browser, or serve the folder locally:

```bash
python3 -m http.server 8000
```

Then visit **http://localhost:8000**. An internet connection is required because products come from the Fake Store API.

## 📁 Project Structure

```
shopvibe/
├── index.html   # Page structure: navbar, hero, product grid, cart drawer, checkout popup
├── style.css    # All styling, colour variables and responsive rules
└── app.js       # All behaviour: loading data, filtering, cart, checkout
```

## 🧭 How the Code Is Organised

### `app.js`, from top to bottom

| Part               | Functions                                                                          | What it does                                                       |
| ------------------ | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Settings and data  | `API_URL`, `TAX_RATE`, `allProducts`, `currentCategory`, `cart`                    | The values the app remembers                                       |
| Page elements      | `searchInput`, `productGrid`, `cartDrawer`, …                                      | Finds each HTML element once, so the rest of the code can reuse it |
| Loading products   | `loadProducts`, `showLoadError`                                                    | Fetches the data and handles failure                               |
| Showing products   | `showProducts`, `getVisibleProducts`, `sortProductList`, `createProductCardHtml`   | Filters, sorts and draws the product cards                         |
| Cart data          | `addToCart`, `updateQuantity`, `removeFromCart`, `clearCart`, `calculateTotals`    | Changes the cart and does the maths                                |
| Cart display       | `updateCart`, `showCartItems`, `showCartTotals`, `updateAddButtons`                | Redraws the cart drawer                                            |
| Buttons and clicks | `handleSearch`, `filterCategory`, `toggleCart`, `openCheckout`, `closeCheckout`, … | Functions the HTML buttons call                                    |
| Small helpers      | `formatPrice`, `escapeHtml`, `lockPageScroll`                                      | Tiny tools used in many places                                     |

### Naming rules used across all three files

- **Functions are named for what they do:** `showProducts`, `calculateTotals`, `addToCart`. Each does one job.
- **Class names say what the element is:** `product-card`, `cart-item`, `quantity-button`, `checkout-button`. Similar things share a prefix, for example `product-title`, `product-price` and `product-footer` all live inside `product-card`.
- **Words are written out in full:** `quantity`, not `qty`, and `button`, not `btn`.
- **No inline styles.** Every look comes from `style.css`, so changing the design never means searching through JavaScript.
- **`style.css` starts with colour variables** (`--primary`, `--accent`, `--text`, …), so one change updates the whole site.
- **Loops are written as plain `for` loops** instead of chained `map`/`reduce`/`filter`, so beginners can follow them line by line.

### Design decisions

- **Changing the cart never redraws the product grid.** `updateCart()` only updates the drawer, the badge and the `+` / `✓` buttons, so the page doesn't jump while you change quantities.
- **One place for the maths.** `calculateTotals()` is used by both the cart drawer and the checkout popup, so the numbers always match.
- **One pipeline for the product list.** Category, search and sort all go through `getVisibleProducts()`, so they always work together.
- **Errors stay local.** A failed API call only replaces the product grid. The navbar, cart and footer stay usable.
- **Product text is escaped** with `escapeHtml()` before it is put into the page.

## 📖 Reading Guide

**Beginner:** start with `formatPrice` and `getStarsText`, then `getVisibleProducts` (a loop with an `if`), then `addToCart`. Open the page, click around, and match each click to its function.

**Intermediate:** follow one click from end to end. `onclick="addToCart(3)"` in the card HTML → `addToCart` → `updateCart` → `showCartItems` / `showCartTotals`.

**Advanced:** look at `loadProducts` (`async/await` with `try/catch` and a response status check), `escapeHtml` (why `textContent` is safer than string concatenation), and why `cart` is an object keyed by product id instead of an array.

## 🗺️ Roadmap

- [ ] Save the cart in `localStorage`
- [ ] Product detail popup
- [ ] Debounced live search while typing
- [ ] Keyboard accessibility and ARIA labels for the drawer and popup
- [ ] Skeleton loaders instead of a spinner
- [ ] Wishlist
- [ ] Rebuild in React with components

## 🤖 AI Assistance

I used AI (Claude) as a helper on this project. I want to be clear about where, so anyone reading the code knows what I can explain and what I used help with.

**What I did myself:** `<fill in, e.g. the original layout, styling, fetching the API, the first working cart>`

**What AI helped with:**

- Found and fixed a bug where every cart change re-drew the whole product grid and moved the page
- Rewrote the shipping, tax and total calculations into one function, `calculateTotals()`
- Added the API error state with a **Try again** button
- Reorganised `app.js` into small single-purpose functions with clear names
- Renamed CSS classes and HTML ids so they read in plain English, and moved all inline styles into `style.css`
- Behaviour change: the category buttons now search descriptions too, the same way the search button does
- Wrote the first draft of this README

**How I checked it:** the page was run in a real browser with the old and new versions side by side. Every click path (search, filters, sorting, cart, checkout, API failure and retry) produced the same results and the same screenshots.

## 🤝 Contributing

1. Fork the repository
2. Create a branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "Add my feature"`
4. Push the branch: `git push origin feature/my-feature`
5. Open a Pull Request

## 👤 Author

**Kenna Getachew**: Computer Science student and full-stack web developer

- GitHub: `https://github.com/kennaget`
- LinkedIn: `https://www.linkedin.com/in/kenna-getachew-03aa902a9`

---

_Product data and images come from the Fake Store API and are used for demonstration only._
