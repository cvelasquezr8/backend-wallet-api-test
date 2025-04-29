# 💸 Wallet API

A backend service built with **Node.js**, **Express**, **TypeScript**, **Prisma**, and **PostgreSQL**. This API allows users to register, log in, manage wallets, and supports JWT-based authentication.

---

## 📦 Requirements

-   Docker & Docker Compose
-   Node.js 18+
-   NPM

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/cvelasquezr8/backend-development-test.git
cd backend-development-test
```

---

### 2. Set up environment variables

Create a `.env` file based on the provided template:

```bash
cp .env.template .env
```

Update the `.env` file with your desired values, such as:

```
PORT=3000
JWT_SECRET=your_super_secret_key
POSTGRES_USER=wallet
POSTGRES_PASSWORD=wallet123
POSTGRES_DB=wallet
POSTGRES_URL=postgresql://wallet:wallet123@postgres-db:5432/wallet
```

---

### 3. Run the backend with Docker

```bash
docker-compose up --build
```

This command will:

-   Spin up a PostgreSQL container
-   Install dependencies
-   Run Prisma migrations and generate the client
-   Start the backend server on `http://localhost:3000`

---

### 4. Access Swagger API Docs

Once the server is running, the API documentation will be available at:

```
http://localhost:3000/api-docs
```

Here you can try endpoints like:

-   `POST /api/auth/register`
-   `POST /api/auth/login`
-   `POST /api/auth/logout`
-   `POST /api/wallet`
-   `GET /api/wallet`
-   `GET /api/wallet/:id`
-   `PUT /api/wallet/:id`
-   `DELETE /api/wallet/:id`

---

## 📁 Project Structure

```
src/
├── common/           # Common functions
├── config/           # App configuration & adapters
├── data/             # Prisma client & data sources
├── domain/           # Entities, DTOs, interfaces
├── infrastructure/   # Repositories, mappers
├── presentation/     # Controllers, routes, middleware
├── types/            # Custom typings (e.g. Express Request)
```

---
