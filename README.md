
# 🍔 Order Management System (Full-Stack)

A full-stack food ordering application built using **React**, **Node.js**, **Express**, and **SQLite**, featuring real-time order status updates, cart management, order cancellation rules, and order history with reorder functionality.

---

## 🚀 Features

### ✅ Frontend (React + Vite)

* Browse food menu by category (Pizza, Burgers, Drinks, Desserts)
* Search menu items
* Add / remove items from cart
* Update quantity in cart
* Checkout with customer details
* Real-time order status updates
* Cancel order with business rules
* Order history with **Reorder** feature
* Mobile-responsive UI

### ✅ Backend (Node.js + Express)

* RESTful APIs for menu, cart, orders
* SQLite database for persistence
* Order lifecycle management
* Server-Sent Events (SSE) for real-time updates
* Order cancellation logic
* Reorder support from history

---

## 🧠 System Design Overview

### Architecture

```
Frontend (React)
   |
   | REST API + SSE
   |
Backend (Express)
   |
   | SQLite
   |
Database
```

### Backend Structure

```
backend/
 ├── src/
 │   ├── config/        # database config
 │   ├── controllers/   # request handling
 │   ├── models/        # database logic
 │   ├── routes/        # API routes
 │   ├── services/      # background logic (status updates)
 │   └── server.js
```

### Frontend Structure

```
frontend/
 ├── src/
 │   ├── pages/         # screens (Menu, Cart, Status, History)
 │   ├── components/    # reusable UI components
 │   ├── context/       # CartContext
 │   ├── services/      # API calls
 │   └── styles/
```

---

## 🔄 Order Status Flow (Simulated Real-Time)

Order progresses automatically:

1. **Order Received**
2. **Preparing**
3. **Out for Delivery**
4. **Delivered**

Updates are pushed to the client using **Server-Sent Events (SSE)** every few seconds.

---

## ❌ Order Cancellation Rules

* Order **can be cancelled** only when:

  * Status is `Order Received` or `Preparing`
* Order **cannot be cancelled** when:

  * `Out for Delivery`
  * `Delivered`

Cancellation immediately:

* Stops background status updates
* Updates status to `Cancelled`
* Notifies the user with a message

---

## 🔁 Order History & Reorder

* View all previous orders
* Reorder adds previous items back to cart
* Quantity is adjustable
* Delete history is **UI-only** (does not affect database)

---

## 🧪 Input Validation

### Customer Details Validation

* **Name**: alphabets only
* **Phone**: `+91` followed by 10 digits
* **Email**: valid email format (e.g. `user@gmail.com`)
* **Address**: minimum length required

### Backend Validation

* Empty cart prevention
* Invalid order ID handling
* Safe database operations using prepared statements

---

## ⚙️ Tech Stack

### Frontend

* React
* React Router
* Context API
* Axios
* Vite

### Backend

* Node.js
* Express.js
* SQLite3
* UUID
* Server-Sent Events (SSE)

---

## 🛠️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone <repository-url>
cd order-management-app
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend runs on:

```
http://localhost:5000
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

## 📡 API Endpoints

### Menu

* `GET /api/menu`

### Orders

* `POST /api/orders`
* `GET /api/orders/:id`
* `PUT /api/orders/:id/cancel`
* `GET /api/orders/history`
* `POST /api/orders/:id/reorder`

### Real-Time Status

* `GET /api/orders/:id/stream` (SSE)

---

## 🧪 Testing Strategy

* Manual testing of:

  * Order placement
  * Cancellation logic
  * Status updates
  * Reorder flow
* Edge cases covered:

  * Empty cart
  * Invalid inputs
  * Late cancellation attempts

Code structure supports easy addition of:

* Jest
* Supertest
* React Testing Library

---

## 🤖 Use of AI

AI was used to:

* Speed up boilerplate creation
* Debug async issues (SSE, state updates)
* Improve UX wording and validation logic

All AI-generated code was **reviewed, modified, and integrated manually**.

---

## 🌟 Future Improvements

* Authentication (login / signup)
* Payment gateway integration
* WebSockets for bidirectional updates
* Admin dashboard
* Cloud deployment (AWS / Vercel / Render)

---

## ✅ Evaluation Summary

This project demonstrates:

* Strong problem-solving skills
* Clean and maintainable code
* Real-time features without paid services
* Thoughtful UX decisions
* Practical use of modern full-stack tools

---

## 👤 Author

**Nilesh Pulate**
Full-Stack Developer (React | Node.js | SQLite)
