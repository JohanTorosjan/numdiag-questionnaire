export default function SideModal({ children, onClose }) {
  const handleBackdropClick = (e) => {
    // Only close if the click happened on the backdrop itself
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="side-modal-backdrop" onClick={handleBackdropClick}>
      <div className="side-modal">
        <button className="close-btn" onClick={onClose}>×</button>
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
}
