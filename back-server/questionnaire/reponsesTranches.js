import { numdiagPool, executeQuery } from '../database/client.js'

function addReponsesTranches(questionId, tranches) {
    const queries = tranches.map(tranche => {
        return executeQuery(
            numdiagPool,
            `INSERT INTO ReponsesTranches (question_id, min, max, value, tooltip, plafond, recommandation) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [
                questionId,
                tranche.min,
                tranche.max,
                tranche.value,
                tranche.tooltip || null,
                tranche.plafond || null,
                tranche.recommandation || null,
            ]
        )
    })
    return Promise.all(queries)
}

function getReponsesTranchesByQuestion(questionId) {
    return executeQuery(
        numdiagPool,
        'SELECT * FROM ReponsesTranches WHERE question_id = $1 ORDER BY min ASC',
        [questionId]
    )
}

function updateReponsesTranches(questionId, tranches) {
    // Supprime les anciennes tranches et insère les nouvelles
    return executeQuery(numdiagPool, 'DELETE FROM ReponsesTranches WHERE question_id = $1', [questionId])
        .then(() => addReponsesTranches(questionId, tranches))
}

function deleteReponsesTranches(questionId) {
    return executeQuery(
        numdiagPool,
        'DELETE FROM ReponsesTranches WHERE question_id = $1 RETURNING *',
        [questionId]
    )
}

export {
    addReponsesTranches,
    getReponsesTranchesByQuestion,
    updateReponsesTranches,
    deleteReponsesTranches
}