import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { fetchAllBookings } from "../../store/bookingsSlice";
import { PageSpinner } from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import Button from "../../components/ui/Button";
import { StatusBadge } from "../../components/ui/Badge";
import { BOOKING_STATUS } from "../../constants/index";
import { RootState, AppDispatch } from "../../store/store";
import { Booking, PopulatedHouse, PopulatedGuest } from "../../types";

const STATUS_OPTIONS = [
  { label: "All", value: "" },
  { label: "Pending", value: BOOKING_STATUS.PENDING },
  { label: "Confirmed", value: BOOKING_STATUS.CONFIRMED },
  { label: "Rejected", value: BOOKING_STATUS.REJECTED },
  { label: "Cancelled", value: BOOKING_STATUS.CANCELLED },
];

const fmt = (date: Date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const AdminBookings = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { adminBookings, adminPagination, loading, error } = useSelector(
    (s: RootState) => s.bookings,
  );

  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const LIMIT = 15;

  const load = useCallback(
    (p = 1, status = statusFilter) => {
      const params: Record<string, unknown> = {
        page: p,
        limit: LIMIT,
        ...(status && { status }),
      };
      dispatch(fetchAllBookings(params));
    },
    [dispatch, statusFilter],
  );

  useEffect(() => {
    load(1);
  }, [statusFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    load(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStatusChange = (val: string) => {
    setStatusFilter(val);
    setPage(1);
  };

  if (loading && !adminBookings.length)
    return <PageSpinner message="Loading bookings…" />;

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--text)]">
            All Bookings
          </h1>
          {adminPagination && (
            <p className="text-sm text-gray-500 mt-1">
              {adminPagination.total} total booking
              {adminPagination.total !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        <div className="flex gap-1 flex-wrap mb-6 p-1 rounded-xl bg-gray-100 dark:bg-gray-800 w-fit">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleStatusChange(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${statusFilter === opt.value ? "bg-[var(--bg)] text-[var(--text)] shadow-sm" : "text-gray-500 hover:text-[var(--text)]"}`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

        {adminBookings.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="No bookings found"
            description={
              statusFilter
                ? `No ${statusFilter} bookings found.`
                : "No bookings on the platform yet."
            }
          />
        ) : (
          <>
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-[var(--bg)] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                      {[
                        "Guest",
                        "House",
                        "Dates",
                        "Guests",
                        "Total",
                        "Status",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {adminBookings.map((b: Booking) => {
                      const populatedGuest =
                        typeof b.guest === "object"
                          ? (b.guest as PopulatedGuest)
                          : null;
                      const populatedHouse =
                        typeof b.house === "object"
                          ? (b.house as PopulatedHouse)
                          : null;
                      return (
                        <tr
                          key={b._id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                        >
                          <td className="px-4 py-3">
                            <p className="font-medium text-[var(--text)]">
                              {populatedGuest?.firstName ?? "—"}
                            </p>
                            <p className="text-xs text-gray-400">
                              {populatedGuest?.email ?? ""}
                            </p>
                          </td>
                          <td className="px-4 py-3">
                            <p className="font-medium text-[var(--text)] line-clamp-1">
                              {populatedHouse?.name ?? "—"}
                            </p>
                            {populatedHouse?.location && (
                              <p className="flex items-center gap-0.5 text-xs text-gray-400">
                                <MapPin size={10} />
                                {populatedHouse.location}
                              </p>
                            )}
                          </td>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                            <p className="flex items-center gap-1 text-xs">
                              <CalendarDays size={11} />
                              {fmt(b.checkIn)}
                            </p>
                            <p className="text-xs text-gray-400 pl-4">
                              → {fmt(b.checkOut)}
                            </p>
                          </td>
                          <td className="px-4 py-3">
                            <span className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                              <Users size={11} />
                              {b.guests}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-semibold text-blue-600">
                            ₹{b.totalPrice?.toLocaleString()}
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={b.status} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {adminPagination && adminPagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page <= 1 || loading}
                  onClick={() => handlePageChange(page - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-500 px-2">
                  Page {page} of {adminPagination.totalPages}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page >= adminPagination.totalPages || loading}
                  onClick={() => handlePageChange(page + 1)}
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

export default AdminBookings;
