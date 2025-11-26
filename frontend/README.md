# Maharaja Palace - Frontend

This is the React + Vite frontend for the 7-star Maharaja Palace Hotel Booking System.

## Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/             # Page components
│   ├── layout/            # Layout components (Navbar, Footer)
│   ├── context/           # React Context (Auth)
│   ├── api/               # API integration (Axios)
│   ├── hooks/             # Custom React hooks
│   ├── styles/            # Global CSS & Tailwind
│   ├── App.jsx           # Main app component
│   └── main.jsx          # Entry point
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind CSS config
├── postcss.config.js      # PostCSS config
└── package.json           # Dependencies
```

## Features Implemented (Milestone 1)

✅ User Authentication (Login/Register)
✅ Context API for state management
✅ Protected Routes (Guest & Admin)
✅ Luxury UI Theme (Cream + Gold)
✅ Responsive Design
✅ Base UI Components (Button, Input, Card, Badge)
✅ Navigation & Routing
✅ Dashboard (Bookings Overview)
✅ Admin Dashboard Skeleton
✅ Tailwind CSS Integration

## Pages Included

- **Public Pages**: Home, Rooms, Banquet, Restaurant, Gallery, About, Contact
- **Auth Pages**: Login, Register
- **Protected Pages**: Dashboard, Admin Panel
- **Placeholder**: 404 Not Found

## Theme Colors

- **Cream**: `#FFF8E7` (Primary background)
- **Gold**: `#D4AF37` (Accent & headings)
- **Dark Gold**: `#AA8C2C` (Hover states)
- **Dark Background**: `#1a1a1a` (Footer)

## Fonts

- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)
- **Alternative**: Lato (sans-serif)

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

3. **Build for Production**
   ```bash
   npm run build
   ```

4. **Preview Production Build**
   ```bash
   npm run preview
   ```

## API Integration

The frontend uses Axios for API calls with automatic JWT token injection. Configure the API base URL in `src/api/api.js`

### Default API URLs

```
http://localhost:5000/api
```

The proxy in `vite.config.js` forwards `/api` requests to the backend.

## Testing the App

1. Navigate to `http://localhost:5173`
2. Register a new account
3. Login with your credentials
4. View dashboard and bookings
5. Admin users can access `/admin`

## Component Documentation

### BaseComponents.jsx
- `Button` - Customizable button with variants (primary, filled, secondary)
- `Input` - Form input with validation error display
- `Card` - Reusable card container with hover effect
- `Badge` - Status badges with multiple variants

### Layout Components
- `Navbar` - Navigation bar with auth state
- `Footer` - Footer with links and info
- `MainLayout` - Main page wrapper
- `ProtectedRoute` - Route guard for authenticated users
- `AdminRoute` - Route guard for admin users

## Authentication Flow

1. User registers/logs in
2. JWT token is saved to localStorage
3. Token is automatically added to all API requests
4. Invalid tokens automatically trigger logout
5. User context is available via `useAuth()` hook

## Styling

All styles are built with **Tailwind CSS** with a custom luxury theme. Global styles are in `src/styles/globals.css`

Global component classes:
- `.luxury-button` - Primary button style
- `.luxury-button-filled` - Filled button style
- `.input-luxury` - Form input style
- `.section-divider` - Horizontal divider
- `.section-title` - Section heading

## Next Steps (Phase 2)

- Full admin dashboard with CRUD operations
- Room availability calendar
- Advanced booking form with date picker
- Payment gateway integration UI
- Reviews and ratings system
- Guest profile management
- Notification system
- Email confirmation UI

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

Happy Coding! 🚀
