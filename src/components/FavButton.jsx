import { useSelector, useDispatch } from "react-redux";
import { Heart } from "lucide-react";
import { toggleFavorite } from "../store/favoritesSlice.js";
import useAuth from "../hooks/useAuth.js";

const FavButton = ({ houseId, className = "" }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, isGuest } = useAuth();
  const { items, loading } = useSelector((s) => s.favorites);

  const isFav = items.some((h) => String(h._id) === String(houseId));

  // Only guests can favourite
  if (!isAuthenticated || !isGuest) return null;

  const handleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (loading) return;
    dispatch(toggleFavorite(houseId));
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
      className={`
        w-10 h-10 rounded-full flex items-center justify-center
        shadow transition-transform hover:scale-110
        disabled:opacity-50 disabled:cursor-not-allowed
        ${
          isFav
            ? "bg-red-500 text-white"
            : "bg-white dark:bg-gray-900 text-gray-400 hover:text-red-400"
        }
        ${className}
      `}
    >
      <Heart size={18} fill={isFav ? "currentColor" : "none"} />
    </button>
  );
};

export default FavButton;
