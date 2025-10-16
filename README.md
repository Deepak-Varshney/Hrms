# HRMS - Employee Management System

A comprehensive HR Management System built with Next.js 14 (App Router), MongoDB, and TypeScript. This application allows you to manage employees and track attendance with a modern, responsive UI.

## Features

- 📊 **Dashboard**: Real-time attendance statistics for today and current month
- 👥 **Employee Management**: Full CRUD operations for employee records
- 📅 **Attendance Tracking**: Record and view employee attendance with filtering options
- 🎨 **Modern UI**: Beautiful, responsive design with dark mode support
- ⚡ **Server Actions**: Using Next.js server actions for data operations (no API routes)
- 🗄️ **MongoDB**: Robust database with Mongoose ODM

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB with Mongoose
- **Notifications**: Sonner
- **UI Components**: Custom components with Tailwind

## Prerequisites

Before you begin, ensure you have installed:
- Node.js 18+ 
- npm or yarn
- MongoDB Atlas account (or local MongoDB instance)

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd hrms-employee-management
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory and add your MongoDB connection string:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

Replace `<username>`, `<password>`, `<cluster>`, and `<database>` with your actual MongoDB credentials.

**Example:**
```env
MONGODB_URI=mongodb+srv://myuser:mypassword@cluster0.mongodb.net/hrms?retryWrites=true&w=majority
```

### 4. Run the development server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

```
├── actions/              # Server actions for data operations
│   ├── employeeActions.ts
│   └── attendanceActions.ts
├── app/                  # Next.js App Router
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Dashboard page
│   ├── employees/       # Employees page
│   └── attendance/      # Attendance page
├── components/           # React components
│   ├── icons/           # Icon components
│   ├── *.tsx            # Feature components
├── lib/                  # Utilities
│   └── mongodb.ts       # Database connection
├── models/               # Mongoose models
│   ├── Employee.ts
│   └── Attendance.ts
├── types.ts             # TypeScript types
└── constants.ts         # App constants
```

## Key Features Explained

### Server Actions

This application uses Next.js Server Actions instead of traditional API routes for all data operations:

- **Employee Actions**: Create, read, update, and delete employees
- **Attendance Actions**: Record and query attendance data

All server actions are located in the `/actions` directory and use the `'use server'` directive.

### MongoDB Integration

The application uses MongoDB with Mongoose for data persistence:

- **Connection Pooling**: Efficient connection management with caching
- **Schema Validation**: Type-safe data models
- **Indexes**: Optimized queries with proper indexing

### Data Models

**Employee Model:**
- Employee ID (auto-generated)
- Name, Email, Position, Department
- Hire Date, Salary, Status
- Timestamps

**Attendance Model:**
- Attendance ID (auto-generated)
- Employee ID (reference)
- Date, Status (Present/Absent/Late)
- Timestamps

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Building for Production

```bash
npm run build
npm start
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| MONGODB_URI | MongoDB connection string | Yes |

## License

MIT License - feel free to use this project for learning and development.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.
