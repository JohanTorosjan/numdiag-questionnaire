export default function SideModal({ children, onClose,  handleCreateRecoClick, setIsModalNotesOpen, isModalNotesOpen}) {
  const handleBackdropClick = (e) => {
    // Only close if the click happened on the backdrop itself
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={isModalNotesOpen ? "side-modal-backdrop short": "side-modal-backdrop long"}>
      <div className="side-modal">
        <div className="modal-content">{children}</div>
      </div>
        <button className="close-btn text-xl pb-1 rounded-full px-3 border border-slate-100 bg-slate-300 text-slate-500" onClick={onClose}>x</button>
      <div className="create-section-container fixed bottom-10 right-65">
      <button
        onClick={handleCreateRecoClick}
        className="btn-create-section"
      >
        <span className="btn-icon">+</span>
        Créer une recommandation
      </button>
      <button
        type="button"
        className="btn-edit-quest fixed right-10 bottom-10"
        onClick={() => setIsModalNotesOpen(true)}
      >
        Notes
  </button>
    </div>
    </div>
  );
}
