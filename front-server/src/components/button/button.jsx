import { handleEdit, handleDelete, handleAdd, handleSave, handlePublish } from "./buttonLogic";

function editButton(id, type) {
    return (
        <button className="edit-button" onClick={() => handleEdit(id, type)}>
            Edit
        </button>
    )
}

function deleteButton(id, type) {
    return (
        <button className="delete-button" onClick={() => handleDelete(id, type)}>
            Delete
        </button>
    )
}

function copyButton(id, type) {
    return (
        <button className="copy-button" onClick={() => handleCopy(id, type)}>
            Copy
        </button>
    )
}

function addButton(id, type) {
    // Bouton permettant d'ajouter un element au composant selectionne
    // Exemple : si id = 1 et type = section, on ajoute alors une question dans la section 1
    // Si id = 1 et type = questionnaire, on ajoute une section dans le questionnaire
    return (
        <button className="add-button" onClick={() => handleAdd(id, type)}>
            Add
        </button>
    )
}

function saveButton(idQuestionnaire) {
    return (
        <button className="save-button" onClick={() => handleSave(idQuestionnaire)}>
            Save
        </button>
    )
}

function publishButton(idQuestionnaire) {
    return (
        <button className="publish-button" onClick={() => handlePublish(idQuestionnaire)}>
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