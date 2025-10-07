import ProfileCard from "../../components/ProfileCard";
import { Instagram, Linkedin, Twitter, Mail, Info } from "lucide-react";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

const Index = () => {
  return (
    <main
      className="min-h-[80vh] px-4 transition-colors duration-300"
      style={{
        backgroundColor: "var(--bg)",
        color: "var(--text)",
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 py-16">
        {/* Left Column: Text + CTA */}
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-4xl sm:text-6xl font-extrabold mb-4 tracking-tight">
            Welcome to <span className="text-blue-600">Safely Rest</span>
          </h1>

          <p className="text-lg sm:text-xl max-w-xl mb-6 opacity-80">
            Find your perfect stay or become a host and share your space with
            travelers across the world.
          </p>

          <div className="flex justify-center lg:justify-start gap-4 mb-8">
            <a
              href="/houses"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition transform hover:scale-105"
            >
              Explore Houses
            </a>
          </div>
        </div>

        {/* Right Column: Profile + Social Links */}
        <div className="flex-1 flex flex-col items-center lg:items-end gap-6">
          {/* Profile Card */}
          <ProfileCard />

          {/* Social Links + Admin Info */}
          <div className="flex items-center gap-6 mt-4">
            {/* Social Media */}
            <div className="flex gap-4 p-3 rounded-lg border-2 border-blue-400 hover:shadow-[0_0_15px_rgba(59,130,246,0.6)] transition-all duration-500">
              <a
                href="https://instagram.com/piyush.raj.22"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:text-pink-500 transition"
              >
                <Instagram size={22} />
              </a>
              <a
                href="https://linkedin.com/in/piyush-raj-tech"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="hover:text-blue-700 dark:hover:text-blue-400 transition"
              >
                <Linkedin size={22} />
              </a>
              <a
                href="https://twitter.com/piyussh_22"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter / X"
                className="hover:text-sky-500 transition"
              >
                <Twitter size={22} />
              </a>
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=piyushraj4734@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Email"
                className="hover:text-red-500 transition"
              >
                <Mail size={22} />
              </a>
            </div>

            {/* Admin Info Tooltip */}
            <div className="relative">
              <Info
                size={28}
                data-tooltip-id="admin-tooltip"
                className="cursor-pointer text-blue-600 hover:text-blue-800 transition"
              />
              <Tooltip id="admin-tooltip" place="top" className="max-w-xs">
                <div className="text-sm">
                  <p className="font-semibold mb-1">Admin Login</p>
                  <p>
                    Email: <span className="font-mono">admin@gmail.com</span>
                  </p>
                  <p>
                    Password: <span className="font-mono">admin@gmail.com</span>
                  </p>
                </div>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Index;
