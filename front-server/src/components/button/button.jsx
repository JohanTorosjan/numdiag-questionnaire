import { handleEdit, handleDelete, handleAdd, handleSave, handlePublish } from "./buttonLogic";
// function editButton(id, type) {
//     return (
//         <button className="green-btn" onClick={() => handleEdit(id, type)}>
//             Edit
//         </button>
//     )
// }

function editButton(setButtonPopup) {
    return (
        <button className="green-btn" onClick={() => setButtonPopup(true)}>
            Edit
        </button>
    )
}

// function deleteButton({onDeleteClick}) {
//     return (
//         <button className="red-btn" onClick={onDeleteClick}>
//             Delete
//         </button>
//     )
// }

function deleteButton(setButtonPopup) {
    return (
        <button className="red-btn" onClick={() => setButtonPopup(true)}>
            Delete
        </button>
    );
}

function copyButton(id, type) {
    return (
        <button className="yellow-btn" onClick={() => handleCopy(id, type)}>
            Copy
        </button>
    )
}

function addButton(setButtonPopup) {
    // Bouton permettant d'ajouter un element au composant selectionne
    // Exemple : si id = 1 et type = section, on ajoute alors une question dans la section 1
    // Si id = 1 et type = questionnaire, on ajoute une section dans le questionnaire
    return (
        <button className="add-btn" onClick={() => setButtonPopup(true)}>
            Add
        </button>
    )
}

function saveButton(idQuestionnaire) {
    return (
        <button className="green-btn" onClick={() => handleSave(idQuestionnaire)}>
            Save
        </button>
    )
}

function publishButton(idQuestionnaire) {
    return (
        <button className="blue-btn" onClick={() => handlePublish(idQuestionnaire)}>
            Publish
        </button>
    )
}


export {
    editButton,
    deleteButton,
    copyButton,
    addButton,
    saveButton,
    publishButton
}