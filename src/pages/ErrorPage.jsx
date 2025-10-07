/**
 * 🛠️ To-Do (Later):
 * - Optionally log errors for analytics
 * - Show different messages for 403/500 errors (if needed)
 */

import { Link, useLocation } from "react-router-dom";

export default function ErrorPage() {
  const location = useLocation();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-gray-50">
      <h1 className="text-6xl font-bold text-amber-600">404</h1>
      <p className="text-xl text-gray-800 mt-2">Page Not Found</p>
      <p className="text-gray-600 mt-1">
        You tried to access:{" "}
        <span className="font-semibold">{location.pathname}</span>
      </p>
      <Link
        to="/"
        className="mt-6 inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition"
      >
        Go Back Home
      </Link>
    </main>
  );
}
