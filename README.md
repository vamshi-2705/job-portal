# Job Portal MERN Stack Application

A complete, production-ready job portal application built with the MERN stack (MongoDB, Express, React, Node.js) and Redux Toolkit.

## Features

### Roles
- **Job Seeker**: Search, filter, and apply for jobs; build a profile; upload resumes; bookmark jobs.
- **Recruiter (Employer)**: Post new job openings, manage applications, and update application statuses (pending, shortlisted, rejected).
- **Admin**: Overall system overview, manage layout and statistics, delete abusive users or job posts.

### Tech Stack
- **Frontend**: React (Vite), Redux Toolkit, Tailwind CSS, React Router DOM, Axios, Lucide React (Icons).
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JSON Web Tokens (JWT), bcryptjs, Multer + Cloudinary (for file uploads).

## Installation Instructions

### 1. Prerequisite Setup
- Ensure you have **Node.js** and **MongoDB** installed on your system.
- Or use a MongoDB Atlas cloud URI.
- Create a [Cloudinary](https://cloudinary.com/) account for resume storage.

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in your details:
   ```bash
   cp .env.example .env
   ```
   *Make sure you provide valid `MONGO_URI`, `JWT_SECRET`, and Cloudinary variables.*
4. Start the backend development server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React app:
   ```bash
   npm run dev
   ```
   *(Ensure the frontend is served on `http://localhost:5173` if you matched the backend configuration).*

## Folder Structure
```
job-portal/
├── backend/
│   ├── config/          # DB Configuration
│   ├── controllers/     # Route logic functions
│   ├── middleware/      # Auth, Logging, Uploading, Error Handlers
│   ├── models/          # Mongoose DB Schemas
│   ├── routes/          # Express route definitions
│   ├── utils/           # Utility functions like token generation
│   ├── .env             # Environment variables
│   └── server.js        # Main entry point for the API
│
└── frontend/
    ├── src/
    │   ├── components/  # Reusable UI components (Navbar, JobCard, routing tools)
    │   ├── pages/       # Next level complex UI chunks
    │   ├── store/       # Redux logical slices and core store
    │   ├── App.jsx      # Root tree definition and routing
    │   ├── main.jsx     # Root mount point
    │   └── index.css    # Tailwind entry point
    ├── vite.config.js   # Client configuration (with target proxy -> backend localhost:5000)
    └── tailwind.config.js
```

## API Documentation (Endpoints Overview)

### Auth (`/api/auth`)
- `POST /register`: Register a new user
- `POST /login`: Log in a user (returns JWT via HTTP-only cookie & user profile)
- `POST /logout`: Clear token cookie
- `GET /profile`: Get logged-in user details
- `PUT /profile`: Update logged-in user profile

### Jobs (`/api/jobs`)
- `GET /`: Fetch all jobs (supports `?keyword=`, `?location=`, `?category=`, `?minSalary=`, `?page=`)
- `GET /:id`: Fetch a specific job detail
- `POST /`: Post a new job (Recruiter/Admin only)
- `PUT /:id`: Update a specific job you posted (Recruiter/Admin only)
- `DELETE /:id`: Delete a specific job (Recruiter/Admin only)

### Applications (`/api/applications`)
- `POST /:jobId/apply`: Apply for a job (Job Seeker only)
- `GET /me`: Get applied jobs list for the logged in user
- `GET /:jobId/applicants`: Recruiter views applications submitted to their specific job
- `PUT /:id/status`: Recruiter updates application status
- `DELETE /:id`: Job Seeker withdraws a given application
- `POST /:jobId/save`: Job Seeker saves a job
- `GET /saved`: Get all saved jobs
- `DELETE /saved/:id`: Remove a saved job

### Users (`/api/users`)
- `GET /admin/stats`: Get dashboard stat totals (Admin only)
- `GET /recruiter/stats`: Get stats for recruiter specifically
- `GET /`: Get all users (Admin only)
- `GET /:id`: Get specific user (Admin only)
- `DELETE /:id`: Delete a user account (Admin only)

### Uploads (`/api/upload`)
- `POST /`: Using Multer and Cloudinary configurations to accept and upload local resumes to cloud, returning a URL link. (Requires `multipart/form-data`)
