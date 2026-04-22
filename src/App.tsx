import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { ROUTES, ROLES } from "./constants/index";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import Index from "./pages/store/Index";
import HouseList from "./pages/store/HouseList";
import HouseDetails from "./pages/store/HouseDetails";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ErrorPage from "./pages/ErrorPage";

import FavouriteList from "./pages/store/FavouriteList";
import MyBookings from "./pages/bookings/MyBookings";

import HostHouses from "./pages/host/HostHouses";
import AddHouse from "./pages/host/AddHouse";
import HostBookings from "./pages/bookings/HostBookings";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBookings from "./pages/admin/AdminBookings";

import type { RootState } from "./store/store";

interface RoleProps {
  role: string;
  children: React.ReactNode;
}

interface AuthProps {
  children: React.ReactNode;
}

const RequireRole = ({ role, children }: RoleProps) => {
  const { isAuthenticated, user } = useSelector((s: RootState) => s.auth);
  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} replace />;
  if (user?.userType !== role) return <Navigate to={ROUTES.HOME} replace />;
  return children;
};

const RedirectIfAuth = ({ children }: AuthProps) => {
  const { isAuthenticated } = useSelector((s: RootState) => s.auth);
  if (isAuthenticated) return <Navigate to={ROUTES.HOME} replace />;
  return children;
};

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

const App = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route path={ROUTES.HOME} element={<Index />} />
      <Route path={ROUTES.HOUSES} element={<HouseList />} />
      <Route path={ROUTES.HOUSE_DETAILS} element={<HouseDetails />} />

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

      <Route path="*" element={<ErrorPage />} />
    </Route>
  </Routes>
);

export default App;
