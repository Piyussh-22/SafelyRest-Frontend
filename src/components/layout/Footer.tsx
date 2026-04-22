import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/index";

const Footer = () => (
  <footer className="w-full border-t bg-[var(--bg)] text-[var(--text)]">
    <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-500">
      <span>
        © {new Date().getFullYear()}{" "}
        <Link to={ROUTES.HOME} className="font-semibold text-blue-600">
          Safely Rest
        </Link>
        . All rights reserved.
      </span>
      <span>Built by Piyush Raj</span>
    </div>
  </footer>
);

export default Footer;
