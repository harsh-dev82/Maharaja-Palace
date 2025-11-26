# 🏰 Maharaja Palace - 7-Star Luxury Hotel Booking System
## Milestone 1: Full Architecture & Initial Build Phase

**Status**: ✅ Milestone 1 Complete - Ready for Phase 2

---

## 📋 Project Overview

A comprehensive full-stack MERN application for a luxury 7-star hotel booking system. The platform includes:

- **User Authentication** with role-based access (Guest, Admin, Staff)
- **Room Management** with pricing and availability
- **Booking System** for rooms, banquet halls, and restaurant tables
- **Email Notifications** with Nodemailer integration
- **Admin Dashboard** for system management
- **Guest Dashboard** for booking history and management
- **Luxury UI Theme** with cream and gold color scheme

---

## 🏗️ Project Structure

```
hotel-palace/
├── backend/                    # Node.js + Express
│   ├── src/
│   │   ├── config/            # DB & env config
│   │   ├── models/            # MongoDB schemas (9 models)
│   │   ├── controllers/       # Business logic
│   │   ├── routes/            # API endpoints
│   │   ├── services/          # Email & Payment services
│   │   ├── middleware/        # Auth, error handling
│   │   ├── utils/             # Helpers & utilities
│   │   ├── app.js             # Express app
│   │   └── server.js          # Server entry
│   ├── .env                   # Environment variables
│   └── package.json
│
├── frontend/                  # React + Vite
│   ├── src/
│   │   ├── components/        # Base UI components
│   │   ├── pages/             # Page components (10 pages)
│   │   ├── layout/            # Layout & routing
│   │   ├── context/           # Auth context
│   │   ├── api/               # Axios API wrapper
│   │   ├── hooks/             # Custom hooks
│   │   ├── styles/            # Global Tailwind CSS
│   │   ├── App.jsx            # Main app
│   │   └── main.jsx           # Entry point
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md                  # This file
```

---

## 🎯 Features Implemented (Milestone 1)

### Backend ✅
- [x] User registration & login with JWT authentication
- [x] Role-based access control (RBAC)
- [x] 9 MongoDB schemas with full validation
- [x] CRUD operations for: Rooms, Bookings, Banquet Halls, Restaurant Tables
- [x] Email service integration (Nodemailer)
- [x] Error handling & logging
- [x] API versioning ready
- [x] Protected routes with middleware

### Frontend ✅
- [x] React + React Router with 10+ pages
- [x] Authentication (Login/Register)
- [x] Protected routes (Guest & Admin)
- [x] Context API for state management
- [x] Axios API integration with JWT
- [x] Tailwind CSS with luxury theme (Cream + Gold)
- [x] Responsive design
- [x] Base UI components (Button, Input, Card, Badge)
- [x] Dashboard for guest bookings
- [x] Admin dashboard skeleton

### Database Models ✅
- [x] User (authentication & profile)
- [x] RoomType (room categories)
- [x] Room (individual rooms)
- [x] Booking (room reservations)
- [x] BanquetHall (event venues)
- [x] BanquetBooking (event reservations)
- [x] RestaurantTable (dining tables)
- [x] RestaurantBooking (dining reservations)
- [x] EmailLog (email tracking)

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 16+ installed
- MongoDB running locally or MongoDB Atlas connection string
- npm or yarn

### Backend Setup

1. **Navigate to backend folder**
   ```bash
   cd hotel-palace/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Edit .env file with your settings
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/maharaja-palace
   JWT_SECRET=your_secure_jwt_secret_here
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start MongoDB**
   ```bash
   # Using MongoDB locally
   mongod
   
   # Or use MongoDB Atlas (update MONGODB_URI in .env)
   ```

5. **Run backend server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Or production mode
   npm start
   ```

   Backend will start on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend folder** (in a new terminal)
   ```bash
   cd hotel-palace/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

   Frontend will start on `http://localhost:5173`

4. **Access the application**
   - Open browser to `http://localhost:5173`

---

## 🔑 API Endpoints

### Authentication
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login user
GET    /api/auth/me                - Get current user (protected)
```

### Rooms
```
POST   /api/rooms/room-types       - Create room type (admin)
GET    /api/rooms/room-types       - Get all room types
POST   /api/rooms                  - Create room (admin)
GET    /api/rooms                  - Get all rooms (admin)
GET    /api/rooms/available        - Get available rooms (guest)
PUT    /api/rooms/:roomId/status   - Update room status (admin)
```

### Bookings
```
POST   /api/bookings               - Create booking (protected)
GET    /api/bookings/me            - Get my bookings (protected)
GET    /api/bookings/:bookingId    - Get booking details (protected)
PUT    /api/bookings/:bookingId/cancel - Cancel booking (protected)
GET    /api/bookings               - Get all bookings (admin)
```

### Banquet
```
POST   /api/banquet/halls          - Create hall (admin)
GET    /api/banquet/halls          - Get all halls
POST   /api/banquet/bookings       - Create booking (protected)
GET    /api/banquet/bookings/me    - Get my bookings (protected)
```

### Restaurant
```
POST   /api/restaurant/tables      - Create table (admin)
GET    /api/restaurant/tables      - Get all tables
POST   /api/restaurant/bookings    - Create booking (protected)
GET    /api/restaurant/bookings/me - Get my bookings (protected)
```

---

## 🧪 Testing the Application

### Test User Flow

1. **Register a new user**
   - Go to http://localhost:5173/register
   - Fill in details (email must be valid format, phone 10 digits)
   - Click Register
   - Automatically logged in

2. **View Dashboard**
   - Click "Dashboard" in navbar
   - See your bookings (initially empty)

3. **Explore Pages**
   - Navigate to Rooms, Banquet, Restaurant pages
   - View available options

4. **Admin Access**
   - Register with any credentials
   - Ask backend to change your role to 'admin' in database
   - Access `/admin` for admin panel

### Sample Admin Request
```bash
# Update user role to admin (in MongoDB)
db.users.updateOne(
  { email: "admin@test.com" },
  { $set: { role: "admin" } }
)
```

### Testing with Postman

1. Import API collection (generate from endpoints above)
2. Register: `POST /api/auth/register`
3. Copy token from response
4. Add to Authorization header: `Bearer <token>`
5. Test protected endpoints

---

## 🎨 Theme & Colors

**Color Palette** (Luxury Theme)
- **Cream**: `#FFF8E7` - Primary background
- **Gold**: `#D4AF37` - Accent color & headings
- **Dark Gold**: `#AA8C2C` - Hover states
- **Dark Background**: `#1a1a1a` - Footer text area

**Typography**
- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)
- **Alternative**: Lato (sans-serif)

**Component Styles**
- Luxury borders: 2px solid gold
- Smooth transitions: 300ms
- Generous spacing: Palace branding
- Hover effects: Gold fill transitions

---

## 📦 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT + bcryptjs
- **Email**: Nodemailer
- **Validation**: express-validator (ready)
- **Logging**: Custom logger utility
- **CORS**: Cross-origin support

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **State Management**: Context API
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **Fonts**: Google Fonts (Playfair Display, Inter, Lato)

---

## 🔐 Authentication

### JWT Flow
1. User registers/logs in
2. Server generates JWT token
3. Token stored in localStorage
4. Token added to Authorization header: `Bearer <token>`
5. Server validates token for protected routes
6. Invalid/expired tokens trigger logout

### Protected Routes
```jsx
<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>

<AdminRoute>
  <AdminPage />
</AdminRoute>
```

---

## 📧 Email Configuration

### Setup Gmail App Password
1. Enable 2FA on Gmail
2. Generate app-specific password
3. Add to `.env`:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

### Email Service Files
- Backend: `src/services/emailService.js`
- Emails sent on: Welcome, Booking confirmation
- Log stored in: `EmailLog` MongoDB collection

---

## 🗄️ Database Models

### User
- firstName, lastName, email, phone, password
- role (guest, admin, staff)
- profileImage, isEmailVerified, isActive
- lastLogin timestamp

### Room & RoomType
- Room number, type, floor, price, status
- Images, amenities, features
- Occupancy & size details

### Booking
- Guest & room references
- Check-in/check-out dates
- Total price & special requests
- Status (pending, confirmed, checked-in, etc.)

### BanquetHall & BanquetBooking
- Hall capacity (theater, cocktail, banquet)
- Event type & date
- Setup type & expected guests

### RestaurantTable & RestaurantBooking
- Table number, capacity, location
- Time slot (breakfast, lunch, dinner, etc.)
- Dietary requirements & special requests

### EmailLog
- Recipient, subject, type
- Status & error messages
- Related booking/user ID

---

## 🛠️ Development Commands

### Backend
```bash
npm install              # Install dependencies
npm run dev             # Start dev server (with auto-reload)
npm start               # Start production server
npm test                # Run tests (when configured)
```

### Frontend
```bash
npm install              # Install dependencies
npm run dev             # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build
npm run lint            # Run linter (when configured)
```

---

## 📝 Phase 2 Roadmap (Next Steps)

- [ ] Payment Gateway Integration (Razorpay/Stripe)
- [ ] Advanced booking validation with date conflict checking
- [ ] Room availability calendar view
- [ ] Reviews & ratings system
- [ ] SMS notifications
- [ ] Full admin dashboard with analytics
- [ ] Inventory management
- [ ] Dining menu management
- [ ] Guest profile management
- [ ] Advanced reporting & analytics

---

## 🐛 Troubleshooting

### Backend Won't Start
```bash
# Check MongoDB is running
mongod

# Check port 5000 isn't in use
lsof -i :5000

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Frontend Won't Load
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check Vite config for correct API proxy
```

### MongoDB Connection Error
```bash
# Local MongoDB
mongod --dbpath /path/to/data

# MongoDB Atlas
# Update MONGODB_URI in .env with correct connection string
```

### CORS Errors
```bash
# Ensure FRONTEND_URL in backend .env matches frontend URL
FRONTEND_URL=http://localhost:5173
```

---

## 📚 Useful Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Vite Documentation](https://vitejs.dev/)
- [React Router Documentation](https://reactrouter.com/)

---

## 👥 Team & Support

For questions or issues, please reach out to the development team.

**Project**: Maharaja Palace Hotel Booking System
**Version**: 1.0.0 (Milestone 1)
**Last Updated**: November 2024

---

## 📄 License

ISC

---

## 🎉 Next Steps

1. **Install & Run**
   - Follow Quick Start Guide above
   - Get both servers running

2. **Test Features**
   - Register and login
   - Explore all pages
   - Check API responses

3. **Customize**
   - Update hotel details
   - Modify room types
   - Configure email settings

4. **Deploy**
   - Setup production MongoDB
   - Deploy backend (Heroku, AWS, etc.)
   - Deploy frontend (Vercel, Netlify, etc.)

---

**Status**: Ready for Phase 2 Development 🚀
