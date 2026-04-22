import { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
  rows?: number;
}

const Textarea = ({
  label,
  error,
  className = "",
  containerClassName = "",
  rows = 4,
  ...props
}: TextareaProps) => (
  <div className={`flex flex-col gap-1 ${containerClassName}`}>
    {label && (
      <label className="text-sm font-medium text-[var(--text)] opacity-80">
        {label}
      </label>
    )}
    <textarea
      rows={rows}
      className={`w-full px-4 py-2.5 rounded-lg border text-sm resize-none bg-[var(--bg)] text-[var(--text)] border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${error ? "border-red-500 focus:ring-red-500" : ""} ${className}`}
      {...props}
    />
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

export default Textarea;
