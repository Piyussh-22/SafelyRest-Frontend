import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FavButton from "../../components/FavButton";
import { useSelector } from "react-redux";

const StoreHouseCard = ({ house }) => {
  const [imgIndex, setImgIndex] = useState(0);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  if (!house) return null;

  const { _id, name, price, location, photos = [] } = house;

  const handleNextImage = (e) => {
    e.stopPropagation();
    if (photos.length > 0) {
      setImgIndex((prev) => (prev + 1) % photos.length);
    }
  };

  const openDetails = () => {
    navigate(`/houses/${_id}`);
  };

  // Only guests/users can see the favorite button
  const canFavorite =
    user && (user.userType === "guest" || user.userType === "user");

  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 transition hover:shadow-lg hover:scale-[1.01] cursor-pointer">
      {/* Image Section */}
      <div className="relative h-56 w-full">
        {photos.length > 0 ? (
          <img
            src={photos[imgIndex]}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}

        {/* Right Arrow */}
        {photos.length > 1 && (
          <button
            onClick={handleNextImage}
            className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition"
          >
            <ChevronRight size={18} />
          </button>
        )}

        {/* Favorite - only for authenticated guests/users */}
        {canFavorite && (
          <div className="absolute top-3 right-3">
            <FavButton houseId={_id} className="p-3" />
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-sm text-gray-500">{location}</p>

        <div className="flex items-center justify-between mb-3">
          <span className="text-blue-600 font-bold text-base">
            ₹{price}/night
          </span>
        </div>

        <button
          onClick={openDetails}
          className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default StoreHouseCard;
