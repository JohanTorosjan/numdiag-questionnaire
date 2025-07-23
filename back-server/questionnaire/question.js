import { numdiagPool, toHeroPool, connectToDatabase, executeQuery } from '../database/client.js'

function addQuestion(label, questionType, position, page, tooltip, coeff, theme, idSection) {
    return executeQuery(numdiagPool, 'INSERT INTO questions (label, question_type, position, page, tooltip, coeff, theme, section_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [label, questionType, position, page, tooltip, coeff, theme, idSection])
}

function getQuestionById(idQuestion) {
    return executeQuery(numdiagPool, 'SELECT * FROM questions WHERE id = $1', [idQuestion])
}

function deleteQuestion(idQuestion) {
    return executeQuery(numdiagPool, 'DELETE FROM questions WHERE id = $1 RETURNING *', [idQuestion])
}

function updateQuestion(idQuestion, label = null, questionType = null, position = null, page = null, tooltip = null, coeff = null, theme = null) {
    const fields = []
    const values = []
    let index = 1

    if (label !== null) {
        fields.push(`label = $${index++}`)
        values.push(label)
    }
    if (questionType !== null) {
        fields.push(`question_type = $${index++}`)
        values.push(questionType)
    }
    if (position !== null) {
        fields.push(`position = $${index++}`)
        values.push(position)
    }
    if (page !== null) {
        fields.push(`page = $${index++}`)
        values.push(page)
    }
    if (tooltip !== null) {
        fields.push(`tooltip = $${index++}`)
        values.push(tooltip)
    }
    if (coeff !== null) {
        fields.push(`coeff = $${index++}`)
        values.push(coeff)
    }
    if (theme !== null) {
        fields.push(`theme = $${index++}`)
        values.push(theme)
    }

    values.push(idQuestion)

    return executeQuery(numdiagPool, `UPDATE questions SET ${fields.join(', ')} WHERE id_question = $${index} RETURNING *`, values)
}

function getAllReponsesByQuestion(idQuestion) {
    question = getQuestionById(idQuestion)
    if (!question) {
        throw new Error('Question not found');
    }
    reponses = executeQuery(numdiagPool, 'SELECT * FROM reponses WHERE question_id = $1', [idQuestion])
    if (!reponses.length) {
        throw new Error('No responses found for this question');
    }

    return { ...question, reponses: reponses }
}

export {
    addQuestion,
    getQuestionById,
    deleteQuestion,
    updateQuestion,
    getAllReponsesByQuestion
}
