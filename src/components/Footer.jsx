const Footer = () => {
  return (
    <footer
      className="w-full border-t transition-colors duration-300"
      style={{
        backgroundColor: "var(--bg)",
        color: "var(--text)",
      }}
    >
      <div className="flex flex-col md:flex-row justify-center items-center gap-2 px-4 py-2">
        {/* Brand */}
        <div className="font-semibold text-center md:text-left">
          Copyright © {new Date().getFullYear()} Safely Rest. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
