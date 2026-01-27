export default function SideModalLeft({
  children,
  onClose,
  handleCreateScoreClick,
  setIsModalOpen,
  isModalOpen,
}) {
  const handleBackdropClick = (e) => {
    // Only close if the click happened on the backdrop itself
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={
        isModalOpen
          ? "side-modal-backdrop-left short"
          : "side-modal-backdrop-left long"
      }
    >
      <div className="side-modal-left">
        <div className="modal-content">{children}</div>
      </div>
      <button
        className="close-btn-left text-xl pb-1 rounded-full px-3 border border-slate-100 bg-slate-300 text-slate-500"
        onClick={onClose}
      >
        x
      </button>
      <div className="create-section-container fixed bottom-10 right-65"></div>
      <button
        type="button"
        className="btn-edit-quest fixed bottom-10 left-10"
        onClick={() => setIsModalOpen(true)}
      >
        Recommandations
      </button>
      <div className="create-section-container fixed bottom-10 left-65">
        <button onClick={handleCreateScoreClick} className="btn-create-section">
          <span className="btn-icon">+</span>
          Créer un score
        </button>
      </div>
    </div>
  );
}
