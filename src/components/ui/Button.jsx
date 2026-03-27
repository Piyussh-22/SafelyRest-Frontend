import Spinner from "./Spinner.jsx";

const VARIANTS = {
  primary: "bg-blue-600 hover:bg-blue-700 text-white border-transparent",
  secondary:
    "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-[var(--text)] border-gray-300 dark:border-gray-600",
  danger: "bg-red-600 hover:bg-red-700 text-white border-transparent",
  ghost:
    "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-[var(--text)] border-transparent",
};

const SIZES = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-sm",
};

/**
 * Button
 *
 * @param {"primary"|"secondary"|"danger"|"ghost"} variant
 * @param {"sm"|"md"|"lg"} size
 * @param {boolean} loading   - shows spinner, disables click
 * @param {boolean} fullWidth - stretches to container width
 * @param {string}  className - extra Tailwind classes
 */
const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  className = "",
  disabled,
  type = "button",
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-lg border font-medium
        transition-colors duration-150
        focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${VARIANTS[variant] ?? VARIANTS.primary}
        ${SIZES[size] ?? SIZES.md}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
};

export default Button;
