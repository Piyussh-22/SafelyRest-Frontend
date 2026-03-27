import { BOOKING_STATUS } from "../../constants/index.js";

const VARIANTS = {
  pending:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  confirmed:
    "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  cancelled: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  host: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  guest: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  admin:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
  info: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
};

const Badge = ({ children, variant = "info", className = "" }) => {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
        ${VARIANTS[variant] ?? VARIANTS.info}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

// Convenience export for booking statuses
export const StatusBadge = ({ status }) => {
  const labels = {
    [BOOKING_STATUS.PENDING]: "Pending",
    [BOOKING_STATUS.CONFIRMED]: "Confirmed",
    [BOOKING_STATUS.REJECTED]: "Rejected",
    [BOOKING_STATUS.CANCELLED]: "Cancelled",
  };
  return <Badge variant={status}>{labels[status] ?? status}</Badge>;
};

export default Badge;
