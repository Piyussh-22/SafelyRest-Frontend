import { useNavigate } from "react-router-dom";
import Modal from "./Modal";

const LogoutConfirm = ({ isOpen, onClose, onConfirm }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Call the original onConfirm (which might clear auth, tokens, etc.)
    if (onConfirm) onConfirm();

    // Redirect to home page
    navigate("/");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Are you sure you want to logout?
        </h2>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-400 hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default LogoutConfirm;
