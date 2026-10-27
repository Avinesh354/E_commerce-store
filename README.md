# MyShop: Full-Stack E-Commerce Store

A full-stack online store with 800+ products across 15 categories. Customers can browse, search, filter, add items to a cart, check out, and track orders through a status timeline. Built with React, Django REST Framework, and MySQL, and deployed on free cloud tiers.

**Live demo:** https://heartfelt-stardust-98df92.netlify.app
**Source:** https://github.com/Avinesh354/E_commerce-store

> **Demo notice:** checkout is a demo and no real payments are taken. Product images, ratings, reviews, and discounts are sample data.

![Home page](screenshots/home.png)

---

## Table of contents

- [Features](#features)
- [Engineering highlights](#engineering-highlights)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Screenshots](#screenshots)
- [Run locally](#run-locally)
- [Testing](#testing)
- [Known limitations](#known-limitations)
- [Roadmap](#roadmap)

---

## Features

**Shopping**
- Home page with a rotating banner, category cards, and scrolling product rows
- Search, category filters, sorting, and pagination
- Product pages with price, discount, stock status, and related products

**Accounts and orders**
- Registration and login with JWT authentication
- Per-user cart with stock checks and quantity limits
- Checkout with a shipping address
- Order history with a status timeline
- Order cancellation that returns stock (for orders still in the pending state)

**Administration**
- Admin panel to manage products and update order status

---

## Engineering highlights

- **Stock-safe checkout:** orders are created inside a database transaction with row-level locking, so two buyers cannot purchase the last unit of an item.
- **JWT with silent refresh:** an Axios interceptor attaches the access token to each request and refreshes it when it expires.
- **Cold-start mitigation:** free-tier servers sleep when idle, so the product catalog is bundled into the frontend as `catalog.json`. Browsing renders immediately, while the API wakes in the background for login and cart actions.
- **Automated tests:** 10 pytest tests cover login, cart limits, overselling, order cancellation, and order privacy.

---

## Tech stack

| Layer    | Technology                                       |
|----------|--------------------------------------------------|
| Frontend | React (Vite), React Router, Axios                |
| Backend  | Python, Django, Django REST Framework, SimpleJWT |
| Database | MySQL                                            |
| Testing  | pytest                                           |
| Hosting  | Netlify (frontend), Render (backend), Aiven (database) |

---

## Architecture

```
React (Netlify)  ->  Django REST API (Render)  ->  MySQL (Aiven)
```

```
.
├── backend/E_commerce   # Django project, DRF API, management commands, tests
├── frontend             # React (Vite) single-page app
└── screenshots
```

---

## Screenshots

| Product page | Cart | Orders |
|---|---|---|
| ![Product page](screenshots/product.png) | ![Cart](screenshots/cart.png) | ![Orders](screenshots/orders.png) |

---

## Run locally

**Prerequisites:** Python 3.x, Node.js, and a running MySQL instance.

### Backend

```bash
cd backend/E_commerce
python -m venv .venv

# Windows
.venv\Scripts\activate
# macOS / Linux
source .venv/bin/activate

python -m pip install -r requirements.txt
```

Create a `.env` file next to `manage.py`:

```env
SECRET_KEY=your-secret-key
DEBUG=True
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
```

Then set up the database and start the server:

```bash
python manage.py migrate
python manage.py seed_products --reset
python manage.py import_dummyjson
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Testing

```bash
cd backend/E_commerce
python -m pytest
```

---

## Known limitations

- **Demo checkout:** no payment gateway is integrated. Orders move from pending to paid automatically.
- **Sample data:** product photos come from DummyJSON and Pixabay. Ratings, reviews, and discounts are generated sample data.
- **Cold starts:** the backend runs on a free tier, so the first login or cart action after idle time can take up to a minute.
- **Bundled catalog:** the catalog snapshot in `catalog.json` can lag behind the database for fields like stock and price.

---

## Roadmap

- [ ] Payment integration in test mode (Razorpay) with signature-verified, idempotent webhooks
- [ ] Realistic order lifecycle: pending, paid, shipped, delivered, cancelled
- [ ] Structured shipping addresses with PIN code validation
- [ ] Concurrent-purchase test that proves the row lock under load
- [ ] CI pipeline (GitHub Actions) running the test suite on every push
- [ ] Verified-purchase reviews to replace sample ratings
