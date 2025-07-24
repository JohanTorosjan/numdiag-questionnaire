async function handleDelete(id) {
    try {
        const response = await fetch(`http://127.0.0.1:3008/deleteSection/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Section deleted:', data);
    }
    catch (error) {
        console.error('Error deleting section:', error);
    }
}

function PopUpDeleteSection({idQuestionnaire, handleDelete, trigger, setTrigger}) {
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