import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const HostHouseCard = ({ house, onDelete, loading }) => {
  const [imgIndex, setImgIndex] = useState(0);

  if (!house) return null;

  const nextImage = () => {
    if (!house.photos || house.photos.length === 0) return;
    setImgIndex((prev) => (prev + 1) % house.photos.length);
  };

  return (
    <div className="relative border rounded-xl p-4 shadow hover:shadow-lg transition bg-white dark:bg-gray-900">
      {/* Image container */}
      <div className="relative w-full h-48">
        <img
          src={house.photos?.[imgIndex] || "/placeholder.png"}
          alt={house.name}
          className="w-full h-full object-cover rounded-lg"
        />
        {house.photos?.length > 1 && (
          <button
            onClick={nextImage}
            className="absolute top-1/2 right-2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full"
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>

      <h3 className="text-lg font-semibold mt-3">{house.name}</h3>
      <p className="text-gray-500 dark:text-gray-300">{house.location}</p>
      <p className="text-gray-500 dark:text-gray-300">{house.description}</p>
      <p className="font-medium">₹{house.price}/night</p>

      {/* Buttons */}
      <div className="flex flex-col gap-2 mt-3">
        {/* View Details */}
        <Link
          to={`/houses/${house._id}`}
          className="w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          View Details
        </Link>

        {/* Delete */}
        <button
          onClick={() => onDelete(house._id)}
          disabled={loading}
          className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Processing..." : "Delete"}
        </button>
      </div>
    </div>
  );
};

export default HostHouseCard;
