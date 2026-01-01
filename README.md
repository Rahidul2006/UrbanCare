# UrbanCare 🏛️

> A modern civic issue reporting platform connecting citizens with municipalities for efficient problem resolution.

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://urbanca.netlify.app)
[![React](https://img.shields.io/badge/React-18.3-blue)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-v16+-green)](https://nodejs.org)
[![License](https://img.shields.io/badge/License-ISC-yellow)](LICENSE)

---

## 🌟 Overview

UrbanCare is a comprehensive civic issue reporting and management system designed to bridge the gap between citizens and municipal authorities. The platform enables citizens to report issues, track their resolution status, and provides administrators with powerful tools to manage, analyze, and resolve civic problems efficiently.

### Key Features

- **Multi-Role System** - Citizen, Municipal Admin, and Central Administration interfaces
- **Real-time Issue Tracking** - Track reported issues from submission to resolution
- **Advanced Analytics** - Comprehensive dashboards with insights and trends
- **Mobile Responsive** - Seamless experience across all devices
- **Secure Authentication** - Password hashing with bcrypt
- **Role-based Access Control** - Granular permission management

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v16 or higher
- **npm** or **yarn** package manager
- **MySQL Server** (running locally or remote)
- **Git** (optional, for cloning)

### Installation (5 minutes)

```bash
# 1. Clone or navigate to the project directory
cd "Civic Issue Reporting App"

# 2. Install frontend dependencies
npm install

# 3. Install backend dependencies
cd backend
npm install
cd ..

# 4. Configure database
# Create .env file in backend/ directory (see Configuration section)

# 5. Start Backend Server (Terminal 1)
cd backend
npm run dev
# Output: Server running on http://localhost:5000

# 6. Start Frontend Development Server (Terminal 2)
npm run dev
# Output: Local: http://localhost:5173 or http://localhost:3001

# 7. Open in browser
# Navigate to http://localhost:5173 (or the URL shown in terminal)
```

---

## 🔑 Demo Accounts

Test the application with these pre-configured accounts:

### 👤 Citizen Accounts
```
Email: alex@example.com
Password: demo123

Email: maria@example.com
Password: demo123
```

### 🛡️ Municipal Admin Accounts
```
Email: admin@city.gov
Password: demo123

Email: mike@city.gov
Password: demo123
```

### 👑 Central Administration Accounts
```
Email: central.admin@city.gov
Password: demo123

Email: system.admin@city.gov
Password: demo123
```

---

## 📁 Project Structure

```
Civic Issue Reporting App/
├── 📂 frontend/                    # React + Vite application
│   ├── src/
│   │   ├── components/             # Reusable UI components (50+ components)
│   │   │   ├── AuthPage.jsx
│   │   │   ├── CitizenInterface.jsx
│   │   │   ├── AdminInterface.jsx
│   │   │   ├── CentralAdminDashboard.jsx
│   │   │   └── ...UI components
│   │   ├── data/                   # Mock and central admin data
│   │   ├── styles/                 # Global CSS and Tailwind
│   │   ├── utils/                  # Utility functions
│   │   ├── types/                  # TypeScript types
│   │   ├── App.jsx                 # Main application component
│   │   └── main.jsx                # Entry point
│   ├── build/                      # Production build output
│   ├── vite.config.js              # Vite configuration
│   ├── tailwind.config.js          # Tailwind CSS configuration
│   ├── package.json
│   └── README.md
│
├── 📂 backend/                     # Express.js API server
│   ├── server.js                   # Main server file
│   ├── uploads/                    # File upload directory
│   ├── package.json
│   └── .env                        # Environment configuration
│
└── README.md (this file)
```

---

## ⚙️ Configuration

### Backend Environment Setup

Create a `.env` file in the `backend/` directory:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=urbancare

# Server Configuration
PORT=5000
NODE_ENV=development
```

### Frontend Configuration

The frontend is configured via `vite.config.js` and `tailwind.config.js`. The API base URL is typically set to `http://localhost:5000`.

---

## 🎨 Technology Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 18.3.1 | UI framework |
| **Vite** | Latest | Build tool & dev server |
| **Tailwind CSS** | Latest | Utility-first CSS |
| **Radix UI** | Latest | Headless UI components |
| **Recharts** | 2.15.2 | Data visualization |
| **Lucide React** | 0.487.0 | Icon library |
| **React Hook Form** | 7.55.0 | Form state management |
| **Next Themes** | 0.4.6 | Theme switching |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | 16+ | Runtime environment |
| **Express.js** | 5.1.0 | Web framework |
| **MySQL** | 8.0+ | Database |
| **mysql2** | 3.6.5 | MySQL driver |
| **bcryptjs** | 2.4.3 | Password hashing |
| **CORS** | 2.8.5 | Cross-origin requests |
| **dotenv** | 16.3.1 | Environment variables |

---


## 🎯 Features by Role

### For Citizens 👤
- ✅ Report new civic issues
- ✅ Add descriptions and location details
- ✅ Upload issue photos
- ✅ Track issue status in real-time
- ✅ View all personal reported issues
- ✅ Receive notifications on status updates

### For Municipal Admins 🛡️
- ✅ View all reported issues
- ✅ Filter and search issues
- ✅ Assign issues to team members
- ✅ Update issue status (Open → In Progress → Resolved)
- ✅ Add comments and notes
- ✅ View departmental analytics
- ✅ Generate reports

### For Central Administration 👑
- ✅ System-wide oversight
- ✅ Monitor all municipalities
- ✅ Advanced analytics and insights
- ✅ User management (create/delete admins)
- ✅ System configuration
- ✅ Audit trail and activity logs
- ✅ Performance metrics

---

## 🧪 Testing

### Test with Demo Account
1. Visit the live demo: https://urbanca.netlify.app
2. Use any of the demo credentials provided above
3. Navigate through different user roles

### Local Testing
```bash
# Run with development server (auto-reload enabled)
cd backend
npm run dev

# In another terminal
cd frontend
npm run dev
```

---

## 🔐 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **CORS Protection**: Configured CORS headers
- **Environment Variables**: Sensitive data in .env files
- **Role-Based Access**: Granular permission control
- **Input Validation**: Form validation on both client and server
- **SQL Prepared Statements**: Protection against SQL injection

---

## 📦 Available Scripts

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Backend
```bash
npm start        # Start production server
npm run dev      # Start with nodemon (auto-reload)
```

---

## 🌐 Live Demo

**Visit the live application**: https://urbanca.netlify.app

The frontend is deployed on Netlify and connects to the backend API for real-time data.

---


## 🚦 Development Workflow

### Branch Strategy
- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - Feature branches
