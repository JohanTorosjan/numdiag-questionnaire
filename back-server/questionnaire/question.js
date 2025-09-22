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

// function updateQuestion(idQuestion, label = null, questionType = null, position = null, page = null, tooltip = null, coeff = null, theme = null) {
//     const fields = []
//     const values = []
//     let index = 1

//     if (label !== null) {
//         fields.push(`label = $${index++}`)
//         values.push(label)
//     }
//     if (questionType !== null) {
//         fields.push(`question_type = $${index++}`)
//         values.push(questionType)
//     }
//     if (position !== null) {
//         fields.push(`position = $${index++}`)
//         values.push(position)
//     }
//     if (page !== null) {
//         fields.push(`page = $${index++}`)
//         values.push(page)
//     }
//     if (tooltip !== null) {
//         fields.push(`tooltip = $${index++}`)
//         values.push(tooltip)
//     }
//     if (coeff !== null) {
//         fields.push(`coeff = $${index++}`)
//         values.push(coeff)
//     }
//     if (theme !== null) {
//         fields.push(`theme = $${index++}`)
//         values.push(theme)
//     }

//     values.push(idQuestion)

//     return executeQuery(numdiagPool, `UPDATE questions SET ${fields.join(', ')} WHERE id_question = $${index} RETURNING *`, values)
// }

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


async function updateQuestion(questionId,section_id,label,questiontype,position,page,tooltip,coeff,theme,mandatory,public_cible,dependencies){
    try{
        await numdiagPool.query('BEGIN')
            // 1. Mise à jour de la question principale
        const updateQuestionQuery = `
        UPDATE Questions 
        SET section_id = $1, label = $2, questionType = $3, position = $4, 
            page = $5, tooltip = $6, coeff = $7, theme = $8, 
            mandatory = $9, public_cible = $10
        WHERE id = $11
        RETURNING *
        `;
        const questionResult = await executeQuery(numdiagPool,updateQuestionQuery, [
            section_id, label, questiontype, position, page, 
            tooltip, coeff, theme, mandatory, public_cible, questionId
        ]);
        ``
        if (questionResult.length === 0) {
            throw new Error('Question non trouvée');
            }

  
        
        await executeQuery(numdiagPool,
        'DELETE FROM QuestionDependencies WHERE question_id = $1',
        [questionId]
        );

        if (dependencies && dependencies.length > 0) {
        const dependencyValues = dependencies.map((reponseId, index) => {
            const paramIndex1 = index * 2 + 1;
            const paramIndex2 = index * 2 + 2;
            return `($${paramIndex1}, $${paramIndex2})`;
        }).join(', ');

        const dependencyParams = dependencies.flatMap(reponseId => [questionId, reponseId.split("_")[1]]);
        console.log(dependencyParams)
        await executeQuery(numdiagPool,
            `INSERT INTO QuestionDependencies (question_id, reponse_id) VALUES ${dependencyValues}`,
            dependencyParams
        );
        }

        await executeQuery(numdiagPool,'COMMIT');
        const finalQuery = `
            SELECT q.*, 
                    COALESCE(
                    array_agg(qd.reponse_id) FILTER (WHERE qd.reponse_id IS NOT NULL), 
                    ARRAY[]::INTEGER[]
                    ) as dependencies
            FROM Questions q
            LEFT JOIN QuestionDependencies qd ON q.id = qd.question_id
            WHERE q.id = $1
            GROUP BY q.id
            `;
    
    const finalResult = await executeQuery(numdiagPool,finalQuery, [questionId]);

    return({
      success: true,
      question: finalResult[0]
    });
    }

    
    
    catch (error) {
        await numdiagPool.query('ROLLBACK');
        console.error('Erreur lors de la mise à jour:', error);
        res.status(500).json({
        success: false,
        error: error.message
        });
  } finally {
   // numdiagPool.release();
  }

}


export {
    addQuestion,
    getQuestionById,
    deleteQuestion,
    getAllReponsesByQuestion,
    updateQuestion
}
