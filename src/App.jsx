import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { ROUTES, ROLES } from "./constants/index.js";

// Layout
import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";

// Public pages
import Index from "./pages/store/Index.jsx";
import HouseList from "./pages/store/HouseList.jsx";
import HouseDetails from "./pages/store/HouseDetails.jsx";
import Login from "./pages/auth/Login.jsx";
import Signup from "./pages/auth/Signup.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";

// Guest pages
import FavouriteList from "./pages/store/FavouriteList.jsx";
import MyBookings from "./pages/bookings/MyBookings.jsx";

// Host pages
import HostHouses from "./pages/host/HostHouses.jsx";
import AddHouse from "./pages/host/AddHouse.jsx";
import HostBookings from "./pages/bookings/HostBookings.jsx";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminBookings from "./pages/admin/AdminBookings.jsx";

// ─── Route Guards ─────────────────────────────────────────────────────────────

/**
 * Protects any route that requires authentication.
 * Redirects to /login if not authenticated.
 */
const RequireAuth = ({ children }) => {
  const { isAuthenticated } = useSelector((s) => s.auth);
  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} replace />;
  return children;
};

/**
 * Protects role-specific routes.
 * Redirects to /login if not authenticated or wrong role.
 */
const RequireRole = ({ role, children }) => {
  const { isAuthenticated, user } = useSelector((s) => s.auth);
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (user?.userType !== role) {
    return <Navigate to={ROUTES.HOME} replace />;
  }
  return children;
};

/**
 * Redirects authenticated users away from login/signup.
 */
const RedirectIfAuth = ({ children }) => {
  const { isAuthenticated } = useSelector((s) => s.auth);
  if (isAuthenticated) return <Navigate to={ROUTES.HOME} replace />;
  return children;
};

// ─── Layout ───────────────────────────────────────────────────────────────────

const Layout = () => (
  <div
    className="flex flex-col min-h-screen"
    style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
  >
    <Navbar />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);

// ─── App ──────────────────────────────────────────────────────────────────────

const App = () => (
  <Routes>
    <Route element={<Layout />}>
      {/* ── Public ──────────────────────────────────────────────────────── */}
      <Route path={ROUTES.HOME} element={<Index />} />
      <Route path={ROUTES.HOUSES} element={<HouseList />} />
      <Route path={ROUTES.HOUSE_DETAILS} element={<HouseDetails />} />

      {/* ── Auth (redirect away if already logged in) ────────────────────── */}
      <Route
        path={ROUTES.LOGIN}
        element={
          <RedirectIfAuth>
            <Login />
          </RedirectIfAuth>
        }
      />
      <Route
        path={ROUTES.SIGNUP}
        element={
          <RedirectIfAuth>
            <Signup />
          </RedirectIfAuth>
        }
      />

      {/* ── Guest only ──────────────────────────────────────────────────── */}
      <Route
        path={ROUTES.FAVORITES}
        element={
          <RequireRole role={ROLES.GUEST}>
            <FavouriteList />
          </RequireRole>
        }
      />
      <Route
        path={ROUTES.MY_BOOKINGS}
        element={
          <RequireRole role={ROLES.GUEST}>
            <MyBookings />
          </RequireRole>
        }
      />

      {/* ── Host only ───────────────────────────────────────────────────── */}
      <Route
        path={ROUTES.HOST_HOUSES}
        element={
          <RequireRole role={ROLES.HOST}>
            <HostHouses />
          </RequireRole>
        }
      />
      <Route
        path={ROUTES.HOST_ADD_HOUSE}
        element={
          <RequireRole role={ROLES.HOST}>
            <AddHouse />
          </RequireRole>
        }
      />
      <Route
        path={ROUTES.HOST_BOOKINGS}
        element={
          <RequireRole role={ROLES.HOST}>
            <HostBookings />
          </RequireRole>
        }
      />

      {/* ── Admin only ──────────────────────────────────────────────────── */}
      <Route
        path={ROUTES.ADMIN_DASHBOARD}
        element={
          <RequireRole role={ROLES.ADMIN}>
            <AdminDashboard />
          </RequireRole>
        }
      />
      <Route
        path={ROUTES.ADMIN_BOOKINGS}
        element={
          <RequireRole role={ROLES.ADMIN}>
            <AdminBookings />
          </RequireRole>
        }
      />

      {/* ── 404 ─────────────────────────────────────────────────────────── */}
      <Route path="*" element={<ErrorPage />} />
    </Route>
  </Routes>
);

export default App;
