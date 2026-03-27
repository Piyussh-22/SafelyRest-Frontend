import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "../constants/index.js";

const ErrorPage = () => {
  const { pathname } = useLocation();

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center text-center px-4"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      <p className="text-8xl font-bold text-blue-600 leading-none">404</p>
      <h1 className="text-2xl font-semibold mt-4">Page not found</h1>
      <p className="text-gray-500 mt-2 text-sm">
        <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">
          {pathname}
        </code>{" "}
        doesn&apos;t exist.
      </p>
      <Link
        to={ROUTES.HOME}
        className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
      >
        Go home
      </Link>
    </main>
  );
};

export default ErrorPage;
