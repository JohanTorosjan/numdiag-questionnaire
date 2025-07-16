import popUpEditSection from "../popups/editSection";
import popUpEditQuestion from "../popups/editQuestion";
import popUpDeleteSection from "../popups/deleteSection";
import popUpDeleteQuestion from "../popups/deleteQuestion";

const types = {
    questionnaire: "questionnaire",
    section: "section",
    question: "question"
};

function handleEdit(id, type) {
    switch (type) {
        case types.section:
            popUpEditSection(id);
            break;
        case types.question:
            popUpEditQuestion(id);
            break;
        default:
            console.error("Unknown type for edit:", type);
    }
}

function handleDelete(id, type) {
    switch (type) {
        case types.section:
            popUpDeleteSection(id);
            break;
        case types.question:
            popUpDeleteQuestion(id);
            break;
        default:
            console.error("Unknown type for delete:", type);
    }
}

async function handleCopy(id, type) {
    switch (type) {
        case types.section:
            url = `http://127.0.0.1:3008/sections/${id}/copy`;
            break;
        case types.question:
            url = `http://127.0.0.1:3008/questions/${id}/copy`;
            break;
        case types.questionnaire:
            url = `http://127.0.0.1:3008/questionnaires/${id}/copy`;
            break;
        default:
            console.error("Unknown type for copy:", type);
            return;
    }

    try {
        const response = await fetch(url, {
            method: "POST",
            mode: "cors",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            }
        });
        
        if (response.ok) {
            pools.value = await response.json();
        }
    } catch (error) {
        console.error("Erreur lors du chargement des pools:", error);
    }

    console.log(`Copying ${type} with id: ${id}`);
}

function handleAdd(id, type) {
    // Logic to add an element based on type
    switch (type) {
        case types.section:
            console.log("Adding a question to section with id:", id);
            break;
        case types.questionnaire:
            console.log("Adding a section to questionnaire with id:", id);
            break;
        default:
            console.error("Unknown type for add:", type);
    }
}

function handleSave(idQuestionnaire) {
    // Logic to save the questionnaire
    console.log("Saving questionnaire with id:", idQuestionnaire);
}

function handlePublish(idQuestionnaire) {
    // Logic to publish the questionnaire
    console.log("Publishing questionnaire with id:", idQuestionnaire);
}

export { handleEdit, handleDelete, handleCopy, handleAdd, handleSave, handlePublish, types };