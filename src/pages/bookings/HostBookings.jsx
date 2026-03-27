import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CalendarDays } from "lucide-react";
import {
  fetchHostBookings,
  updateBookingStatus,
} from "../../store/bookingsSlice.js";
import BookingCard from "../../components/booking/BookingCard.jsx";
import { PageSpinner } from "../../components/ui/Spinner.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import ConfirmDialog from "../../components/ui/ConfirmDialog.jsx";
import { BOOKING_STATUS } from "../../constants/index.js";

const STATUS_TABS = [
  { label: "All",       value: "all" },
  { label: "Pending",   value: BOOKING_STATUS.PENDING },
  { label: "Confirmed", value: BOOKING_STATUS.CONFIRMED },
  { label: "Rejected",  value: BOOKING_STATUS.REJECTED },
  { label: "Cancelled", value: BOOKING_STATUS.CANCELLED },
];

const HostBookings = () => {
  const dispatch = useDispatch();
  const { hostBookings, loading, actionLoading, error } = useSelector(
    (s) => s.bookings,
  );

  const [activeTab, setActiveTab] = useState("all");
  // Pending action: { bookingId, action: "confirmed" | "rejected" }
  const [pendingAction, setPendingAction] = useState(null);

  useEffect(() => {
    dispatch(fetchHostBookings());
  }, [dispatch]);

  const filtered =
    activeTab === "all"
      ? hostBookings
      : hostBookings.filter((b) => b.status === activeTab);

  const handleActionConfirm = async () => {
    if (!pendingAction) return;
    const { bookingId, action } = pendingAction;
    try {
      await dispatch(updateBookingStatus({ bookingId, status: action })).unwrap();
    } finally {
      setPendingAction(null);
    }
  };

  if (loading) return <PageSpinner message="Loading bookings…" />;

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--text)]">
            Booking Requests
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage incoming requests for your listings.
          </p>
        </div>

        {error && (
          <p className="text-sm text-red-500 mb-4">{error}</p>
        )}

        {/* Status tabs */}
        <div className="flex gap-1 flex-wrap mb-6 p-1 rounded-xl bg-gray-100 dark:bg-gray-800 w-fit">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === tab.value
                  ? "bg-[var(--bg)] text-[var(--text)] shadow-sm"
                  : "text-gray-500 hover:text-[var(--text)]"
              }`}
            >
              {tab.label}
              {tab.value !== "all" && (
                <span className="ml-1.5 text-[10px] text-gray-400">
                  {hostBookings.filter((b) => b.status === tab.value).length || ""}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Booking list */}
        {filtered.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title={
              activeTab === "all"
                ? "No booking requests yet"
                : `No ${activeTab} bookings`
            }
            description={
              activeTab === "all"
                ? "Requests from guests will appear here."
                : `You don't have any ${activeTab} bookings.`
            }
          />
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                viewAs="host"
                onConfirm={(id) =>
                  setPendingAction({ bookingId: id, action: "confirmed" })
                }
                onReject={(id) =>
                  setPendingAction({ bookingId: id, action: "rejected" })
                }
                actionLoading={
                  actionLoading && pendingAction?.bookingId === booking._id
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Confirm/Reject dialog */}
      <ConfirmDialog
        isOpen={!!pendingAction}
        onClose={() => setPendingAction(null)}
        onConfirm={handleActionConfirm}
        loading={actionLoading}
        title={
          pendingAction?.action === "confirmed"
            ? "Confirm this booking?"
            : "Reject this booking?"
        }
        description={
          pendingAction?.action === "confirmed"
            ? "The guest will be notified. All other overlapping pending requests will be auto-rejected."
            : "The guest will be notified that their request was rejected."
        }
        confirmLabel={
          pendingAction?.action === "confirmed" ? "Confirm" : "Reject"
        }
        confirmVariant={
          pendingAction?.action === "confirmed" ? "primary" : "danger"
        }
      />
    </div>
  );
};

export default HostBookings;
