import { numdiagPool, toHeroPool, connectToDatabase, executeQuery } from '../database/client.js'

function addReponse(idReponse, idQuestion, idSection, label, position, tooltip) {
    return executeQuery(numdiagPool, 'INSERT INTO reponses (id_reponse, id_question, id_section, label, position, tooltip) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [idReponse, idQuestion, idSection, label, position, tooltip])
}

function getReponseById(idReponse) {
    return executeQuery(numdiagPool, 'SELECT * FROM reponses WHERE id_reponse = $1', [idReponse])
}

function deleteReponse(idReponse) {
    return executeQuery(numdiagPool, 'DELETE FROM reponses WHERE id_reponse = $1 RETURNING *', [idReponse])
}

function updateReponse(idReponse, label, position, tooltip, plafond, recommandation, valeurScore) {
    return executeQuery(
        numdiagPool, 
        'UPDATE reponses SET label = $1, position = $2, tooltip = $3, plafond = $4, recommandation = $5, valeurScore = $6 WHERE id = $7 RETURNING *', 
        [label, position, tooltip, plafond, recommandation, valeurScore, idReponse]
    )
}

export {
    addReponse,
    getReponseById,
    deleteReponse,
    updateReponse
}

