# Parcel Delivery API

A secure, modular, and role-based backend API for a parcel delivery system built with Node.js, Express, Mongoose, and TypeScript.

## 🚀 Features

- 🔐 JWT-based authentication with three roles: `admin`, `sender`, `receiver`
- 📦 Parcel management with status tracking
- 👥 Role-based access control
- 📊 Comprehensive status history for parcels
- 💰 Dynamic fee calculation based on weight and dimensions
- 🛡️ Security best practices (helmet, rate limiting, CORS)
- ✅ Input validation with Zod

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcrypt password hashing
- **Validation**: Zod
- **Security**: Helmet, CORS, rate limiting

## 📋 API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Users

- `GET /api/users/profile` - Get current user profile
- `GET /api/users` - Get all users (Admin only)
- `PATCH /api/users/:id/block` - Block/unblock user (Admin only)

### Parcels

- `POST /api/parcels` - Create a new parcel (Sender only)
- `GET /api/parcels/my-parcels` - Get sender's parcels
- `GET /api/parcels/incoming` - Get receiver's incoming parcels
- `GET /api/parcels/:id` - Get parcel details
- `PATCH /api/parcels/:id/cancel` - Cancel parcel (Sender only)
- `PATCH /api/parcels/:id/deliver` - Confirm delivery (Receiver only)
- `PATCH /api/parcels/:id/status` - Update parcel status (Admin only)
- `GET /api/parcels` - Get all parcels with filtering (Admin only)

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/rakibul-wdp/parcel-delivery-api.git
cd parcel-delivery-api
```

2. Install dependencies:

```
npm install
```

3. Create a .env file and configure environment variables:

```
cp .env.example .env
```

### Edit .env with your configuration

4. Start the development server:

```
npm run dev
```
