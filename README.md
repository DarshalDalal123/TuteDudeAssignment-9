# Visitor Pass Management System

A role-based Visitor Pass Management System built with the MERN stack.

## Overview

This project handles visitor pre-registration, employee approval workflow, pass generation, and security gate check-in/check-out.

Supported roles:

- Admin
- Employee (Host)
- Security
- Visitor (pre-registration flow)

## Key Features

- JWT-based authentication and protected APIs
- Visitor pre-registration with image upload (Cloudinary)
- Employee review and status updates for visitor appointments
- QR pass generation and PDF pass email delivery
- Security scan flow for check-in/check-out logs
- Dashboard statistics for Admin, Employee, and Security

## Tech Stack

- Frontend: React, Vite, Axios, React Router, Tailwind CSS
- Backend: Node.js, Express, Mongoose, JWT
- Database: MongoDB
- Integrations: Cloudinary, Nodemailer, PDFKit, QRCode

## Project Structure

```text
Assignment 9/
  backend/    Express API + MongoDB models
  frontend/   React + Vite client
```

## Prerequisites

- Node.js 18 or above
- npm 9 or above
- MongoDB connection string (Atlas or local)
- Cloudinary account (for visitor photo upload)
- Gmail account with app password (for email sending)

## Environment Variables

Create backend/.env:

```env
PORT=5000
MONGO_URI=mongodb+srv://darshaldalal_db_user:bDVkpGkKEuCYRZUv@cluster0.qhcoqgt.mongodb.net/visitor-management-system?appName=Cluster0
CLIENT_URL=http://localhost:5173
JWT_SECRET=DarshalDalalSecretKey
CLOUDINARY_CLOUD_NAME=dvf9xrf7d
CLOUDINARY_API_KEY=732627493476415
CLOUDINARY_API_SECRET=i3Vl2koWyKH9cxuTnxFMXKGvn_M
EMAIL_USER=tempmail3012@gmail.com
EMAIL_PASS=iyodkucfrgewxubn
```

Create frontend/.env:

```env
VITE_API_URL=http://localhost:5000
```

Notes:

- Keep CLIENT_URL aligned with your frontend dev URL.
- EMAIL_USER must be a real Gmail address and EMAIL_PASS should be a Gmail app password.

## Installation

From project root:

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Run Locally

Start backend server:

```bash
cd backend
npm run dev
```

Start frontend in a separate terminal:

```bash
cd frontend
npm run dev
```

Default local URLs:

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- API base: http://localhost:5000/api

## Demo Login Credentials

Use the following credentials for role-based login:

- Admin
  - Email: darshaldalal66@gmail.com
  - Password: Darshal@3012
- Employee Login 1
  - Email: darshaldalal@gmail.com
  - Password: Darshal@123
- Employee Login 2
  - Email: darshaldalal456@gmail.com
  - Password: Darshal@123
- Security
  - Email: darshal3012@gmail.com
  - Password: Darshal@123

## API Routes (High Level)

### Users

- POST /api/users/login
- POST /api/users/signup (protected)
- GET /api/users/getuser (protected)
- GET /api/users/allemployees (protected)

### Visitor

- POST /api/visitor/pre-register
- GET /api/visitor/allemployees

### Admin

- GET /api/admin/dashboard-stats (protected)
- GET /api/admin/getAllVisitors (protected)

### Employee

- GET /api/employee/dashboard-stats (protected)
- GET /api/employee/upcoming-visitors (protected)
- GET /api/employee/getAllVisitors (protected)
- PUT /api/employee/visitor-request/:appointmentId (protected)

### Security

- GET /api/security/dashboard (protected)
- GET /api/security/getAllVisitorsInside (protected)
- GET /api/security/getAllSecurities (protected)
- GET /api/security/visitCheckLog (protected)
- POST /api/security/updateCheckInOutTime/:qrCode (protected)

## Application Flow

1. Visitor pre-registers and uploads photo.
2. Employee receives and reviews the visitor request.
3. Upon approval, the system generates pass details (QR/PDF) and emails them.
4. Security scans QR at entry/exit and logs check-in/check-out.

## Available Scripts

Backend (backend/package.json):

- npm run dev

Frontend (frontend/package.json):

- npm run dev
- npm run build
- npm run preview
- npm run lint

## Assignment Notes

- This repository is intended for academic/assignment use.
- GitHub Repository: https://github.com/DarshalDalal123/TuteDudeAssignment-9

## Video Demo

- Visitor Pre Registration

https://github.com/user-attachments/assets/9fd0ef36-4eeb-460f-acaf-36d9f3abc583

- Employee Login and Seeing Dashboard and Visitor Requests

https://github.com/user-attachments/assets/91b46457-933a-4adb-b437-3169dbba1668

- Approving Visitor Request by the Employee

https://github.com/user-attachments/assets/deff8e1d-d7e4-4665-b807-ec9351322e2d

- Visitor Pass gets sent to the visitor email

<img width="1600" height="577" alt="Screenshot 2026-03-22 221611" src="https://github.com/user-attachments/assets/5ddcec56-b922-4cd9-819e-06f28a68a09f" />

- Security Login and Checking In the visitor using the qr attached in the visitor pass

https://github.com/user-attachments/assets/63c23c9a-b4d7-467e-92d6-a634cf594c4b

- Checking out the visitor using the same qr

https://github.com/user-attachments/assets/772e1030-5ef3-4722-ac7f-0924be69fa39

- Security Dashboard gets updated

<img width="1919" height="868" alt="Screenshot 2026-03-22 222016" src="https://github.com/user-attachments/assets/4d3d487d-cbee-4bf3-9891-3943a5cbc452" />
