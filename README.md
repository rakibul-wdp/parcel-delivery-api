# Parcel Delivery API

A secure, modular, and role-based backend API for a parcel delivery system built with Node.js, Express, Mongoose, and TypeScript.

## 🚀 Features

- 🔐 JWT-based authentication with three roles: `admin`, `sender`, `receiver`
- 📦 Complete parcel management with status tracking
- 👥 Role-based access control with proper authorization
- 📊 Comprehensive status history with timestamps and notes
- 💰 Dynamic fee calculation based on weight and dimensions
- 🔍 Advanced filtering, searching, and pagination
- 🛡️ Security best practices (helmet, rate limiting, CORS)
- ✅ Comprehensive input validation with Zod
- 🎯 Proper error handling with meaningful error messages
- 📝 API documentation with Postman collection

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcrypt password hashing
- **Validation**: Zod
- **Security**: Helmet, CORS, rate limiting
- **Error Handling**: Custom error classes with proper HTTP status codes

## 📋 API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login user

### Users

- `GET /api/v1/auth/profile` - Get current user profile
- `GET /api/v1/auth` - Get all users (Admin only)
- `GET /api/v1/auth/:id` - Get user by ID (Admin only)
- `PATCH /api/v1/auth/:id` - Update user (Admin only)

### Parcels

- `GET /api/v1/parcels/track/:trackingId` - Track parcel by ID (Public)
- `POST /api/v1/parcels` - Create a new parcel (Sender only)
- `GET /api/v1/parcels/my-parcels` - Get sender's parcels (Sender only)
- `PATCH /api/v1/parcels/:id/cancel` - Cancel parcel (Sender only)
- `GET /api/v1/parcels/incoming` - Get receiver's incoming parcels (Receiver only)
- `PATCH /api/v1/parcels/:id/deliver` - Confirm delivery (Receiver only)
- `GET /api/v1/parcels` - Get all parcels with filtering (Admin only)
- `GET /api/v1/parcels/:id` - Get parcel details
- `PATCH /api/v1/parcels/:id/status` - Update parcel status (Admin only)

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
