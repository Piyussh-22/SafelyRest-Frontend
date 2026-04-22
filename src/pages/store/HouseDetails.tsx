import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Users,
  ArrowLeft,
} from "lucide-react";
import { fetchHouseById, clearSelected } from "../../store/housesSlice";
import AmenitiesBadges from "../../components/house/AmenitiesBadges";
import FavButton from "../../components/FavButton";
import BookingForm from "../../components/booking/BookingForm";
import { PageSpinner } from "../../components/ui/Spinner";
import Button from "../../components/ui/Button";
import { RootState, AppDispatch } from "../../store/store";

const HouseDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const {
    selected: house,
    detailLoading,
    error,
  } = useSelector((s: RootState) => s.houses);
  const { user } = useSelector((s: RootState) => s.auth);

  const [photoIdx, setPhotoIdx] = useState(0);

  useEffect(() => {
    if (id) dispatch(fetchHouseById(id));
    return () => {
      dispatch(clearSelected());
    };
  }, [dispatch, id]);

  if (detailLoading) return <PageSpinner message="Loading house details…" />;

  if (error || !house) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 mb-4">{error ?? "House not found."}</p>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Go back
        </Button>
      </div>
    );
  }

  const {
    name,
    price,
    location,
    description,
    photos,
    amenities,
    capacity,
    isAvailable,
  } = house;
  const hasMultiplePhotos = photos?.length > 1;

  const prevPhoto = () =>
    setPhotoIdx((i) => (i - 1 + photos.length) % photos.length);
  const nextPhoto = () => setPhotoIdx((i) => (i + 1) % photos.length);

  const isGuest = user?.userType === "guest";
  const showBookingForm = !user || isGuest;

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      <div className="max-w-6xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[var(--text)] transition-colors mb-6"
        >
          <ArrowLeft size={15} />
          Back
        </button>

        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text)] leading-tight">
              {name}
            </h1>
            <p className="flex items-center gap-1.5 text-sm text-gray-500 mt-1.5">
              <MapPin size={14} />
              {location}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <FavButton houseId={house._id} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 flex flex-col gap-4">
            <div className="relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 aspect-[4/3]">
              <img
                src={photos?.[photoIdx] ?? "/placeholder.png"}
                alt={`${name} — photo ${photoIdx + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {hasMultiplePhotos && (
                <>
                  <button
                    onClick={prevPhoto}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={nextPhoto}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center"
                    aria-label="Next photo"
                  >
                    <ChevronRight size={18} />
                  </button>
                  <span className="absolute bottom-3 right-3 text-xs bg-black/50 text-white px-2 py-0.5 rounded-full">
                    {photoIdx + 1} / {photos.length}
                  </span>
                </>
              )}
              {!isAvailable && (
                <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                  Unavailable
                </div>
              )}
            </div>

            {hasMultiplePhotos && (
              <div className="flex gap-2">
                {photos.map((url, i) => (
                  <button
                    key={url}
                    onClick={() => setPhotoIdx(i)}
                    className={`flex-1 rounded-xl overflow-hidden border-2 transition-colors ${i === photoIdx ? "border-blue-500" : "border-transparent opacity-60 hover:opacity-100"}`}
                  >
                    <img
                      src={url}
                      alt={`Thumbnail ${i + 1}`}
                      className="w-full h-16 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="flex flex-col gap-5 mt-2">
              <div className="flex items-center gap-6">
                <p className="text-2xl font-bold text-blue-600">
                  ₹{price.toLocaleString()}
                  <span className="text-sm font-normal text-gray-500">
                    /night
                  </span>
                </p>
                <p className="flex items-center gap-1.5 text-sm text-gray-500">
                  <Users size={14} />
                  Up to {capacity} guest{capacity !== 1 ? "s" : ""}
                </p>
              </div>
              <div>
                <h2 className="font-semibold text-[var(--text)] mb-2">
                  About this place
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                  {description}
                </p>
              </div>
              {amenities?.length > 0 && (
                <div>
                  <h2 className="font-semibold text-[var(--text)] mb-2">
                    Amenities
                  </h2>
                  <AmenitiesBadges amenities={amenities} size="md" />
                </div>
              )}
            </div>
          </div>

          {showBookingForm && isAvailable && (
            <div className="lg:col-span-2">
              <div className="sticky top-24">
                <BookingForm
                  houseId={house._id}
                  capacity={capacity}
                  price={price}
                />
              </div>
            </div>
          )}

          {!isAvailable && (
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-5 text-center text-sm text-gray-500">
                This property is currently unavailable for booking.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HouseDetails;
