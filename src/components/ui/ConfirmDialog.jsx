import Modal from "./Modal.jsx";
import Button from "./Button.jsx";

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description,
  confirmLabel = "Confirm",
  confirmVariant = "danger",
  loading = false,
}) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-sm">
    {description && (
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        {description}
      </p>
    )}
    <div className="flex justify-end gap-3">
      <Button variant="secondary" onClick={onClose} disabled={loading}>
        Cancel
      </Button>
      <Button variant={confirmVariant} onClick={onConfirm} loading={loading}>
        {confirmLabel}
      </Button>
    </div>
  </Modal>
);

export default ConfirmDialog;
