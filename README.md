# SafelyRest — Frontend

[![CI/CD](https://github.com/Piyussh-22/SafelyRest-Frontend/actions/workflows/deploy.yml/badge.svg)](https://github.com/Piyussh-22/SafelyRest-Frontend/actions/workflows/deploy.yml)

A modern, fully responsive property booking platform built with React, TypeScript, Redux Toolkit, and Tailwind CSS. Supports three user roles — guest, host, and admin — each with dedicated dashboards and workflows.

**Live App:** [https://safely-rest-frontend.vercel.app](https://safely-rest-frontend.vercel.app)
**Backend Repo:** [https://github.com/Piyussh-22/SafelyRest-Backend](https://github.com/Piyussh-22/SafelyRest-Backend)

---

## Tech Stack

| Layer            | Technology                   |
| ---------------- | ---------------------------- |
| Language         | TypeScript                   |
| Framework        | React 19                     |
| State Management | Redux Toolkit                |
| Routing          | React Router v7              |
| Styling          | Tailwind CSS v4              |
| HTTP Client      | Axios                        |
| Icons            | Lucide React                 |
| Auth             | Google Identity Services     |
| Testing          | Jest + React Testing Library |
| Build Tool       | Vite                         |
| CI/CD            | GitHub Actions → Vercel      |

---

## CI/CD Pipeline

Every push to `main` triggers the following pipeline:

```
Install dependencies → Run 24 tests → Vercel build → Deploy to Vercel
```

If any step fails, deployment is blocked. All secrets are managed via GitHub Actions Secrets. Vercel Git integration is disabled — deployments are triggered exclusively from GitHub Actions.

---

## Testing

```bash
npm test
```

**24 tests across 7 suites:**

| Suite          | Coverage                                                                 |
| -------------- | ------------------------------------------------------------------------ |
| authSlice      | initial state, logout, clearAuthError                                    |
| housesSlice    | initial state, clearSelected, clearHousesError                           |
| bookingsSlice  | initial state, clearBookingError                                         |
| favoritesSlice | initial state, clearFavorites, clearFavoritesError                       |
| ErrorPage      | 404 text, page not found message, go home link, pathname display         |
| Login          | form fields, sign in button, signup link, error on failed login          |
| Signup         | form fields, password mismatch error, short password error, sign in link |

---

## Project Structure

```
src/
├── components/
│   ├── layout/         # Navbar, Footer, layout wrappers
│   ├── ui/             # Button, Badge, Input, Spinner, Modal etc.
│   ├── booking/        # BookingCard, BookingForm
│   └── house/          # HouseCard, HouseFilters, AmenitiesBadges
├── pages/
│   ├── auth/           # Login, Signup
│   ├── store/          # HouseList, HouseDetails, FavouriteList
│   ├── bookings/       # MyBookings, HostBookings
│   ├── host/           # HostHouses, AddHouse
│   └── admin/          # AdminDashboard, AdminBookings
├── store/
│   ├── authSlice.ts
│   ├── housesSlice.ts
│   ├── bookingsSlice.ts
│   ├── favoritesSlice.ts
│   ├── adminSlice.ts
│   └── store.ts
├── services/
│   ├── api.ts          # Axios instance with interceptors
│   ├── authService.ts
│   ├── housesService.ts
│   ├── bookingsService.ts
│   ├── favoritesService.ts
│   └── adminService.ts
├── hooks/              # Custom React hooks
├── constants/          # Routes, booking status, amenities
├── App.tsx
├── main.tsx
└── index.css
```

---

## Features

### Authentication

- Email and password login and signup
- Google OAuth integration
- JWT token stored in localStorage
- Axios request interceptor attaches token automatically
- Role-based route protection using `RequireAuth`, `RequireRole`, and `RedirectIfAuth` guard components

### Guest

- Browse and filter house listings by location, price, and amenities
- View detailed house information with photo gallery
- Check date availability before booking
- Create booking requests with date picker and guest count
- View and cancel own bookings
- Save and remove favourites

### Host

- View own property listings
- Add new listings with photo upload and Cloudinary storage
- View all incoming booking requests
- Confirm or reject pending bookings
- Auto-rejection of overlapping bookings on confirmation

### Admin

- Platform overview dashboard with stats
- View all bookings across the platform with status filtering and pagination
- Delete any property platform-wide

### UI/UX

- Fully responsive — mobile, tablet, and desktop
- Dark and light theme toggle
- Reusable component library (Button, Badge, Input, Textarea, Spinner, EmptyState, ConfirmDialog)
- Loading states and error handling throughout

---

## Architecture Highlights

### State Management

Redux Toolkit manages all async operations via `createAsyncThunk`. Each slice has separate loading flags (`loading`, `actionLoading`, `detailLoading`) to prevent UI flickering between independent operations.

### API Layer

A single Axios instance in `services/api.ts` handles:

- Base URL from environment variable
- Authorization header injection via request interceptor
- Consistent error message extraction via response interceptor

### Route Protection

Three guard components handle routing logic:

- `RequireAuth` — redirects to login if not authenticated
- `RequireRole` — redirects if user does not have the required role
- `RedirectIfAuth` — redirects authenticated users away from login and signup pages

---

## Environment Variables

```env
VITE_API_URL=http://localhost:4000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## Running Locally

```bash
# Clone the repo
git clone https://github.com/Piyussh-22/SafelyRest-Frontend.git
cd SafelyRest-Frontend

# Install dependencies
npm install

# Add environment variables
cp .env.example .env

# Start development server
npm run dev
```

App will be available at `http://localhost:5173`

---

## Test Credentials

| Role  | Email                           | Password        |
| ----- | ------------------------------- | --------------- |
| Admin | admin@gmail.com                 | admin@gmail.com |
| Guest | Create via signup               | —               |
| Host  | Create via signup (select Host) | —               |

---

## Author

**Piyush Raj** — Full Stack Developer
[GitHub](https://github.com/Piyussh-22) · [LinkedIn](https://linkedin.com/in/piyush-raj-tech)

---

## License

MIT
