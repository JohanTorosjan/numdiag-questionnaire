function addQuestion(idQuestion, label, questionType, position, page, tooltip, coeff, theme, idSection) {
    return executeQuery(numdiagPool, 'INSERT INTO questions (id_question, label, question_type, position, page, tooltip, coeff, theme, id_section) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *', [idQuestion, label, questionType, position, page, tooltip, coeff, theme, idSection])
}

function getQuestionById(idQuestion) {
    return executeQuery(numdiagPool, 'SELECT * FROM questions WHERE id_question = $1', [idQuestion])
}

function deleteQuestion(idQuestion) {
    return executeQuery(numdiagPool, 'DELETE FROM questions WHERE id_question = $1 RETURNING *', [idQuestion])
}