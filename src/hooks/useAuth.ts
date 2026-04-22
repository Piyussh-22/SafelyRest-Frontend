import { useSelector, useDispatch } from "react-redux";
import { logout, clearAuthError } from "../store/authSlice";
import { clearFavorites } from "../store/favoritesSlice";
import { ROLES } from "../constants/index";
import { RootState, AppDispatch } from "../store/store";

const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, isAuthenticated, loading, error } = useSelector(
    (state: RootState) => state.auth,
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
