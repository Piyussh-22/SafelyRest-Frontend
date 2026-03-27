# Safely Rest – Frontend

A modern, responsive frontend application for a property booking platform, built using React, Redux Toolkit, and Tailwind CSS. This application enables users to browse listings, manage bookings, and interact with role-based dashboards.

---

## Overview

Safely Rest is designed to provide a seamless user experience for three primary roles:

- Guests – browse houses, manage bookings, and save favorites
- Hosts – manage listings and handle booking requests
- Admins – oversee platform activity and bookings

The application implements secure routing, role-based access control, and a scalable component architecture.

---

## Tech Stack

- React (with functional components and hooks)
- Redux Toolkit (state management)
- React Router (routing and navigation)
- Tailwind CSS (UI styling)
- Lucide React (icons)
- Google Identity Services (authentication)

---

## Features

### Authentication & Authorization

- Email/password login and signup
- Google OAuth login integration
- Role-based route protection (Guest, Host, Admin)
- Automatic redirect handling for authenticated users

### Routing System

- Centralized route constants
- Protected routes using custom guards:
  - RequireAuth
  - RequireRole
  - RedirectIfAuth

### Guest Features

- Browse house listings
- View detailed house information
- Add/remove favorites
- Create booking requests
- View booking history

### Host Features

- Manage property listings
- Add new houses
- View and manage booking requests
- Accept or reject bookings

### Admin Features

- Admin dashboard overview
- Manage all bookings across the platform

### Booking System

- Date-based availability checking
- Booking request workflow
- Price calculation preview
- Status tracking (Pending, Confirmed, Rejected, Cancelled)

### UI/UX

- Fully responsive design
- Dark/Light theme toggle
- Reusable UI components (Button, Badge, Cards)
- Clean and modular layout structure

---

## Project Structure

```
src/
│
├── components/
│   ├── layout/
│   ├── ui/
│   ├── booking/
│   ├── house/
│
├── pages/
│   ├── store/
│   ├── auth/
│   ├── bookings/
│   ├── host/
│   ├── admin/
│
├── store/
├── hooks/
├── services/
├── constants/
│
├── App.jsx
├── main.jsx
└── index.css
```

---

## Key Architecture Highlights

### Role-Based Access Control

Routes are protected using reusable guard components:

- RequireAuth ensures authentication
- RequireRole restricts access based on user type
- RedirectIfAuth prevents access to auth pages when logged in

### State Management

Redux Toolkit is used for:

- Authentication state
- Favorites management
- Booking operations

### Component Design

- Highly reusable and modular components
- Clear separation between UI and business logic
- Consistent styling using Tailwind utility classes

---

## Environment Variables

Create a `.env` file in the root directory and add:

```
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## Installation

```bash
git clone <repository-url>
cd frontend
npm install
```

---

## Running the Application

```bash
npm run dev
```

The application will be available at:

```
http://localhost:5173
```

---

## Build for Production

```bash
npm run build
```

---

## Notes

- Date handling is normalized to avoid timezone issues
- Booking flow enforces availability checks before submission
- Favorites are restricted to guest users only
- UI components are designed for scalability and reuse

---

## Future Improvements

- Pagination and infinite scrolling for listings
- Enhanced search and filtering capabilities
- Real-time notifications for booking updates
- Performance optimizations and lazy loading

---

## Author

Piyush Raj
Full Stack Developer

---

## License

This project is licensed under the MIT License.
