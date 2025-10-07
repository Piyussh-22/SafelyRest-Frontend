import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHouses } from "../../redux/housesSlice";
import StoreHouseCard from "./StoreHouseCard";

const HouseList = () => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.houses);

  useEffect(() => {
    dispatch(fetchHouses());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-lg font-medium">Loading houses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-red-500">Failed to load houses: {error}</p>
      </div>
    );
  }

  if (!list || list.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-gray-500">No houses available right now.</p>
      </div>
    );
  }

  return (
    <main
      className="min-h-screen px-4 py-8 transition-colors duration-300"
      style={{
        backgroundColor: "var(--bg)",
        color: "var(--text)",
      }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.map((house) => (
          <StoreHouseCard key={house._id} house={house} />
        ))}
      </div>
    </main>
  );
};

export default HouseList;
