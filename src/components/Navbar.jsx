import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import LogoutConfirm from "./LogoutConfirm";
import ThemeToggle from "./ThemeToggle";
import { logout } from "../redux/authSlice";
import {
  User,
  Menu,
  X,
  Home,
  Heart,
  LogOut,
  HousePlus,
  Database,
  ShieldUser,
} from "lucide-react";

const Navbar = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const favorites = useSelector((state) => state.favorites.items || []);

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    dispatch(logout());
    setShowLogoutModal(false);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { to: "/houses", label: "Houses", icon: <Home size={20} /> },
    {
      to: "/favorites",
      label: "Favorites",
      roles: ["guest", "user"],
      icon: <Heart size={20} />,
    },
    {
      to: "/host/houses",
      label: "My Listings",
      roles: ["host"],
      icon: <Database size={20} />,
    },
    {
      to: "/host/addHouse",
      label: "Add New",
      roles: ["host"],
      icon: <HousePlus size={20} />,
    },
    {
      to: "/admin/dashboard",
      label: "Dashboard",
      roles: ["admin"],
      icon: <ShieldUser size={20} />,
    },
  ];

  const filteredLinks = navLinks.filter(
    (link) => !link.roles || (user && link.roles.includes(user.userType))
  );

  return (
    <>
      <nav className="px-6 py-2 flex justify-between items-center shadow border-b bg-[var(--bg)] text-[var(--text)]">
        <Link to="/" className="text-3xl font-bold text-blue-600">
          Safely Rest
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-4">
          {filteredLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="relative hover:text-red-400 transition-colors flex items-center gap-1"
            >
              {link.icon || null}
              <span>{link.label}</span>

              {link.label === "Favorites" &&
                favorites.length > 0 &&
                user?.userType === "guest" && (
                  <span className="absolute -top-2 -right-3 text-xs w-4 h-4 flex items-center justify-center rounded-full bg-red-500 text-white pointer-events-none font-bold">
                    {favorites.length}
                  </span>
                )}
            </Link>
          ))}

          {!isAuthenticated ? (
            <Link
              to="/login"
              className="hover:text-red-400 transition-colors flex items-center gap-1"
            >
              <User />
              Log In
            </Link>
          ) : (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="font-bold hover:text-red-400 transition-colors flex items-center gap-1"
              >
                <User />
                {user?.name}
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-[var(--bg)] border shadow rounded">
                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className="w-full text-left px-4 py-2 hover:bg-red-500"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          <ThemeToggle />
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="focus:outline-none transition-transform duration-200 active:scale-90"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`md:hidden px-6  border-b flex flex-col gap-3 bg-[var(--bg)] overflow-hidden transition-all duration-500 ease-in-out `}
        style={{
          maxHeight: menuOpen ? "500px" : "0px",
          padding: menuOpen ? "8px 24px" : "0px",
        }}
      >
        {isAuthenticated && (
          <div className="flex items-center gap-2 py-1 px-2 rounded font-bold">
            <User />
            <span>Welcome {user?.name}</span>
          </div>
        )}

        {filteredLinks.map((link) => {
          if (
            link.label === "Favorites" &&
            (!user || user.userType !== "guest")
          )
            return null;

          return (
            <Link
              key={link.to}
              to={link.to}
              className="relative hover:text-red-400 transition-colors flex items-center gap-2 px-2 py-1"
              onClick={() => setMenuOpen(false)}
            >
              {link.icon || null}
              <span>{link.label}</span>

              {link.label === "Favorites" &&
                favorites.length > 0 &&
                user?.userType === "guest" && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold bg-red-500 text-white rounded-full pointer-events-none">
                    {favorites.length}
                  </span>
                )}
            </Link>
          );
        })}

        {!isAuthenticated ? (
          <Link
            to="/login"
            className="hover:text-red-400 transition-colors flex items-center gap-1 px-2 py-1"
            onClick={() => setMenuOpen(false)}
          >
            <User />
            Log In
          </Link>
        ) : (
          <button
            onClick={() => {
              setShowLogoutModal(true);
              setMenuOpen(false);
            }}
            className="text-left hover:text-red-500 transition-colors px-2 py-1 flex items-center gap-1"
          >
            <LogOut />
            Logout
          </button>
        )}
      </div>

      {/* Logout Modal */}
      <LogoutConfirm
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </>
  );
};

export default Navbar;
