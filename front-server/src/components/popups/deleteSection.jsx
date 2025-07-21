function popUpDeleteSection(id,props) {
    // Logic to display a popup for deleting a section
    console.log("Deleting section with id:", id);
    return (props.trigger) ? (
        <div className="popup">
            <h2>Supprimer la section</h2>
            <p>Êtes-vous sûr.e de vouloir supprimer la section {id} ?</p>
            <button className="add-btn" onClick={() => handleDelete(id)}>Oui</button>
            <button className="close-btn" onClick={()=> props.setTrigger(false)}>Non</button>
        </div>
    ) : "";
}

export default popUpDeleteSection;