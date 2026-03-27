import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { AMENITIES } from "../../constants/index.js";
import Button from "../ui/Button.jsx";

const DEFAULT_FILTERS = {
  location: "",
  minPrice: "",
  maxPrice: "",
  amenities: [],
};

/**
 * HouseFilters
 *
 * Emits filters to parent via onFilter(filters).
 * Matches backend GET /store/houses query params:
 *   location, minPrice, maxPrice, amenities (array → comma-separated by parent)
 */
const HouseFilters = ({ onFilter, loading = false }) => {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [expanded, setExpanded] = useState(false);

  const hasActiveFilters =
    filters.location ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.amenities.length > 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const toggleAmenity = (value) => {
    setFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(value)
        ? prev.amenities.filter((a) => a !== value)
        : [...prev.amenities, value],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    onFilter(DEFAULT_FILTERS);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-[var(--bg)] shadow-sm p-4"
    >
      {/* ── Top row: location search + expand toggle ─────────────────────── */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            name="location"
            value={filters.location}
            onChange={handleChange}
            placeholder="Search by location…"
            className="
              w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm
              bg-[var(--bg)] text-[var(--text)]
              border-gray-300 dark:border-gray-600
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              placeholder:text-gray-400 dark:placeholder:text-gray-500
              transition-colors
            "
          />
        </div>

        <button
          type="button"
          onClick={() => setExpanded((p) => !p)}
          className={`
            flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-medium transition-colors
            ${
              expanded || hasActiveFilters
                ? "bg-blue-600 text-white border-blue-600"
                : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-blue-400"
            }
          `}
        >
          <SlidersHorizontal size={15} />
          Filters
          {hasActiveFilters && (
            <span className="ml-0.5 w-4 h-4 text-[10px] font-bold bg-white text-blue-600 rounded-full flex items-center justify-center">
              {(filters.amenities.length > 0 ? 1 : 0) +
                (filters.minPrice || filters.maxPrice ? 1 : 0)}
            </span>
          )}
        </button>
      </div>

      {/* ── Expandable section ───────────────────────────────────────────── */}
      {expanded && (
        <div className="mt-4 flex flex-col gap-4 border-t border-gray-100 dark:border-gray-700 pt-4">
          {/* Price range */}
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
              Price per night (₹)
            </p>
            <div className="flex items-center gap-2">
              <input
                name="minPrice"
                type="number"
                value={filters.minPrice}
                onChange={handleChange}
                placeholder="Min (400)"
                min="400"
                max="1000"
                className="
                  flex-1 px-3 py-2 rounded-xl border text-sm
                  bg-[var(--bg)] text-[var(--text)]
                  border-gray-300 dark:border-gray-600
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                  placeholder:text-gray-400 dark:placeholder:text-gray-500
                "
              />
              <span className="text-gray-400 text-sm">–</span>
              <input
                name="maxPrice"
                type="number"
                value={filters.maxPrice}
                onChange={handleChange}
                placeholder="Max (1000)"
                min="400"
                max="1000"
                className="
                  flex-1 px-3 py-2 rounded-xl border text-sm
                  bg-[var(--bg)] text-[var(--text)]
                  border-gray-300 dark:border-gray-600
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                  placeholder:text-gray-400 dark:placeholder:text-gray-500
                "
              />
            </div>
          </div>

          {/* Amenities */}
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
              Amenities
            </p>
            <div className="flex flex-wrap gap-2">
              {AMENITIES.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => toggleAmenity(value)}
                  className={`
                    px-3 py-1.5 rounded-full text-xs font-medium border transition-colors
                    ${
                      filters.amenities.includes(value)
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-blue-400"
                    }
                  `}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Action row ───────────────────────────────────────────────────── */}
      <div className="flex gap-2 mt-4">
        <Button type="submit" loading={loading} className="flex-1">
          Search
        </Button>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-sm text-gray-500 hover:text-red-500 hover:border-red-400 transition-colors"
          >
            <X size={14} />
            Clear
          </button>
        )}
      </div>
    </form>
  );
};

export default HouseFilters;
