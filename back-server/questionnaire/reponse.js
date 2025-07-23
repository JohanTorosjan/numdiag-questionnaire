import { numdiagPool, toHeroPool, connectToDatabase, executeQuery } from '../database/client.js'

function addReponse(idReponse, idQuestion, idSection, label, position, tooltip) {
    return executeQuery(numdiagPool, 'INSERT INTO reponses (id_reponse, id_question, id_section, label, position, tooltip) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [idReponse, idQuestion, idSection, label, position, tooltip])
}

function getReponseById(idReponse) {
    return executeQuery(numdiagPool, 'SELECT * FROM reponses WHERE id_reponse = $1', [idReponse])
}

function updateReponse(idReponse, idQuestion = null, idSection = null, label = null, position = null, tooltip = null) {
    const fields = []
    const values = []
    let index = 1

    if (idQuestion !== null) {
        fields.push(`id_question = $${index++}`)
        values.push(idQuestion)
    }
    if (idSection !== null) {
        fields.push(`id_section = $${index++}`)
        values.push(idSection)
    }
    if (label !== null) {
        fields.push(`label = $${index++}`)
        values.push(label)
    }
    if (position !== null) {
        fields.push(`position = $${index++}`)
        values.push(position)
    }
    if (tooltip !== null) {
        fields.push(`tooltip = $${index++}`)
        values.push(tooltip)
    }

    values.push(idReponse)

    return executeQuery(numdiagPool, `UPDATE reponses SET ${fields.join(', ')} WHERE id_reponse = $${index} RETURNING *`, values)
}

function deleteReponse(idReponse) {
    return executeQuery(numdiagPool, 'DELETE FROM reponses WHERE id_reponse = $1 RETURNING *', [idReponse])
}

export {
    addReponse,
    getReponseById,
    updateReponse,
    deleteReponse
}