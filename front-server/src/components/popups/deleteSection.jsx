function PopUpDeleteSection({id, handleDelete, trigger, setTrigger}) {
    // Logic to display a popup for deleting a section
    console.log("Deleting section with id:", id);
    return (trigger) ? (
        <div className="popup">
            <div className="popup-inner">
                <h2>Supprimer la section</h2>
                <p>Êtes-vous sûr.e de vouloir supprimer la section {id} ?</p>
                <button className="add-btn" onClick={() => handleDelete(id)}>Oui</button>
                <button className="close-btn" onClick={()=> setTrigger(false)}>Non</button>
            </div>
        </div>
    ) : "";
}

export default PopUpDeleteSection;