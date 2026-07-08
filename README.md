# HMP - Hostel Management Project

HMP is a hostel management system for colleges. It combines an Express and MongoDB backend with a React and Vite frontend to support role-based workflows for students, wardens, admins, and staff.

## Overview

The project is organized into two main parts:

- `HMP/BackEnd` - REST API, authentication, business logic, and database integration.
- `HMP/FrontEnd` - React UI, protected dashboards, and role-based navigation.

The application supports common hostel operations such as user authentication, hostel and room management, complaint handling, notices, and dashboard views for different roles.

## Features

- Role-based login and protected routes for student, warden, admin, super admin, and staff flows.
- JWT and cookie-based authentication.
- Admin tools for managing users, hostels, rooms, and role creation.
- Warden tools for student management, staff management, complaints, notices, and analytics.
- Student dashboard for profile completion, notices, and complaint submission.
- Frontend state management with Redux Toolkit and theme handling with React context.
- File uploads and external service integrations for cloud storage and payments.

## Tech Stack

- Backend: Node.js, Express, MongoDB, Mongoose, Redis, JWT, Multer, Cloudinary, Razorpay
- Frontend: React, Vite, React Router, Redux Toolkit, Axios, Tailwind CSS, Radix UI

## Project Structure

```text
HMP/
  BackEnd/
	 src/
		app.js
		index.js
		controllers/
		db/
		middlewares/
		models/
		routes/
		utilities/
  FrontEnd/
	 src/
		App.jsx
		main.jsx
		api/
		components/
		pages/
		store/
```

## Prerequisites

- Node.js 18 or newer
- MongoDB database
- Optional services used by the backend:
  - Cloudinary account for media uploads
  - Redis instance if you enable Redis usage

## Backend Setup

1. Open the backend folder:

	```bash
	cd HMP/BackEnd
	```

2. Install dependencies:

	```bash
	npm install
	```

3. Create a `.env` file in `HMP/BackEnd` and add the required variables:

	```env
	PORT=8000
	CORS_ORIGIN=http://localhost:5173
	MOGODB_URI=mongodb://127.0.0.1:27017
	ACCESS_TOKEN_SECRET=your_access_token_secret
	ACCESS_TOKEN_EXPIRY=1d
	REFRESH_TOKEN_SECRET=your_refresh_token_secret
	REFRESH_TOKEN_EXPIRY=7d
	CLOUDINARY_CLOUD_NAME=your_cloudinary_name
	CLOUDINARY_API_KEY=your_cloudinary_key
	CLOUDINARY_API_SECRET=your_cloudinary_secret
	ALLOW_SUPER_ADMIN_CREATION=true
	NODE_ENV=development
	```

4. Start the backend server:

	```bash
	npm run dev
	```

The API runs on `http://localhost:8000` by default.

## Frontend Setup

1. Open the frontend folder:

	```bash
	cd HMP/FrontEnd
	```

2. Install dependencies:

	```bash
	npm install
	```

3. Create a `.env` file in `HMP/FrontEnd` if you need to override the backend URL:

	```env
	VITE_SERVER_URL=http://localhost:8000
	```

4. Start the frontend dev server:

	```bash
	npm run dev
	```

By default, Vite runs on `http://localhost:5173`.

## Common Scripts

### Backend

- `npm run dev` - Start the Express server with Nodemon.

### Frontend

- `npm run dev` - Start the Vite development server.
- `npm run build` - Build the frontend for production.
- `npm run lint` - Run ESLint.
- `npm run preview` - Preview the production build locally.

## Notes

- The frontend uses an Axios client that refreshes authentication automatically when a `401` response is returned.
- The backend expects cookies and CORS to be configured so the frontend can communicate with the API.
- If you change the frontend port or backend URL, update `CORS_ORIGIN` and `VITE_SERVER_URL` accordingly.