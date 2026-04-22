import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Home,
  Heart,
  LogOut,
  HousePlus,
  LayoutDashboard,
  Menu,
  X,
  User,
  CalendarDays,
  ChevronDown,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { useSelector } from "react-redux";
import ThemeToggle from "./ThemeToggle";
import ConfirmDialog from "../ui/ConfirmDialog";
import { ROUTES, ROLES } from "../../constants/index";
import { RootState } from "../../store/store";
import { LucideIcon } from "lucide-react";

interface NavLink {
  to: string;
  label: string;
  icon: LucideIcon;
  roles: string[] | null;
}

const NAV_LINKS: NavLink[] = [
  { to: ROUTES.HOUSES, label: "Houses", icon: Home, roles: null },
  {
    to: ROUTES.FAVORITES,
    label: "Favorites",
    icon: Heart,
    roles: [ROLES.GUEST],
  },
  {
    to: ROUTES.MY_BOOKINGS,
    label: "My Bookings",
    icon: CalendarDays,
    roles: [ROLES.GUEST],
  },
  {
    to: ROUTES.HOST_HOUSES,
    label: "My Listings",
    icon: LayoutDashboard,
    roles: [ROLES.HOST],
  },
  {
    to: ROUTES.HOST_ADD_HOUSE,
    label: "Add House",
    icon: HousePlus,
    roles: [ROLES.HOST],
  },
  {
    to: ROUTES.HOST_BOOKINGS,
    label: "Bookings",
    icon: CalendarDays,
    roles: [ROLES.HOST],
  },
  {
    to: ROUTES.ADMIN_DASHBOARD,
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: [ROLES.ADMIN],
  },
  {
    to: ROUTES.ADMIN_BOOKINGS,
    label: "All Bookings",
    icon: CalendarDays,
    roles: [ROLES.ADMIN],
  },
];

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const favorites = useSelector((s: RootState) => s.favorites.items);
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const filteredLinks = NAV_LINKS.filter(
    (l) => !l.roles || (user && l.roles.includes(user.userType)),
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      )
        setDropdownOpen(false);
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogoutConfirm = () => {
    logout();
    setShowLogoutConfirm(false);
    setDropdownOpen(false);
    navigate(ROUTES.HOME);
  };

  const favCount = user?.userType === ROLES.GUEST ? favorites.length : 0;

  return (
    <>
      <nav className="sticky top-0 z-40 px-6 py-3 flex justify-between items-center border-b bg-[var(--bg)] text-[var(--text)] shadow-sm">
        <Link
          to={ROUTES.HOME}
          className="text-2xl font-bold text-blue-600 tracking-tight"
        >
          Safely Rest
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {filteredLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Icon size={16} />
              {label}
              {label === "Favorites" && favCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 text-[10px] font-bold bg-red-500 text-white rounded-full flex items-center justify-center">
                  {favCount}
                </span>
              )}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          {!isAuthenticated ? (
            <Link
              to={ROUTES.LOGIN}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              <User size={16} />
              Log in
            </Link>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((p) => !p)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                  {user?.firstName?.[0]?.toUpperCase()}
                </div>
                <span className="max-w-[120px] truncate">
                  {user?.firstName}
                </span>
                <ChevronDown size={14} />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-1 w-44 rounded-xl border border-gray-200 dark:border-gray-700 bg-[var(--bg)] shadow-lg py-1 z-50">
                  <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700">
                    <p className="text-xs text-gray-500 truncate">
                      {user?.email}
                    </p>
                    <p className="text-xs font-medium capitalize text-blue-600">
                      {user?.userType}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut size={14} />
                    Log out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="md:hidden flex items-center gap-2" ref={menuRef}>
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen((p) => !p)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      <div
        className="md:hidden overflow-hidden transition-all duration-300 bg-[var(--bg)] border-b border-gray-200 dark:border-gray-700"
        style={{ maxHeight: menuOpen ? "600px" : "0px" }}
      >
        <div className="px-4 py-3 flex flex-col gap-1">
          {isAuthenticated && (
            <div className="flex items-center gap-3 px-3 py-3 mb-1 border-b border-gray-100 dark:border-gray-700">
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                {user?.firstName?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-sm">{user?.firstName}</p>
                <p className="text-xs text-gray-500 capitalize">
                  {user?.userType}
                </p>
              </div>
            </div>
          )}

          {filteredLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className="relative flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Icon size={16} />
              {label}
              {label === "Favorites" && favCount > 0 && (
                <span className="ml-auto w-5 h-5 text-[10px] font-bold bg-red-500 text-white rounded-full flex items-center justify-center">
                  {favCount}
                </span>
              )}
            </Link>
          ))}

          {!isAuthenticated ? (
            <Link
              to={ROUTES.LOGIN}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium bg-blue-600 text-white mt-1"
            >
              <User size={16} />
              Log in
            </Link>
          ) : (
            <button
              onClick={() => {
                setMenuOpen(false);
                setShowLogoutConfirm(true);
              }}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors mt-1"
            >
              <LogOut size={16} />
              Log out
            </button>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogoutConfirm}
        title="Log out?"
        description="You will be returned to the home page."
        confirmLabel="Log out"
        confirmVariant="danger"
      />
    </>
  );
};

export default Navbar;
