import { Calendar, Users, MapPin, Mail, User } from "lucide-react";
import { StatusBadge } from "../ui/Badge";
import Button from "../ui/Button";
import { BOOKING_STATUS } from "../../constants/index";
import { Booking, PopulatedHouse, PopulatedGuest } from "../../types";

interface BookingCardProps {
  booking: Booking;
  viewAs?: "guest" | "host" | "admin";
  onCancel?: (id: string) => void;
  onConfirm?: (id: string) => void;
  onReject?: (id: string) => void;
  actionLoading?: boolean;
}

const BookingCard = ({
  booking,
  viewAs = "guest",
  onCancel,
  onConfirm,
  onReject,
  actionLoading = false,
}: BookingCardProps) => {
  if (!booking) return null;

  const {
    _id,
    house,
    guest,
    checkIn,
    checkOut,
    guests,
    totalPrice,
    status,
    message,
    hostContact,
  } = booking;

  const populatedHouse =
    typeof house === "object" ? (house as PopulatedHouse) : null;
  const populatedGuest =
    typeof guest === "object" ? (guest as PopulatedGuest) : null;

  const fmt = (date: Date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const nights =
    Math.round(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
        (1000 * 60 * 60 * 24),
    ) || 0;

  const isPending = status === BOOKING_STATUS.PENDING;
  const isConfirmed = status === BOOKING_STATUS.CONFIRMED;

  return (
    <article className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-[var(--bg)] p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[var(--text)] truncate">
            {populatedHouse?.name ?? "House unavailable"}
          </h3>
          {populatedHouse?.location && (
            <p className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              <MapPin size={11} />
              {populatedHouse.location}
            </p>
          )}
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
            Check-in
          </span>
          <span className="flex items-center gap-1.5 font-medium text-[var(--text)]">
            <Calendar size={13} className="text-blue-500 shrink-0" />
            {fmt(checkIn)}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
            Check-out
          </span>
          <span className="flex items-center gap-1.5 font-medium text-[var(--text)]">
            <Calendar size={13} className="text-blue-500 shrink-0" />
            {fmt(checkOut)}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
            Guests
          </span>
          <span className="flex items-center gap-1.5 font-medium text-[var(--text)]">
            <Users size={13} className="text-blue-500 shrink-0" />
            {guests} guest{guests !== 1 ? "s" : ""} · {nights} night
            {nights !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
            Total
          </span>
          <span className="font-semibold text-blue-600">
            ₹{(totalPrice ?? 0).toLocaleString()}
          </span>
        </div>
      </div>

      {message && (
        <p className="text-xs text-gray-500 dark:text-gray-400 italic border-l-2 border-gray-200 dark:border-gray-700 pl-3">
          "{message}"
        </p>
      )}

      {viewAs === "guest" && isConfirmed && hostContact && (
        <div className="rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3 flex flex-col gap-1">
          <p className="text-xs font-semibold text-green-700 dark:text-green-400">
            Host contact
          </p>
          <p className="flex items-center gap-1.5 text-xs text-green-800 dark:text-green-300">
            <User size={11} />
            {hostContact.firstName}
          </p>
          <p className="flex items-center gap-1.5 text-xs text-green-800 dark:text-green-300">
            <Mail size={11} />
            {hostContact.email}
          </p>
        </div>
      )}

      {viewAs === "host" && populatedGuest && (
        <div className="rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 p-3 flex flex-col gap-1">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
            Guest
          </p>
          <p className="flex items-center gap-1.5 text-xs text-[var(--text)]">
            <User size={11} />
            {populatedGuest.firstName}
          </p>
          <p className="flex items-center gap-1.5 text-xs text-[var(--text)]">
            <Mail size={11} />
            {populatedGuest.email}
          </p>
        </div>
      )}

      {viewAs === "guest" && isPending && onCancel && (
        <Button
          variant="danger"
          size="sm"
          onClick={() => onCancel(_id)}
          loading={actionLoading}
          className="self-end"
        >
          Cancel booking
        </Button>
      )}

      {viewAs === "host" && isPending && (
        <div className="flex gap-2 self-end">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onReject?.(_id)}
            loading={actionLoading}
          >
            Reject
          </Button>
          <Button
            size="sm"
            onClick={() => onConfirm?.(_id)}
            loading={actionLoading}
          >
            Confirm
          </Button>
        </div>
      )}
    </article>
  );
};

export default BookingCard;
