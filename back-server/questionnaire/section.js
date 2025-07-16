function addSection(idSection, label, description, position, tooltip, idQuestionnaire) {
    return executeQuery(numdiagPool, 'INSERT INTO sections (id_section, label, description, position, tooltip, id_questionnaire) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [idSection, label, description, position, tooltip, idQuestionnaire])
}

function getSectionById(idSection) {
    return executeQuery(numdiagPool, 'SELECT * FROM sections WHERE id_section = $1', [idSection])
}

function getAllQuestionBySection(idSection) {
    return executeQuery(numdiagPool, 'SELECT * FROM questions WHERE id_section = $1', [idSection])
}

function updateSection(idSection, label, description, position, tooltip, idQuestionnaire) {
    return executeQuery(numdiagPool, 'UPDATE sections SET label = $2, description = $3, position = $4, tooltip = $5, id_questionnaire = $6 WHERE id_section = $1 RETURNING *', [idSection, label, description, position, tooltip, idQuestionnaire])
}

function deleteSection(idSection) {
    return executeQuery(numdiagPool, 'DELETE FROM sections WHERE id_section = $1 RETURNING *', [idSection])
}
