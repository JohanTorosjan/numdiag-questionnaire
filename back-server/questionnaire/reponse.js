function addReponse(idReponse, idQuestion, idSection, label, position, tooltip) {
    return executeQuery(numdiagPool, 'INSERT INTO reponses (id_reponse, id_question, id_section, label, position, tooltip) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [idReponse, idQuestion, idSection, label, position, tooltip])
}

function getReponseById(idReponse) {
    return executeQuery(numdiagPool, 'SELECT * FROM reponses WHERE id_reponse = $1', [idReponse])
}

function updateReponse(idReponse, idQuestion, idSection, label, position, tooltip) {
    return executeQuery(numdiagPool, 'UPDATE reponses SET id_question = $2, id_section = $3, label = $4, position = $5, tooltip = $6 WHERE id_reponse = $1 RETURNING *', [idReponse, idQuestion, idSection, label, position, tooltip])
}

function deleteReponse(idReponse) {
    return executeQuery(numdiagPool, 'DELETE FROM reponses WHERE id_reponse = $1 RETURNING *', [idReponse])
}
