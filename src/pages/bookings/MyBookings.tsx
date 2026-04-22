import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CalendarDays } from "lucide-react";
import { fetchMyBookings, cancelBooking } from "../../store/bookingsSlice";
import BookingCard from "../../components/booking/BookingCard";
import { PageSpinner } from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import Button from "../../components/ui/Button";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { useNavigate } from "react-router-dom";
import { ROUTES, BOOKING_STATUS } from "../../constants/index";
import { RootState, AppDispatch } from "../../store/store";

const STATUS_TABS = [
  { label: "All", value: "all" },
  { label: "Pending", value: BOOKING_STATUS.PENDING },
  { label: "Confirmed", value: BOOKING_STATUS.CONFIRMED },
  { label: "Cancelled", value: BOOKING_STATUS.CANCELLED },
  { label: "Rejected", value: BOOKING_STATUS.REJECTED },
];

const MyBookings = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { myBookings, loading, actionLoading, error } = useSelector(
    (s: RootState) => s.bookings,
  );

  const [activeTab, setActiveTab] = useState("all");
  const [cancelId, setCancelId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchMyBookings());
  }, [dispatch]);

  const filtered =
    activeTab === "all"
      ? myBookings
      : myBookings.filter((b) => b.status === activeTab);

  const handleCancelConfirm = async () => {
    if (!cancelId) return;
    try {
      await dispatch(cancelBooking(cancelId)).unwrap();
    } finally {
      setCancelId(null);
    }
  };

  if (loading) return <PageSpinner message="Loading your bookings…" />;

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--text)]">My Bookings</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track and manage your stay requests.
          </p>
        </div>

        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

        <div className="flex gap-1 flex-wrap mb-6 p-1 rounded-xl bg-gray-100 dark:bg-gray-800 w-fit">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeTab === tab.value ? "bg-[var(--bg)] text-[var(--text)] shadow-sm" : "text-gray-500 hover:text-[var(--text)]"}`}
            >
              {tab.label}
              {tab.value !== "all" && (
                <span className="ml-1.5 text-[10px] text-gray-400">
                  {myBookings.filter((b) => b.status === tab.value).length ||
                    ""}
                </span>
              )}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title={
              activeTab === "all"
                ? "No bookings yet"
                : `No ${activeTab} bookings`
            }
            description={
              activeTab === "all"
                ? "Browse available houses and make your first booking."
                : `You don't have any ${activeTab} bookings.`
            }
            action={
              activeTab === "all" && (
                <Button onClick={() => navigate(ROUTES.HOUSES)}>
                  Browse houses
                </Button>
              )
            }
          />
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                viewAs="guest"
                onCancel={(id) => setCancelId(id)}
                actionLoading={actionLoading && cancelId === booking._id}
              />
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!cancelId}
        onClose={() => setCancelId(null)}
        onConfirm={handleCancelConfirm}
        loading={actionLoading}
        title="Cancel booking?"
        description="This will cancel your pending booking request. This cannot be undone."
        confirmLabel="Yes, cancel"
        confirmVariant="danger"
      />
    </div>
  );
};

export default MyBookings;
