# MyShop - Full-Stack E-Commerce Store

A full-stack e-commerce web application. Customers can register, browse and search products, manage a cart, and place orders with a live status timeline. Built with React, Django REST Framework, and MySQL.

**Live demo:** https://heartfelt-stardust-98df92.netlify.app

> The backend runs on a free hosting tier, so the first request after a period of inactivity can take up to a minute while the server wakes up.

## Features

- User registration and login using JWT authentication
- Product listing with search, category filter, and pagination
- Shopping cart with stock validation
- Stock-safe checkout: orders are created inside a database transaction with row locking, so the last item cannot be sold twice
- Order history with a status timeline (Pending, Paid, Shipped, Delivered, Cancelled)
- Order cancellation that restores product stock
- Admin panel for managing products, categories, and order status
- Automated tests with pytest covering authentication, cart, checkout, and stock handling
- Payment is a demo flow (no real money is charged)

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), React Router, Axios |
| Backend | Python, Django, Django REST Framework, SimpleJWT |
| Database | MySQL |
| Testing | pytest, pytest-django |
| Hosting | Netlify (frontend), Render (backend), Aiven (database) |

## Architecture

```
React (Netlify)  --->  Django REST API (Render)  --->  MySQL (Aiven)
```

## Project Structure

```
frontend/             React application
backend/E_commerce/   Django REST API
  users/              custom user model, register and login
  products/           products and categories
  cart/               cart and cart items
  orders/             orders, status history, checkout
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register/ | Create an account |
| POST | /api/auth/login/ | Get access and refresh tokens |
| POST | /api/auth/refresh/ | Get a new access token |
| GET | /api/products/ | List products (search, filter, pagination) |
| GET | /api/categories/ | List categories |
| GET | /api/cart/ | View cart |
| POST | /api/cart/add/ | Add a product to the cart |
| PATCH / DELETE | /api/cart/items/{id}/ | Update quantity or remove an item |
| GET / POST | /api/orders/ | List orders or place an order from the cart |
| GET | /api/orders/{id}/ | Order details with status timeline |
| POST | /api/orders/{id}/pay/ | Demo payment |
| POST | /api/orders/{id}/cancel/ | Cancel a pending order and restore stock |

## Run Locally

### Backend

```bash
cd backend/E_commerce
python -m venv .venv
.venv\Scripts\activate
python -m pip install -r requirements.txt
```

Create a `.env` file next to `manage.py`:

```
SECRET_KEY=your-secret-key
DEBUG=True
DB_NAME=ecommerce_db
DB_USER=root
DB_PASSWORD=your-mysql-password
```

Create the database in MySQL (`CREATE DATABASE ecommerce_db;`), then:

```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

### Tests

```bash
cd backend/E_commerce
python -m pytest
```

## What I Learned

- Building a REST API with Django REST Framework and JWT authentication
- Preventing overselling with database transactions and row locking
- Connecting a React frontend to a deployed API (CORS, environment variables)
- Deploying a full-stack application on free cloud services
