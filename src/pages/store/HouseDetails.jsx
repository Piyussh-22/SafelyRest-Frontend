import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchHouseById, clearSelected } from "../../redux/housesSlice";
import FavButton from "../../components/FavButton";
import { Home, Heart, Database } from "lucide-react";

const HouseDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const {
    selected: house,
    loading,
    error,
  } = useSelector((state) => state.houses);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchHouseById(id));
    return () => dispatch(clearSelected());
  }, [dispatch, id]);

  if (loading) return <p className="p-6">Loading house details...</p>;
  if (error) return <p className="p-6 text-red-500">Error: {error}</p>;
  if (!house) return <p className="p-6">House not found.</p>;

  const isHost = user?.userType === "host";
  // ---------------- CHANGE HERE ----------------
  // Only authenticated guests/users can favorite
  const canFavorite =
    user && (user.userType === "guest" || user.userType === "user");
  // --------------------------------------------

  return (
    <main
      className="min-h-[70vh] p-4 md:p-6 mx-auto max-w-6xl"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-2 md:gap-0">
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
          {house.name}
        </h1>

        {/* Favorite button only for authenticated guests/users */}
        {canFavorite && <FavButton houseId={house._id} />}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Photos */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {house.photos.map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt={`${house.name} - Photo ${idx + 1}`}
              className="w-full h-56 sm:h-64 lg:h-72 xl:h-80 object-cover rounded-lg border hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ))}
        </div>

        {/* Details */}
        <div className="flex-1 flex flex-col gap-4 max-w-lg lg:max-w-md">
          <div className="p-4 rounded-lg shadow-md bg-[var(--bg)]">
            <p className="text-lg font-semibold mb-2">
              Price: ₹{house.price.toLocaleString()}
            </p>
            <p className="flex items-center gap-1 mb-2">
              Location: {house.location}
            </p>
            <p>{house.description}</p>
          </div>

          {/* Role-based Links */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Link
              to="/houses"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-center transition flex justify-center gap-2"
            >
              <Home size={22} />
              Houses
            </Link>

            {isHost && (
              <Link
                to="/host/houses"
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-center transition flex justify-center gap-2"
              >
                <Database size={22} />
                My Listings
              </Link>
            )}

            {/* Favorites only for authenticated guests/users */}
            {canFavorite && (
              <Link
                to="/favorites"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-center transition flex justify-center gap-2"
              >
                <Heart size={22} />
                Favorites
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default HouseDetails;
