import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Index from "./pages/store/Index";
import HouseList from "./pages/store/HouseList";
import HouseDetails from "./pages/store/HouseDetails";
import FavouriteList from "./pages/store/FavouriteList";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ErrorPage from "./pages/ErrorPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AddHouse from "./pages/host/AddHouse";
import HostHouses from "./pages/host/HostHouses";

const Layout = () => (
  <div
    className="flex flex-col min-h-screen transition-colors duration-300"
    style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
  >
    <Navbar />
    <main className="flex-1 p-2">
      <Outlet />
    </main>
    <Footer />
  </div>
);

const App = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const favoriteHouses = useSelector((state) => state.favorites.items);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Index />} />
        <Route path="/houses" element={<HouseList />} />
        <Route path="/houses/:id" element={<HouseDetails />} />
        <Route
          path="/favorites"
          element={<FavouriteList favouriteHouses={favoriteHouses} />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/host/houses"
          element={
            isAuthenticated && user?.userType === "host" ? (
              <HostHouses />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/host/addHouse"
          element={
            isAuthenticated && user?.userType === "host" ? (
              <AddHouse />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            isAuthenticated && user?.userType === "admin" ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="*" element={<ErrorPage />} />
      </Route>
    </Routes>
  );
};

export default App;
