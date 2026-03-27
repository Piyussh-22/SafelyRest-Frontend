import { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHouses } from "../../store/housesSlice.js";
import HouseCard from "../../components/house/HouseCard.jsx";
import HouseFilters from "../../components/house/HouseFilters.jsx";
import { PageSpinner } from "../../components/ui/Spinner.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import Button from "../../components/ui/Button.jsx";
import { Home } from "lucide-react";

const HouseList = () => {
  const dispatch = useDispatch();
  const { list, pagination, loading, error } = useSelector((s) => s.houses);
  const [activeFilters, setActiveFilters] = useState({});

  // Fetch on mount with default params
  useEffect(() => {
    dispatch(fetchHouses({ page: 1, limit: 12 }));
  }, [dispatch]);

  const handleFilter = useCallback(
    (filters) => {
      const params = {
        page: 1,
        limit: 12,
        ...(filters.location && { location: filters.location }),
        ...(filters.minPrice && { minPrice: filters.minPrice }),
        ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
        ...(filters.amenities?.length && {
          amenities: filters.amenities.join(","),
        }),
      };

      setActiveFilters(params);
      dispatch(fetchHouses(params));
    },
    [dispatch],
  );

  const handlePageChange = (page) => {
    dispatch(fetchHouses({ ...activeFilters, page, limit: 12 }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page heading */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--text)]">
            Find your stay
          </h1>
          {pagination && !loading && (
            <p className="text-sm text-gray-500 mt-1">
              {pagination.total} propert{pagination.total !== 1 ? "ies" : "y"}{" "}
              available
            </p>
          )}
        </div>

        {/* Filters */}
        <div className="mb-8">
          <HouseFilters onFilter={handleFilter} loading={loading} />
        </div>

        {/* Results */}
        {loading ? (
          <PageSpinner message="Finding houses…" />
        ) : list.length === 0 ? (
          <EmptyState
            icon={Home}
            title="No houses found"
            description="Try adjusting your filters or search in a different location."
            action={
              <Button variant="secondary" onClick={() => handleFilter({})}>
                Clear filters
              </Button>
            }
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {list.map((house) => (
                <HouseCard key={house._id} house={house} />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={pagination.page <= 1 || loading}
                  onClick={() => handlePageChange(pagination.page - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-500 px-2">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={pagination.page >= pagination.totalPages || loading}
                  onClick={() => handlePageChange(pagination.page + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HouseList;
