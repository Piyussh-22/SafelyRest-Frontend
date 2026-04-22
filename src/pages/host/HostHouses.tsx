import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HousePlus, Building2, ChevronRight } from "lucide-react";
import { fetchHostHouses, deleteHouse } from "../../store/housesSlice";
import { PageSpinner } from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import Button from "../../components/ui/Button";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import Badge from "../../components/ui/Badge";
import AmenitiesBadges from "../../components/house/AmenitiesBadges";
import { ROUTES } from "../../constants/index";
import { RootState, AppDispatch } from "../../store/store";
import { House } from "../../types";

interface HostHouseCardProps {
  house: House;
  onDelete: (id: string) => void;
  actionLoading: boolean;
}

const HostHouseCard = ({
  house,
  onDelete,
  actionLoading,
}: HostHouseCardProps) => {
  const [photoIdx, setPhotoIdx] = useState(0);
  const {
    _id,
    name,
    location,
    price,
    photos,
    amenities,
    isAvailable,
    capacity,
  } = house;

  return (
    <article className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-[var(--bg)] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative h-44 bg-gray-100 dark:bg-gray-800">
        <img
          src={photos?.[photoIdx] ?? "/placeholder.png"}
          alt={name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {photos?.length > 1 && (
          <button
            onClick={() => setPhotoIdx((i) => (i + 1) % photos.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center"
            aria-label="Next photo"
          >
            <ChevronRight size={15} />
          </button>
        )}
        <div className="absolute top-2 left-2">
          <Badge variant={isAvailable ? "confirmed" : "cancelled"}>
            {isAvailable ? "Active" : "Unavailable"}
          </Badge>
        </div>
      </div>
      <div className="p-4 flex flex-col gap-3">
        <div>
          <h3 className="font-semibold text-[var(--text)] leading-tight line-clamp-1">
            {name}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">{location}</p>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-blue-600">
            ₹{price.toLocaleString()}
            <span className="text-xs font-normal text-gray-400">/night</span>
          </span>
          <span className="text-xs text-gray-500">Up to {capacity} guests</span>
        </div>
        {amenities?.length > 0 && (
          <AmenitiesBadges amenities={amenities.slice(0, 3)} size="sm" />
        )}
        <div className="flex gap-2 pt-1">
          <Link
            to={`/houses/${_id}`}
            className="flex-1 text-center px-3 py-2 rounded-xl text-xs font-medium border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-blue-400 hover:text-blue-600 transition-colors"
          >
            View listing
          </Link>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(_id)}
            loading={actionLoading}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </div>
    </article>
  );
};

const HostHouses = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { hostList, loading, actionLoading, error } = useSelector(
    (s: RootState) => s.houses,
  );
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchHostHouses());
  }, [dispatch]);

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await dispatch(deleteHouse(deleteId)).unwrap();
    } finally {
      setDeleteId(null);
    }
  };

  if (loading) return <PageSpinner message="Loading your listings…" />;

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text)]">
              My Listings
            </h1>
            {hostList.length > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                {hostList.length} propert{hostList.length !== 1 ? "ies" : "y"}
              </p>
            )}
          </div>
          <Link to={ROUTES.HOST_ADD_HOUSE}>
            <Button size="sm">
              <HousePlus size={15} />
              Add house
            </Button>
          </Link>
        </div>

        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

        {hostList.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="No listings yet"
            description="Add your first property to start accepting bookings."
            action={
              <Link to={ROUTES.HOST_ADD_HOUSE}>
                <Button>
                  <HousePlus size={15} />
                  Add your first house
                </Button>
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {hostList.map((house) => (
              <HostHouseCard
                key={house._id}
                house={house}
                onDelete={(id) => setDeleteId(id)}
                actionLoading={actionLoading && deleteId === house._id}
              />
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        loading={actionLoading}
        title="Delete this listing?"
        description="This will permanently delete the property and all associated favourites. Existing bookings are not affected."
        confirmLabel="Delete"
        confirmVariant="danger"
      />
    </div>
  );
};

export default HostHouses;
