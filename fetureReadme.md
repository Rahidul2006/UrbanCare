# UrbanCare - Civic Issue Reporting App

A modern web application for citizens to report civic issues and municipalities to manage them efficiently. Built with React, Vite, Tailwind CSS, and MySQL.

---

# Civic Issue Reporting App
  This is a code bundle for Civic Issue Reporting App. 
## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
  ## live project : https://urbanca.netlify.app/

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Features](#features)
3. [Installation](#installation)
4. [Authentication](#authentication)
5. [API Endpoints](#api-endpoints)
6. [Database Schema](#database-schema)
7. [Project Structure](#project-structure)
8. [Environment Configuration](#environment-configuration)

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MySQL Server (running on localhost:3306)
- npm or yarn

### Get Started in 5 Minutes

```bash
# 1. Install dependencies
npm install
cd backend
npm install
cd ..

# 2. Configure database (update backend/.env)
# Update DB_PASSWORD with your MySQL password

# 3. Start Backend (Terminal 1)
cd backend
npm start
# Expected: "Server running on http://localhost:5000"

# 4. Start Frontend (Terminal 2)
npm run dev
# Expected: "Local: http://localhost:3001"

# 5. Open browser and navigate to http://localhost:3001
```

---

## ✨ Features

### For Citizens
- 📝 **Report Issues** - Submit civic issues with description, location, category
- 📊 **Track Status** - View reported issues and their resolution status
- 💬 **Real-time Updates** - See when issues are assigned or resolved
- 📱 **Mobile Friendly** - Responsive design for all devices

### For Municipal Staff (Admin)
- 📋 **Issue Management** - View and manage all reported issues
- ✅ **Status Updates** - Mark issues as in-progress or resolved
- 📊 **Analytics Dashboard** - View statistics and trends
- 👥 **User Management** - Manage citizen and admin accounts

### For Central Administration
- 🏛️ **System Oversight** - Monitor entire municipality system
- 📈 **Advanced Analytics** - Detailed reports and insights
- ⚙️ **System Configuration** - Manage admins and settings
- 🔍 **Audit Trail** - Track all system activities

---

## 🔧 Installation

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd "Civic Issue Reporting App"
```

### Step 2: Install Frontend Dependencies
```bash
npm install
```

### Step 3: Install Backend Dependencies
```bash
cd backend
npm install
cd ..
```

### Step 4: Configure Environment
Edit `backend/.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=urbancare
PORT=5000
```

### Step 5: Start Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

---

## 🔐 Authentication

### System Roles
- **Citizen** - Regular users reporting issues
- **Admin** - Municipal staff managing issues
- **Central Admin** - System administrators

### Pre-configured Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@city.gov | demo123 |
| Central Admin | central.admin@city.gov | demo123 |

### Citizen Registration
- Click "Citizen" tab → "Register Now"
- Required fields: Name, Mobile Number (10+ digits), Email, Password
- Mobile number is required for issue follow-up
- After registration, use credentials to login

### Login Flow
1. Select user role (Citizen/Admin/Central Admin)
2. Enter email and password
3. Click "Sign In"
4. Redirected to appropriate dashboard

---

## 🌐 API Endpoints

**Base URL:** `http://localhost:5000/api`

### Authentication Endpoints

#### POST `/auth/register`
Register a new citizen account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "name": "John Doe",
  "mobile": "9876543210"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "User registered successfully"
}
```

#### POST `/auth/login`
Authenticate user with email, password, and role.

**Request:**
```json
{
  "email": "admin@city.gov",
  "password": "demo123",
  "role": "admin"
}
```

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "email": "admin@city.gov",
    "name": "Admin User",
    "mobile": null,
    "role": "admin"
  }
}
```

#### POST `/auth/check-email`
Verify if email is already registered.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "exists": false
}
```

#### GET `/health`
Health check endpoint.

**Response (200):**
```json
{
  "status": "ok"
}
```

---

## 🗄️ Database Schema

### users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  mobile VARCHAR(20),
  role ENUM('citizen', 'admin', 'central-admin') DEFAULT 'citizen',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX(email),
  INDEX(role)
);
```

### Database Initialization
- Database `urbancare` auto-creates on first server startup
- `users` table automatically created
- Predefined admin accounts created automatically:
  - admin@city.gov (password hashed)
  - central.admin@city.gov (password hashed)

---

## 📁 Project Structure

```
Civic Issue Reporting App/
├── src/
│   ├── components/
│   │   ├── AuthPage.jsx           # Login/Registration
│   │   ├── CitizenInterface.jsx   # Citizen Dashboard
│   │   ├── AdminInterface.jsx     # Admin Dashboard
│   │   ├── CentralAdminDashboard.jsx
│   │   └── [35+ UI Components]    # Reusable UI components
│   ├── data/
│   │   └── mockData.js            # Sample issue data
│   ├── utils/
│   │   └── roleColors.js          # Role-based color system
│   ├── App.jsx                    # Main app component
│   ├── main.jsx                   # React entry point
│   └── index.css                  # Global styles
│
├── backend/
│   ├── server.js                  # Express server
│   ├── package.json               # Backend dependencies
│   ├── .env                       # Environment variables
│   └── uploads/                   # File uploads directory
│
├── public/
├── build/                         # Production build
├── package.json                   # Frontend dependencies
├── vite.config.js                 # Vite configuration
├── tailwind.config.js             # Tailwind CSS config
├── postcss.config.js              # PostCSS config
└── README.md                      # This file
```

---

## 🎨 Technology Stack

### Frontend
- **React 18** - UI library
- **Vite 6** - Fast build tool
- **Tailwind CSS 3** - Utility-first CSS
- **Lucide React** - Icon library
- **Recharts** - Data visualization
- **Date-fns** - Date utilities

### Backend
- **Express.js** - Web framework
- **MySQL2** - Database driver
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin handling
- **dotenv** - Environment variables

---

## 🔒 Security Features

✅ **Password Hashing** - All passwords hashed with bcryptjs  
✅ **Email Validation** - Format and uniqueness verification  
✅ **Role-Based Access** - Separate interfaces for each role  
✅ **Input Validation** - Client and server-side validation  
✅ **Environment Variables** - Sensitive data in .env  
✅ **CORS Protection** - Restricted cross-origin requests  

---

## ⚙️ Environment Configuration

### backend/.env
```env
# MySQL Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=urbancare

# Server
PORT=5000
```

### Update Steps
1. Open `backend/.env`
2. Replace `your_password_here` with your MySQL root password
3. Ensure MySQL is running and `urbancare` database exists
4. Save and restart backend server

---

## 🚀 Build & Deployment

### Production Build
```bash
npm run build
```
Output: `dist/` folder ready for deployment

### Development
```bash
npm run dev
```
Hot reload enabled at http://localhost:3001

### Backend Production
```bash
cd backend
npm start
```
For production, consider:
- Using process manager (PM2)
- Setting up HTTPS/SSL
- Configuring environment-specific .env
- Setting up MySQL backups

---

## 🧪 Testing Accounts

### Admin Account
```
Email: admin@city.gov
Password: demo123
Role: Admin
```

### Central Admin Account
```
Email: central.admin@city.gov
Password: demo123
Role: Central Admin
```

### Create Citizen Account
Use the registration form on the Citizen tab

---

## 🐛 Troubleshooting

### Backend Won't Start
```
Error: connect ECONNREFUSED 127.0.0.1:3306
Solution: 
- Start MySQL server
- Check DB credentials in backend/.env
- Verify urbancare database exists
```

### "Can't connect to server" Error
```
Error: Failed to fetch
Solution:
- Ensure backend is running: npm start (in backend/)
- Check if port 5000 is available
- Verify firewall isn't blocking port 5000
```

### Login Fails with Admin Account
```
Solution:
- Check backend console for errors
- Verify users table was created
- Restart backend server
```

### Mobile Field Not Showing
```
Solution:
- Make sure you're on "Citizen" tab
- Click "Register Now" button
- Mobile field appears in registration form
```

### Port Already in Use
```
Frontend: "Port 3000 is in use, trying another one..."
- Will automatically use 3001 or next available port

Backend: Cannot start on port 5000
- Check what's using port 5000: netstat -ano | findstr :5000
- Kill the process or change PORT in backend/.env
```

---

## 📝 Development Notes

### Adding New Pages
1. Create component in `src/components/`
2. Import in `src/App.jsx`
3. Add routing logic
4. Use role-based colors from `src/utils/roleColors.js`

### Styling with Tailwind
- All components use Tailwind utility classes
- Custom colors defined in `tailwind.config.js`
- Use role-specific colors: `roleColors.citizen`, `roleColors.admin`, etc.

### Adding Backend Endpoints
1. Add new route in `backend/server.js`
2. Implement validation and business logic
3. Return JSON response with appropriate status code
4. Call from frontend with fetch API

---

## 📞 Support & Issues

If you encounter issues:

1. **Check Console** - Press F12 to open developer console
2. **Check Backend Logs** - Look at terminal running backend server
3. **Verify Configuration** - Ensure .env files are correct
4. **Restart Services** - Stop and restart both frontend and backend
5. **Clear Cache** - Hard refresh browser (Ctrl+Shift+R)

---

## 📄 License

[Add your license information here]

---

## 👥 Contributors

[Add contributor information here]

---

## 📈 Future Enhancements

- [ ] Issue assignment to specific admins
- [ ] Email notifications for issue updates
- [ ] Advanced search and filtering
- [ ] Issue comments and discussions
- [ ] Photo/attachment uploads
- [ ] SMS notifications
- [ ] Mobile app
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Unit and integration tests
- [ ] Performance monitoring

---

**Last Updated**: November 2024  
**Status**: ✅ Production Ready  
**Version**: 1.0

For more information or support, contact the development team.
