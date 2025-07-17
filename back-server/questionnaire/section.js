import { numdiagPool, toHeroPool, connectToDatabase, executeQuery } from '../database/client.js'

function addSection(label, description, position, tooltip, idQuestionnaire) {
    return executeQuery(numdiagPool, 'INSERT INTO sections (label, description, position, tooltip, id_questionnaire) VALUES ($1, $2, $3, $4, $5) RETURNING *', [label, description, position, tooltip, idQuestionnaire])
}

function getSectionById(idSection) {
    return executeQuery(numdiagPool, 'SELECT * FROM sections WHERE id = $1', [idSection])
}

function getAllQuestionBySection(idSection) {
    return executeQuery(numdiagPool, 'SELECT * FROM questions WHERE section_id = $1', [idSection])
}

function updateSection(idSection, label = null, description = null, position = null, tooltip = null, idQuestionnaire = null) {
    const fields = []
    const values = []
    let index = 1

    if (label !== null) {
        fields.push(`label = $${index++}`)
        values.push(label)
    }
    if (description !== null) {
        fields.push(`description = $${index++}`)
        values.push(description)
    }
    if (position !== null) {
        fields.push(`position = $${index++}`)
        values.push(position)
    }
    if (tooltip !== null) {
        fields.push(`tooltip = $${index++}`)
        values.push(tooltip)
    }
    if (idQuestionnaire !== null) {
        fields.push(`id_questionnaire = $${index++}`)
        values.push(idQuestionnaire)
    }

    values.push(idSection)

    return executeQuery(numdiagPool, `UPDATE sections SET ${fields.join(', ')} WHERE id_section = $${index} RETURNING *`, values)
}

function deleteSection(idSection) {
    return executeQuery(numdiagPool, 'DELETE FROM sections WHERE id_section = $1 RETURNING *', [idSection])
}
