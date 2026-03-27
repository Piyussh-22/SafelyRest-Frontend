import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Heart } from "lucide-react";
import { fetchFavorites } from "../../store/favoritesSlice.js";
import HouseCard from "../../components/house/HouseCard.jsx";
import { PageSpinner } from "../../components/ui/Spinner.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import Button from "../../components/ui/Button.jsx";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/index.js";

const FavouriteList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading, error } = useSelector((s) => s.favorites);

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  if (loading) return <PageSpinner message="Loading favourites…" />;

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--text)]">
            My Favourites
          </h1>
          {items.length > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              {items.length} saved propert{items.length !== 1 ? "ies" : "y"}
            </p>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-500 mb-6">{error}</p>
        )}

        {items.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="No favourites yet"
            description="Browse houses and tap the heart icon to save them here."
            action={
              <Button onClick={() => navigate(ROUTES.HOUSES)}>
                Browse houses
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((house) => (
              <HouseCard key={house._id} house={house} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavouriteList;
