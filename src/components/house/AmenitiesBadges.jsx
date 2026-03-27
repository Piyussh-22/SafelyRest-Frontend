import { Wifi, Car, Wind, Flame, UtensilsCrossed, Tv, Waves, Dumbbell } from "lucide-react";

const AMENITY_CONFIG = {
  wifi:    { label: "WiFi",    Icon: Wifi },
  parking: { label: "Parking", Icon: Car },
  ac:      { label: "AC",      Icon: Wind },
  heating: { label: "Heating", Icon: Flame },
  kitchen: { label: "Kitchen", Icon: UtensilsCrossed },
  tv:      { label: "TV",      Icon: Tv },
  pool:    { label: "Pool",    Icon: Waves },
  gym:     { label: "Gym",     Icon: Dumbbell },
};

/**
 * AmenitiesBadges
 * @param {string[]} amenities  - array of amenity keys from backend
 * @param {"sm"|"md"} size      - controls icon/text sizing
 */
const AmenitiesBadges = ({ amenities = [], size = "md" }) => {
  if (!amenities.length) return null;

  const isSmall = size === "sm";

  return (
    <div className="flex flex-wrap gap-1.5">
      {amenities.map((key) => {
        const config = AMENITY_CONFIG[key];
        if (!config) return null;
        const { label, Icon } = config;

        return (
          <span
            key={key}
            className={`
              inline-flex items-center gap-1 rounded-full border font-medium
              bg-gray-50 dark:bg-gray-800
              border-gray-200 dark:border-gray-700
              text-gray-600 dark:text-gray-300
              ${isSmall ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs"}
            `}
          >
            <Icon size={isSmall ? 10 : 12} />
            {label}
          </span>
        );
      })}
    </div>
  );
};

export default AmenitiesBadges;
