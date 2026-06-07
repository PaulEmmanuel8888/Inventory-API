# 📦 Inventory API

A simple RESTful backend API for managing products using Node.js, Express, and PostgreSQL for data persistence.

---

## 🚀 Features

- Create products
- Get all products
- Get product by ID
- Update products (partial updates supported)
- Delete products
- Filter products by category
- Input validation

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- PostgreSQL

---

## 📌 API Endpoints

### Base Url

http://localhost:3000

### Get all products

```http
GET /products
```

### Get all products and filter by category

```http
GET /products?category=electronics
```

### Get product by ID

```http
GET /products/:id
```

### Create Product

```http
POST /products

Requirements:
    {
    "name": "TV",
    "price": 1200,
    "quantity": 10,
    "category": "electronics"
    }

```

### Update Product

```http
PUT /products/:id

Example request:
    {
    "price": 150,
    "quantity": 8
    }
```

### Delete Product

```http
DELETE /products/:id
```

## 📄 License

This project is licensed under the MIT License.
