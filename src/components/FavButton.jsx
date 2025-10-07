import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { toggleFavorite } from "../redux/favoritesSlice";

const FavButton = ({ houseId, className = "" }) => {
  const dispatch = useDispatch();
  const { items: favorites = [], loading } = useSelector(
    (state) => state.favorites
  );

  // Local state to toggle instantly
  const [isFav, setIsFav] = useState(false);

  // Sync local state with Redux on mount & whenever favorites change
  useEffect(() => {
    setIsFav(favorites.some((house) => String(house._id) === String(houseId)));
  }, [favorites, houseId]);

  const handleClick = (e) => {
    e.stopPropagation();
    if (!loading) {
      setIsFav((prev) => !prev); // toggle instantly
      dispatch(toggleFavorite(houseId));
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`rounded-full shadow hover:scale-110 transition disabled:opacity-50 ${
        isFav
          ? "bg-red-500 text-white p-3" // favorited
          : "bg-white dark:bg-gray-900 text-gray-500 p-3" // not favorited
      } ${className}`}
    >
      <Heart size={20} />
    </button>
  );
};

export default FavButton;
