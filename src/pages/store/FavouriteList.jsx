import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchFavorites } from "../../redux/favoritesSlice";
import StoreHouseCard from "./StoreHouseCard";

const FavouriteList = () => {
  const dispatch = useDispatch();
  const {
    items: favouriteHouses,
    loading,
    error,
  } = useSelector((state) => state.favorites);

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  if (loading) return <p>Loading favourites...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-700">
        My Favourite Houses
      </h1>

      {favouriteHouses.length === 0 ? (
        <p className="text-center text-gray-400">No favourites yet!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {favouriteHouses.map((house) => (
            <StoreHouseCard key={house._id} house={house} />
          ))}
        </div>
      )}
    </main>
  );
};

export default FavouriteList;
