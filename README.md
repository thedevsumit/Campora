<div align="center">

# Campora

### A platform to discover, manage, and grow college clubs and events.

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![License](https://img.shields.io/badge/license-ISC-blue.svg)]()
[![Node](https://img.shields.io/badge/node-%E2%89%A518-339933?logo=node.js\&logoColor=white)]()
[![React](https://img.shields.io/badge/react-19-61DAFB?logo=react\&logoColor=black)]()
[![MongoDB](https://img.shields.io/badge/mongodb-Mongoose-47A248?logo=mongodb\&logoColor=white)]()
[![Express](https://img.shields.io/badge/express-000000?logo=express\&logoColor=white)]()
[![TailwindCSS](https://img.shields.io/badge/tailwindcss-4-38B2AC?logo=tailwind-css\&logoColor=white)]()
[![Socket.io](https://img.shields.io/badge/socket.io-010101?logo=socket.io\&logoColor=white)]()
[![Deployment](https://img.shields.io/badge/deploy-Render-46E3B7?logo=render\&logoColor=white)]()


</div>

---


## Overview

**Campora** is a full-stack web platform designed for college students, club administrators, and campus communities. It centralizes core club operations, including club creation, member approvals, event management, resource booking, analytics, notifications, and real-time communication.

The platform provides dedicated workflows for club leads organizing events, students discovering campus activities, and administrators managing clubs and user activity.

---

## Features

### Club Management

* Create, edit, and manage clubs with detailed descriptions and cover images
* Administrative approval workflow for new clubs
* Join request system with role-based access control
* Club collaborations and member role management
* Resource management for individual clubs

### Event Management

* Create, update, and delete events
* RSVP and participation tracking
* Manage event locations, schedules, capacity, and details
* Event analytics and attendance insights

### Real-Time Chat

Powered by Socket.io:

* Private one-to-one messaging
* Club group chat rooms
* Chat request workflow with send, accept, reject, and block actions
* Online and offline presence indicators
* Persistent message history

### Resource Booking

* Book shared campus resources such as rooms and equipment
* Booking conflict detection
* Calendar-based resource management
* Daily and weekly schedule views

### Analytics Dashboard

* Club growth metrics
* Member engagement insights
* Event performance metrics
* Visual charts using Chart.js
* Administrative overview across clubs

### Moderation and Administration

* Block and unblock users
* Manage pending clubs
* Review flagged content and reports
* Separate super administrator and club administrator roles

### Notifications

* Real-time in-app notifications using Socket.io
* Notification history
* Toast notifications for important actions

### User Interface

* Light and dark themes
* Responsive layouts for mobile, tablet, and desktop devices
* Skeleton loaders
* Smooth UI transitions
* Tailwind CSS v4 styling

### Authentication

* Email and password authentication
* OTP-based email verification
* Forgot-password workflow
* Google OAuth 2.0 authentication
* Secure HTTP-only cookie-based JWT sessions

---


## Tech Stack

### Frontend

| Technology                     | Purpose                           |
| ------------------------------ | --------------------------------- |
| **React 19**                   | User interface library            |
| **Vite**                       | Build tool and development server |
| **React Router v7**            | Client-side routing               |
| **Zustand**                    | State management                  |
| **Tailwind CSS v4**            | Utility-first styling             |
| **Axios**                      | HTTP client                       |
| **Socket.io Client**           | Real-time communication           |
| **Chart.js + react-chartjs-2** | Data visualization                |
| **Lucide React**               | Icon library                      |
| **React Toastify**             | Toast notifications               |

### Backend

| Technology                             | Purpose                          |
| -------------------------------------- | -------------------------------- |
| **Node.js + Express 5**                | REST API server                  |
| **MongoDB + Mongoose**                 | Database and ODM                 |
| **Socket.io**                          | Real-time events                 |
| **JWT + cookie-parser**                | Authentication and sessions      |
| **Passport.js**                        | Google OAuth 2.0                 |
| **bcrypt / bcryptjs**                  | Password hashing                 |
| **Multer + multer-storage-cloudinary** | File uploads                     |
| **Nodemailer**                         | OTP and transactional email      |
| **express-rate-limit**                 | Brute-force and abuse protection |
| **dotenv**                             | Environment configuration        |
| **Nodemon**                            | Development hot reload           |

### Deployment

* **Render** — frontend and backend deployment
* **MongoDB Atlas** — managed database
* **Cloudinary** — media storage

---

## Architecture

```text
┌─────────────────────┐       REST API / Socket.io       ┌─────────────────────┐
│                     │ <───────────────────────────────> │                     │
│   React Frontend    │                                   │   Express Backend   │
│   Vite + Tailwind   │                                   │   Node.js           │
│                     │                                   │                     │
└─────────────────────┘                                   └──────────┬──────────┘
                                                                      │
                                           ┌──────────────────────────┼──────────────────────────┐
                                           │                          │                          │
                                           ▼                          ▼                          ▼
                                  ┌────────────────┐        ┌────────────────┐        ┌────────────────┐
                                  │ MongoDB Atlas  │        │   Cloudinary   │        │   Nodemailer   │
                                  │   Database     │        │ Media Storage  │        │  SMTP Emails   │
                                  └────────────────┘        └────────────────┘        └────────────────┘
```

### Application Structure

* **Monorepo layout**: `frontend/` contains the Vite SPA and `backend/` contains the Express API.
* **Deployment**: Frontend and backend services are deployed independently.
* **Real-time layer**: Socket.io manages online presence, club chat, private messaging, and notifications.
* **Authentication**: JWT sessions are stored in HTTP-only cookies. Google OAuth is handled through Passport.js.
* **File uploads**: Multer processes uploads, Cloudinary stores media, and generated URLs are persisted in MongoDB.

---

## Project Structure

```text
campora/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Route logic
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # Express route definitions
│   │   ├── middleware/      # Authentication, rate limiting, error handling
│   │   ├── lib/             # Database, mailer, Passport, scheduler
│   │   └── index.js         # Server bootstrap
│   ├── uploads/             # Local upload fallback
│   ├── .env                 # Environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page-level components
│   │   ├── store/           # Zustand stores
│   │   ├── lib/             # Axios instance and helpers
│   │   ├── assets/          # Images and icons
│   │   ├── App.jsx          # Root component and routes
│   │   ├── App.css          # Global styles
│   │   └── main.jsx         # React entry point
│   ├── public/              # Static assets
│   ├── .env                 # Vite environment variables
│   └── package.json
│
├── render.yaml              # Render deployment configuration
├── .gitignore
└── README.md
```

---

## Getting Started

Follow the steps below to run Campora locally.

### Prerequisites

Ensure the following tools and services are available:

* Node.js v18 or later; v20 recommended
* npm
* MongoDB Atlas account or local MongoDB instance
* Cloudinary account for media uploads
* Gmail or another SMTP-compatible email account

### 1. Clone the Repository

```bash
git clone https://github.com/thedevsumit/campora.git
cd campora
```

### 2. Install Dependencies

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd ../frontend
npm install
```

### 3. Configure Environment Variables

Create `.env` files in both the `backend/` and `frontend/` directories.

Refer to the [Environment Variables](#environment-variables) section below.

### 4. Start the Development Servers

Run the backend in the first terminal:

```bash
cd backend
npm start
```

Run the frontend in a second terminal:

```bash
cd frontend
npm run dev
```

The default local development services are:

* Backend: `http://localhost:5000`
* Frontend: `http://localhost:5173`

---

## Environment Variables

### `backend/.env`

```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGO_DB=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_super_secret_jwt_key

# Email
MAIL_USER=your_email@example.com
MAIL_PASS=your_email_app_password
# Frontend URLs
FRONTEND_URL_DEVELOPMENT=http://localhost:5173
FRONTEND_URL_PRODUCTION=https://your-frontend.onrender.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### `frontend/.env`

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_URL=http://localhost:5173
VITE_MODE=development
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback
```

> **Security Notice:** Never commit `.env` files or production credentials to version control. Ensure environment files are included in `.gitignore`.

---

## Available Scripts

### Backend

| Command     | Description                   |
| ----------- | ----------------------------- |
| `npm start` | Start the server with Nodemon |

### Frontend

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the Vite development server    |
| `npm run build`   | Build the application for production |

---

## API Overview

All API endpoints use the `/api` prefix. Authentication is managed through JWT sessions stored in HTTP-only cookies.

| Module        | Base Path                 | Description                                                   |
| ------------- | ------------------------- | ------------------------------------------------------------- |
| Auth          | `/api/auth`               | Signup, login, logout, OTP, password recovery, Google OAuth   |
| Users         | `/api/users`              | User profiles, search, online status                          |
| Clubs         | `/api/clubs`              | CRUD operations, members, join requests, administration, chat |
| Events        | `/api/events`             | Event CRUD and RSVP                                           |
| Roles         | `/api/roles`              | Custom role management                                        |
| Profiles      | `/api/profiles`           | Extended user profile fields                                  |
| Resources     | `/api/resources`          | Campus resource definitions                                   |
| Bookings      | `/api/bookings`           | Resource booking and cancellation                             |
| Notifications | `/api/notifications`      | Real-time notifications and history                           |
| Analytics     | `/api/analytics`          | Charts and metrics                                            |
| Private Chat  | `/api/chats`, `/api/chat` | Private messaging, requests, and blocking                     |
| Chat Rooms    | `/api/chatrooms`          | Persistent chat rooms                                         |
| Feed          | `/api/feed`               | Activity feed                                                 |
| Admin         | `/api/admin`              | Administrative moderation                                     |

For complete request and response behavior, refer to the controllers in `backend/src/controllers/`.

---

<div align="center">

If you find this project useful, consider starring the repository.

</div>
