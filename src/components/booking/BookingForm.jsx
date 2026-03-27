import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Calendar, Users, MessageSquare } from "lucide-react";
import { createBooking } from "../../store/bookingsSlice.js";
import { checkAvailability } from "../../services/housesService.js";
import Button from "../ui/Button.jsx";
import { ROUTES } from "../../constants/index.js";

/** Returns today's date string in YYYY-MM-DD (local) */
const toDateInput = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const today = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const addDays = (date, n) => {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
};

// ─────────────────────────────────────────────────────────────────────────────

const BookingForm = ({ houseId, capacity, price }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((s) => s.auth);
  const { actionLoading } = useSelector((s) => s.bookings);

  const [form, setForm] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
    message: "",
  });
  const [availability, setAvailability] = useState(null);
  const [availMsg, setAvailMsg] = useState("");
  const [checkingAvail, setCheckingAvail] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const todayStr = toDateInput(today());
  const maxCheckIn = toDateInput(addDays(today(), 30));

  // FIX: normalize to midnight (avoid timezone mismatch)
  const toMidnight = (d) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  };

  const nights =
    form.checkIn && form.checkOut
      ? Math.round(
          (toMidnight(form.checkOut) - toMidnight(form.checkIn)) /
            (1000 * 60 * 60 * 24),
        )
      : 0;

  const totalPreview = nights > 0 ? nights * price : null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "checkIn" && updated.checkOut && updated.checkOut <= value) {
        updated.checkOut = "";
      }
      return updated;
    });

    if (name === "checkIn" || name === "checkOut") {
      setAvailability(null);
      setAvailMsg("");
    }

    setError("");
  };

  const handleCheckAvailability = async () => {
    if (!form.checkIn || !form.checkOut) {
      return setError("Please select both check-in and check-out dates.");
    }
    setCheckingAvail(true);
    setAvailability(null);
    setError("");

    try {
      const res = await checkAvailability(houseId, form.checkIn, form.checkOut);
      const avail = res?.data?.available;
      setAvailability(avail);
      setAvailMsg(
        avail ? "" : (res?.data?.reason ?? "Not available for these dates."),
      );
    } catch (err) {
      setError(err.message ?? "Could not check availability.");
    } finally {
      setCheckingAvail(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return navigate(ROUTES.LOGIN);
    if (availability !== true)
      return setError("Please check availability first.");
    if (form.guests < 1 || form.guests > capacity) {
      return setError(`Guest count must be between 1 and ${capacity}.`);
    }

    setError("");
    try {
      await dispatch(
        createBooking({
          houseId,
          checkIn: form.checkIn, // FIX: removed toISOString
          checkOut: form.checkOut, // FIX
          guests: Number(form.guests),
          message: form.message.trim() || undefined,
        }),
      ).unwrap();

      setSuccess(true);
      setForm({ checkIn: "", checkOut: "", guests: 1, message: "" });
      setAvailability(null);
    } catch (err) {
      setError(err ?? "Booking failed. Please try again.");
    }
  };

  if (user?.userType === "host") return null;

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-[var(--bg)] p-5 flex flex-col gap-4 shadow-sm">
      {" "}
      <h2 className="font-semibold text-[var(--text)]">Book this stay</h2>
      {success ? (
        <div className="rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 text-sm text-green-700 dark:text-green-400">
          <p className="font-semibold">Booking request sent!</p>
          <p className="mt-1 text-xs">
            The host will confirm or reject your request. Check{" "}
            <button
              onClick={() => navigate(ROUTES.MY_BOOKINGS)}
              className="underline font-medium"
            >
              My Bookings
            </button>{" "}
            for updates.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {error && (
            <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Calendar size={11} /> Check-in
              </label>
              <input
                type="date"
                name="checkIn"
                value={form.checkIn}
                onChange={handleChange}
                min={todayStr}
                max={maxCheckIn}
                required
                className="px-3 py-2 rounded-xl border text-sm bg-[var(--bg)] text-[var(--text)] border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Calendar size={11} /> Check-out
              </label>
              <input
                type="date"
                name="checkOut"
                value={form.checkOut}
                onChange={handleChange}
                min={
                  form.checkIn
                    ? toDateInput(addDays(new Date(form.checkIn), 1))
                    : todayStr
                }
                max={
                  form.checkIn
                    ? toDateInput(addDays(new Date(form.checkIn), 10))
                    : ""
                }
                required
                disabled={!form.checkIn}
                className="px-3 py-2 rounded-xl border text-sm bg-[var(--bg)] text-[var(--text)] border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Users size={11} /> Guests
            </label>
            <input
              type="number"
              name="guests"
              value={form.guests}
              onChange={handleChange}
              min={1}
              max={capacity}
              required
              className="px-3 py-2 rounded-xl border text-sm bg-[var(--bg)] text-[var(--text)] border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-[11px] text-gray-400">Max {capacity} guests</p>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <MessageSquare size={11} /> Message{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Anything the host should know…"
              maxLength={500}
              rows={2}
              className="px-3 py-2 rounded-xl border text-sm resize-none bg-[var(--bg)] text-[var(--text)] border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {totalPreview && (
            <div className="rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 px-4 py-3 flex justify-between text-sm">
              <span className="text-gray-500">
                ₹{price.toLocaleString()} × {nights} night
                {nights !== 1 ? "s" : ""}
              </span>
              <span className="font-semibold text-[var(--text)]">
                ₹{totalPreview.toLocaleString()}
              </span>
            </div>
          )}

          {availability === true && (
            <p className="text-xs text-green-600">✓ Available</p>
          )}

          {availability === false && (
            <p className="text-xs text-red-500">{availMsg}</p>
          )}

          {availability !== true ? (
            <Button
              type="button"
              variant="secondary"
              onClick={handleCheckAvailability}
              loading={checkingAvail}
              disabled={!form.checkIn || !form.checkOut}
              fullWidth
            >
              Check availability
            </Button>
          ) : (
            <Button
              type="submit"
              loading={actionLoading}
              disabled={!isAuthenticated}
              fullWidth
            >
              {isAuthenticated ? "Request booking" : "Log in to book"}
            </Button>
          )}
        </form>
      )}
    </div>
  );
};

export default BookingForm;
