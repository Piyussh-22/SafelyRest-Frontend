import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHostHouses, deleteHouse } from "../../redux/housesSlice";
import HostHouseCard from "./HostHouseCard";

const HostHouses = () => {
  const dispatch = useDispatch();
  const { hostList, loading, error } = useSelector((state) => state.houses);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchHostHouses());
    }
  }, [dispatch, user]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this house?")) return;

    try {
      await dispatch(deleteHouse(id)).unwrap();
      alert("House deleted successfully!");
    } catch (err) {
      alert("Failed to delete house: " + err);
    }
  };

  return (
    <div
      className="min-h-[70vh] p-6"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      <h2 className="text-2xl font-bold mb-4">My Houses</h2>

      {loading && <p>Loading your houses...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && !error && hostList.length === 0 && (
        <p>You haven’t added any houses yet.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {hostList.map((house) => (
          <HostHouseCard
            key={house._id}
            house={house}
            onDelete={handleDelete}
            loading={loading}
          />
        ))}
      </div>
    </div>
  );
};

export default HostHouses;
