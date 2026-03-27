import { useSelector, useDispatch } from "react-redux";
import { logout, clearAuthError } from "../store/authSlice.js";
import { clearFavorites } from "../store/favoritesSlice.js";
import { ROLES } from "../constants/index.js";

const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, loading, error } = useSelector(
    (state) => state.auth,
  );

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearFavorites());
  };

  const isGuest = user?.userType === ROLES.GUEST;
  const isHost = user?.userType === ROLES.HOST;
  const isAdmin = user?.userType === ROLES.ADMIN;

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    isGuest,
    isHost,
    isAdmin,
    logout: handleLogout,
    clearError: () => dispatch(clearAuthError()),
  };
};

export default useAuth;
