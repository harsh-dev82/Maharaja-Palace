# DIRECTORY_STRUCTURE.md

# 🏰 Maharaja Palace - Complete Directory Structure

## Full Project Tree

```
hotel-palace/
│
├── 📄 README.md                          ← START HERE: Main project documentation
├── 📄 SETUP_GUIDE.md                     ← Step-by-step setup instructions
├── 📄 API_DOCUMENTATION.md               ← Complete API reference
├── 📄 QUICK_REFERENCE.md                 ← Quick reference guide
├── 📄 MILESTONE_1_SUMMARY.md             ← What's included summary
├── 📄 PROJECT_DELIVERY_SUMMARY.md        ← Full delivery documentation
├── 📄 setup.sh                           ← Automated setup script
│
├── 📁 backend/                           ← Backend (Node.js + Express)
│   ├── 📁 src/
│   │   ├── 📁 config/                    ← Configuration files
│   │   │   ├── db.js                     ← MongoDB connection
│   │   │   └── env.js                    ← Environment variables loader
│   │   │
│   │   ├── 📁 models/                    ← Database schemas (9 total)
│   │   │   ├── User.js                   ← User schema with auth
│   │   │   ├── RoomType.js               ← Room categories
│   │   │   ├── Room.js                   ← Individual rooms
│   │   │   ├── Booking.js                ← Room bookings
│   │   │   ├── BanquetHall.js            ← Event venues
│   │   │   ├── BanquetBooking.js         ← Event bookings
│   │   │   ├── RestaurantTable.js        ← Dining tables
│   │   │   ├── RestaurantBooking.js      ← Dining bookings
│   │   │   └── EmailLog.js               ← Email tracking
│   │   │
│   │   ├── 📁 controllers/               ← Business logic (5 files)
│   │   │   ├── authController.js         ← Auth logic (register, login)
│   │   │   ├── roomController.js         ← Room management
│   │   │   ├── bookingController.js      ← Booking management
│   │   │   ├── banquetController.js      ← Banquet management
│   │   │   └── restaurantController.js   ← Restaurant management
│   │   │
│   │   ├── 📁 routes/                    ← API routes (5 files)
│   │   │   ├── authRoutes.js             ← /api/auth endpoints
│   │   │   ├── roomRoutes.js             ← /api/rooms endpoints
│   │   │   ├── bookingRoutes.js          ← /api/bookings endpoints
│   │   │   ├── banquetRoutes.js          ← /api/banquet endpoints
│   │   │   └── restaurantRoutes.js       ← /api/restaurant endpoints
│   │   │
│   │   ├── 📁 services/                  ← Business services
│   │   │   ├── emailService.js           ← Email sending (Nodemailer)
│   │   │   └── paymentService.js         ← Payment placeholder
│   │   │
│   │   ├── 📁 middleware/                ← Custom middleware
│   │   │   ├── auth.js                   ← JWT protection
│   │   │   └── errorHandler.js           ← Error handling
│   │   │
│   │   ├── 📁 utils/                     ← Utility functions
│   │   │   ├── generateToken.js          ← JWT token generator
│   │   │   └── logger.js                 ← Logging utility
│   │   │
│   │   ├── app.js                        ← Express app configuration
│   │   └── server.js                     ← Server entry point
│   │
│   ├── .env                              ← Environment variables (CONFIGURE THIS)
│   ├── .gitignore                        ← Git ignore file
│   ├── package.json                      ← Dependencies (11 packages)
│   └── README.md                         ← Backend-specific documentation
│
├── 📁 frontend/                          ← Frontend (React + Vite)
│   ├── 📁 src/
│   │   ├── 📁 components/                ← Reusable UI components
│   │   │   ├── BaseComponents.jsx        ← Button, Input, Card, Badge
│   │   │   └── (expandable for future)
│   │   │
│   │   ├── 📁 pages/                     ← Page components (10+ pages)
│   │   │   ├── HomePage.jsx              ← Landing page
│   │   │   ├── LoginPage.jsx             ← Login form
│   │   │   ├── RegisterPage.jsx          ← Registration form
│   │   │   ├── RoomsPage.jsx             ← Room listings
│   │   │   ├── BanquetPage.jsx           ← Banquet halls
│   │   │   ├── RestaurantPage.jsx        ← Restaurant info
│   │   │   ├── DashboardPage.jsx         ← User bookings
│   │   │   ├── AdminPage.jsx             ← Admin panel
│   │   │   └── PlaceholderPages.jsx      ← Gallery, About, Contact, 404
│   │   │
│   │   ├── 📁 layout/                    ← Layout components
│   │   │   ├── Navbar.jsx                ← Navigation bar + Footer
│   │   │   ├── ProtectedRoute.jsx        ← Route guards
│   │   │   └── MainLayout.jsx            ← Main wrapper
│   │   │
│   │   ├── 📁 context/                   ← State management
│   │   │   └── AuthContext.jsx           ← Authentication context
│   │   │
│   │   ├── 📁 api/                       ← API integration
│   │   │   └── api.js                    ← Axios wrapper + endpoints
│   │   │
│   │   ├── 📁 hooks/                     ← Custom React hooks
│   │   │   └── useProtectedRoute.js      ← Route protection hook
│   │   │
│   │   ├── 📁 styles/                    ← Global styling
│   │   │   └── globals.css               ← Tailwind + theme styles
│   │   │
│   │   ├── App.jsx                       ← Main app component + routing
│   │   └── main.jsx                      ← React entry point
│   │
│   ├── 📁 public/                        ← Static assets
│   │
│   ├── index.html                        ← HTML template
│   ├── vite.config.js                    ← Vite configuration
│   ├── tailwind.config.js                ← Tailwind theme config
│   ├── postcss.config.js                 ← PostCSS config
│   ├── .gitignore                        ← Git ignore
│   ├── package.json                      ← Dependencies (10 packages)
│   └── README.md                         ← Frontend-specific documentation
│
└── 📄 DIRECTORY_STRUCTURE.md             ← This file
```

---

## 📊 File Count Summary

| Category | Count | Files |
|----------|-------|-------|
| Models | 9 | `User, RoomType, Room, Booking, BanquetHall, BanquetBooking, RestaurantTable, RestaurantBooking, EmailLog` |
| Controllers | 5 | `auth, room, booking, banquet, restaurant` |
| Routes | 5 | `auth, room, booking, banquet, restaurant` |
| Pages | 10+ | `Home, Login, Register, Rooms, Banquet, Restaurant, Dashboard, Admin, etc.` |
| Components | 4 | `Button, Input, Card, Badge` (expandable) |
| Services | 2 | `email, payment` |
| Middleware | 2 | `auth, errorHandler` |
| Utils | 2 | `generateToken, logger` |
| Config | 2 | `db, env` |
| **Total Code Files** | **50+** | Across both backend and frontend |
| **Documentation** | **7** | README, Setup Guide, API Docs, etc. |

---

## 🗂️ Folder Purpose Guide

### Backend Folders

| Folder | Purpose | Files | What to Edit |
|--------|---------|-------|--------------|
| `config/` | Configuration | 2 | Add configs, update DB connection |
| `models/` | Database schemas | 9 | Add new models, modify fields |
| `controllers/` | API logic | 5 | Add business logic, response handling |
| `routes/` | API endpoints | 5 | Add new routes, map to controllers |
| `services/` | Business services | 2 | Add services like email, payment |
| `middleware/` | Custom middleware | 2 | Add auth, logging, validation |
| `utils/` | Helper functions | 2 | Add utility functions |

### Frontend Folders

| Folder | Purpose | Files | What to Edit |
|--------|---------|-------|--------------|
| `components/` | Reusable UI | 4 | Add new components |
| `pages/` | Page components | 10+ | Add pages, modify existing |
| `layout/` | Layout wrappers | 3 | Modify navbar, footer |
| `context/` | State management | 1 | Expand auth context |
| `api/` | API integration | 1 | Add API endpoints |
| `hooks/` | Custom hooks | 1 | Add custom hooks |
| `styles/` | Global styles | 1 | Modify theme colors |

---

## 🔄 Data Flow

### Registration Flow
```
RegisterPage.jsx
    ↓
authAPI.register() (api.js)
    ↓
POST /api/auth/register (backend)
    ↓
authController.register()
    ↓
User.create() (model)
    ↓
MongoDB (save user)
    ↓
emailService.sendWelcomeEmail()
    ↓
Response with token
    ↓
useAuth().login() (context)
    ↓
localStorage (save token)
    ↓
Navigate to /dashboard
```

### Booking Creation Flow
```
DashboardPage.jsx
    ↓
bookingAPI.createBooking() (api.js)
    ↓
POST /api/bookings (backend + auth middleware)
    ↓
bookingController.createBooking()
    ↓
Booking.create() (model)
    ↓
MongoDB (save booking)
    ↓
Response with booking details
    ↓
Update dashboard state
    ↓
Display booking confirmation
```

---

## 🔐 Protected Resources

### Protected Routes (Frontend)
```
/dashboard              ← ProtectedRoute (auth required)
/admin                  ← AdminRoute (admin only)
All other routes        ← Public
```

### Protected Endpoints (Backend)
```
POST /api/bookings                 ← Auth required
GET /api/bookings/me               ← Auth required
POST /api/banquet/bookings         ← Auth required
POST /api/restaurant/bookings      ← Auth required
```

### Admin-Only Endpoints
```
POST /api/rooms                    ← Admin only
POST /api/rooms/room-types         ← Admin only
POST /api/banquet/halls            ← Admin only
POST /api/restaurant/tables        ← Admin only
```

---

## 📦 Dependency Tree

### Backend Dependencies
```
express (server framework)
mongoose (database ORM)
jsonwebtoken (JWT auth)
bcryptjs (password hashing)
nodemailer (email sending)
dotenv (env config)
cors (cross-origin)
axios (HTTP client)
```

### Frontend Dependencies
```
react (UI framework)
react-dom (DOM rendering)
react-router-dom (routing)
axios (HTTP client)
tailwindcss (styling)
postcss (CSS processing)
autoprefixer (vendor prefixes)
```

---

## 🔧 Configuration Files

### Backend Configuration
- `.env` - Environment variables (MUST CONFIGURE)
- `src/config/env.js` - Loads and exports environment
- `src/config/db.js` - MongoDB connection

### Frontend Configuration
- `vite.config.js` - Vite build configuration
- `tailwind.config.js` - Tailwind theme configuration
- `postcss.config.js` - PostCSS processing

### Both
- `.gitignore` - Git ignore patterns
- `package.json` - Dependencies and scripts

---

## 📝 Important File Locations

### Must Configure First
- `backend/.env` ← **MOST IMPORTANT - Configure before running**

### Entry Points
- Backend: `backend/src/server.js`
- Frontend: `frontend/src/main.jsx`
- Frontend App: `frontend/src/App.jsx`

### Core Files
- Auth Logic: `backend/src/controllers/authController.js`
- Auth Context: `frontend/src/context/AuthContext.jsx`
- Routes: `frontend/src/App.jsx`
- Theme: `frontend/src/styles/globals.css` + `tailwind.config.js`

---

## 🚀 Development Workflow

### When Starting Development
```
1. Run: cd backend && npm run dev
2. Run: cd frontend && npm run dev
3. Open: http://localhost:5173
4. Make changes in your editor
5. See hot reload in browser
6. Check console/terminal for errors
```

### When Adding a Feature

#### Backend
```
1. Create model in src/models/ (if needed)
2. Create/update controller in src/controllers/
3. Create/update routes in src/routes/
4. Add service in src/services/ (if needed)
5. Test with Postman
```

#### Frontend
```
1. Create page in src/pages/ (if new page)
2. Add routes in src/App.jsx
3. Create/use components in src/components/
4. Connect API in src/api/api.js
5. Test in browser
```

---

## 🗄️ Database Collections

After first run, MongoDB will have these collections:

```
maharaja-palace
├── users              ← Stores all user accounts
├── roomtypes          ← Room categories
├── rooms              ← Individual rooms
├── bookings           ← Room reservations
├── banquethalls       ← Event venues
├── banquetbookings    ← Event reservations
├── restauranttables   ← Dining tables
├── restaurantbookings ← Dining reservations
└── emaillogs          ← Email history
```

---

## 📋 Checklist: What's in the Box

### Backend ✅
- [x] Express app setup
- [x] MongoDB connection
- [x] 9 models with validation
- [x] 5 controllers
- [x] 5 route files
- [x] Authentication system
- [x] Error handling
- [x] Email service
- [x] Configuration management

### Frontend ✅
- [x] React app with Vite
- [x] React Router setup
- [x] 10+ pages
- [x] 4 UI components
- [x] Authentication flow
- [x] Context API
- [x] Axios integration
- [x] Tailwind CSS
- [x] Responsive design

### Documentation ✅
- [x] Main README
- [x] Setup guide
- [x] API documentation
- [x] Quick reference
- [x] Milestone summary
- [x] Project delivery summary
- [x] Directory structure (this file)

---

## 🎯 Quick Navigation

### I want to...

**Understand the project**
→ Read: `README.md` → `MILESTONE_1_SUMMARY.md`

**Setup and run locally**
→ Follow: `SETUP_GUIDE.md` (step-by-step)

**See what APIs available**
→ Check: `API_DOCUMENTATION.md`

**Quick reference**
→ Use: `QUICK_REFERENCE.md`

**Understand folder structure**
→ Read: This file `DIRECTORY_STRUCTURE.md`

**Customize the backend**
→ Edit files in: `backend/src/`

**Customize the frontend**
→ Edit files in: `frontend/src/`

**Change the theme colors**
→ Edit: `frontend/tailwind.config.js` + `frontend/src/styles/globals.css`

**Add a new page**
→ Create file in: `frontend/src/pages/` + Add route in `App.jsx`

**Add a new API endpoint**
→ Create in: `backend/src/models/`, `controllers/`, `routes/`

---

## 📞 File Reference Guide

| Task | File Location |
|------|---------------|
| Add database model | `backend/src/models/` |
| Add API logic | `backend/src/controllers/` |
| Add API route | `backend/src/routes/` |
| Add page | `frontend/src/pages/` |
| Add component | `frontend/src/components/` |
| Change colors | `frontend/tailwind.config.js` |
| Change theme | `frontend/src/styles/globals.css` |
| Configure server | `backend/.env` |
| Setup API | `frontend/src/api/api.js` |
| Manage auth state | `frontend/src/context/AuthContext.jsx` |
| Add email logic | `backend/src/services/emailService.js` |
| Logging | `backend/src/utils/logger.js` |

---

## 🎓 Learning Path

1. **Understand Structure** ← Read this file
2. **Setup Locally** ← Follow SETUP_GUIDE.md
3. **Explore Code** ← Browse `backend/src/` and `frontend/src/`
4. **Run Application** ← Follow QUICK_REFERENCE.md
5. **Test APIs** ← Use API_DOCUMENTATION.md
6. **Make Changes** ← Edit files, see hot reload
7. **Deploy** ← Follow deployment in SETUP_GUIDE.md

---

## 🏁 You're All Set!

You have everything needed to:
- ✅ Understand the project structure
- ✅ Run the application locally
- ✅ Make customizations
- ✅ Add new features
- ✅ Deploy to production

**Start with SETUP_GUIDE.md and get running in 10 minutes!**

---

**Last Updated**: November 2024
**Version**: 1.0.0
**Project Status**: Complete and Ready! 🚀
