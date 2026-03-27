import { Link } from "react-router-dom";
import { MapPin, Users } from "lucide-react";
import AmenitiesBadges from "./AmenitiesBadges.jsx";
import FavButton from "../FavButton.jsx";

/**
 * HouseCard
 * Used in HouseList and FavouriteList.
 * @param {object} house - house object from backend
 */
const HouseCard = ({ house }) => {
  if (!house) return null;

  const { _id, name, price, location, photos, amenities, capacity } = house;
  const photo = photos?.[0] ?? "/placeholder.png";

  return (
    <article className="group relative flex flex-col rounded-2xl border border-gray-200 dark:border-gray-700 bg-[var(--bg)] overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Photo */}
      <div className="relative h-52 overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          src={photo}
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Fav button — only renders for authenticated guests (handled inside) */}
        <div className="absolute top-3 right-3">
          <FavButton houseId={_id} />
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Name + price */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-[var(--text)] leading-tight line-clamp-1">
            {name}
          </h3>
          <span className="shrink-0 text-sm font-semibold text-blue-600">
            ₹{(price ?? 0).toLocaleString()}
            <span className="text-xs font-normal text-gray-400">/night</span>
          </span>
        </div>

        {/* Location */}
        <p className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
          <MapPin size={12} className="shrink-0" />
          <span className="line-clamp-1">{location}</span>
        </p>

        {/* Capacity */}
        <p className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
          <Users size={12} className="shrink-0" />
          Up to {capacity} guest{capacity !== 1 ? "s" : ""}
        </p>

        {/* Amenities */}
        {amenities?.length > 0 && (
          <AmenitiesBadges amenities={amenities.slice(0, 4)} size="sm" />
        )}

        {/* CTA */}
        <div className="mt-auto pt-2">
          <Link
            to={`/houses/${_id}`}
            className="block w-full text-center px-4 py-2 rounded-xl text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-150"
          >
            View details
          </Link>
        </div>
      </div>
    </article>
  );
};

export default HouseCard;
