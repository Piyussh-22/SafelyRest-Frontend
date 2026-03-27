const SIZES = {
  sm: "w-4 h-4 border-2",
  md: "w-8 h-8 border-2",
  lg: "w-12 h-12 border-3",
};

const Spinner = ({ size = "md", className = "" }) => (
  <div
    className={`
      rounded-full border-blue-500 border-t-transparent animate-spin
      ${SIZES[size]} ${className}
    `}
  />
);

export const PageSpinner = ({ message = "Loading..." }) => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
    <Spinner size="lg" />
    <p className="text-sm text-gray-500">{message}</p>
  </div>
);

export default Spinner;
