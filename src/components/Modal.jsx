// components/Modal.jsx
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 ">
      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-opacity-20 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal content */}
      <div
        className="relative bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md z-10"
        style={{
          backgroundColor: "var(--bg)",
          color: "var(--text)",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
