# Visitor Pass Management System (MERN)

A role-based Visitor Pass Management System built with MongoDB, Express, React, and Node.js.

## Project Structure

```text
Assignment 9/
	backend/    # Express + MongoDB API
	frontend/   # React + Vite client
```

## Features

- JWT authentication and protected routes
- Role-based access for:
	- Admin
	- Employee (Host)
	- Security
	- Visitor pre-registration flow
- Visitor pre-registration with photo upload (Cloudinary)
- Employee approval/cancellation of appointments
- Visitor pass generation (QR + PDF) and email delivery
- Security scan flow for check-in/check-out
- Admin and employee dashboard stats

## Tech Stack

- Frontend: React, Vite, TailwindCSS, Axios, React Router
- Backend: Node.js, Express, Mongoose, JWT
- Database: MongoDB
- Integrations: Cloudinary, Nodemailer, QRCode, PDFKit

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB Atlas URI or local MongoDB instance
- Cloudinary account
- Gmail account/App Password for email sending

## Environment Variables

Create a .env file in backend/:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
```

Create a .env file in frontend/:

```env
VITE_API_URL=http://localhost:5000
```

## Installation

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

## Run the Application

Start backend:

```bash
cd backend
npm run dev
```

Start frontend (new terminal):

```bash
cd frontend
npm run dev
```

Frontend will run on http://localhost:5173 and connect to backend at http://localhost:5000.

## API Overview

Base URL: http://localhost:5000/api

### Auth and Users

- POST /users/login
- POST /users/signup (admin only)
- GET /users/getuser
- GET /users/allemployees

### Visitor

- POST /visitor/pre-register
- GET /visitor/allemployees

### Admin

- GET /admin/dashboard-stats
- GET /admin/getAllVisitors

### Employee

- GET /employee/dashboard-stats
- GET /employee/getAllVisitors
- GET /employee/upcoming-visitors
- PUT /employee/visitor-request/:appointmentId

### Security

- GET /security/getAllSecurities
- POST /security/updateCheckInOutTime/:qrCode

## Main User Flows

1. Visitor pre-registers by filling details and uploading photo.
2. Employee reviews request and updates appointment status.
3. On scheduling, system generates QR pass and emails PDF to visitor.
4. Security scans QR at gate:
	 - First scan: check-in
	 - Second scan: check-out

## Notes

- This project currently focuses on core assignment requirements.
- SMS integration, seed script, and deployment can be added as next steps.

## Scripts

Backend (backend/package.json):

- npm run dev

Frontend (frontend/package.json):

- npm run dev
- npm run build
- npm run preview
- npm run lint

## Deliverables Checklist

- Source code in GitHub
- Setup guide (this README)
- Screenshots and demo video
- Demo data script (recommended to add)

## License

This project is for academic/assignment use.
