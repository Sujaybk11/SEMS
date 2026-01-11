# Smart Examination Management System (SEMS)

A MERN stack application for managing university examinations with role-based access control.

## Features

- **Student Module**: View and register for approved exams, withdraw from exams
- **Faculty Module**: Create exams, monitor registrations
- **Admin Module**: Approve exams, monitor system activity
- **JWT Authentication**: Secure role-based access control
- **Real-time Updates**: Dynamic UI updates without page reloads

## Setup Instructions

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start MongoDB (ensure MongoDB is running on localhost:27017)

4. Seed the database with sample data:
   ```bash
   npm run seed
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Login Credentials

After running the seed script, use these credentials:

- **Admin**: admin@sems.com / password123
- **Faculty**: faculty@sems.com / password123  
- **Student**: student@sems.com / password123

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Exams
- `GET /api/exams/approved` - Get approved exams (Student)
- `POST /api/exams/create` - Create exam (Faculty)
- `PUT /api/exams/approve/:examId` - Approve exam (Admin)
- `GET /api/exams/all` - Get all exams (Admin)
- `GET /api/exams/faculty` - Get faculty's exams (Faculty)

### Registrations
- `POST /api/registrations/register/:examId` - Register for exam (Student)
- `DELETE /api/registrations/withdraw/:examId` - Withdraw from exam (Student)
- `GET /api/registrations/my` - Get student's registrations (Student)
- `GET /api/registrations/faculty` - Get faculty's exam registrations (Faculty)
- `GET /api/registrations/all` - Get all registrations (Admin)

## Technology Stack

- **Frontend**: React.js, React Router, Axios
- **Backend**: Node.js, Express.js, JWT
- **Database**: MongoDB, Mongoose
- **Authentication**: JWT tokens with role-based middleware