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


async function updateQuestion(questionId,section_id,label,questiontype,tooltip,coeff,theme,mandatory,public_cible,dependencies){
    try{
        await numdiagPool.query('BEGIN')
            // 1. Mise à jour de la question principale
        const updateQuestionQuery = `
        UPDATE Questions 
        SET section_id = $1, label = $2, questionType = $3, tooltip = $4, coeff = $5, theme = $6, 
            mandatory = $7, public_cible = $8
        WHERE id = $9
        RETURNING *
        `;
        const questionResult = await executeQuery(numdiagPool,updateQuestionQuery, [
            section_id, label, questiontype, 
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
       return({
        success: false,
        error: error.message
        });
  } finally {
   // numdiagPool.release();
  }

}




// Fonction utilitaire pour réorganiser les questions
function reorganizeQuestions(existingQuestions, movedQuestion) {
  const result = [];
  
  // Ajouter la question déplacée à sa nouvelle position
  const allQuestions = [...existingQuestions, movedQuestion];
  
  // Trier par page, puis insérer la question déplacée à la bonne position dans sa page
  const questionsByPage = {};
  
  // Grouper par page
  allQuestions.forEach(q => {
    if (!questionsByPage[q.page]) {
      questionsByPage[q.page] = [];
    }
    questionsByPage[q.page].push(q);
  });
  
  // Réorganiser chaque page
  Object.keys(questionsByPage).forEach(pageNum => {
    const questionsInPage = questionsByPage[pageNum];
    
    // Séparer la question déplacée des autres
    const movedInThisPage = questionsInPage.find(q => q.id === movedQuestion.id);
    const othersInThisPage = questionsInPage.filter(q => q.id !== movedQuestion.id)
      .sort((a, b) => a.position - b.position);
    
    if (movedInThisPage) {
      // Insérer la question déplacée à sa nouvelle position
      const newPosition = Math.max(1, Math.min(movedQuestion.position, othersInThisPage.length + 1));
      
      // Reconstruire la liste avec les bonnes positions
      const pageQuestions = [];
      let insertIndex = newPosition - 1;
      
      // Ajouter les questions avant la position d'insertion
      for (let i = 0; i < insertIndex && i < othersInThisPage.length; i++) {
        pageQuestions.push({
          ...othersInThisPage[i],
          position: i + 1,
          page: parseInt(pageNum)
        });
      }
      
      // Ajouter la question déplacée
      pageQuestions.push({
        ...movedInThisPage,
        position: insertIndex + 1,
        page: parseInt(pageNum)
      });
      
      // Ajouter les questions après la position d'insertion
      for (let i = insertIndex; i < othersInThisPage.length; i++) {
        pageQuestions.push({
          ...othersInThisPage[i],
          position: i + 2,
          page: parseInt(pageNum)
        });
      }
      
      result.push(...pageQuestions);
    } else {
      // Page sans la question déplacée, juste réorganiser les positions
      othersInThisPage.forEach((q, index) => {
        result.push({
          ...q,
          position: index + 1,
          page: parseInt(pageNum)
        });
      });
    }
  });
  
  return result.sort((a, b) => {
    if (a.page !== b.page) return a.page - b.page;
    return a.position - b.position;
  });
}

async function updatePositions(questionId,newPosition,newPage) {
    try{
        await numdiagPool.query('BEGIN')
        const questionResult = await executeQuery(numdiagPool, 'SELECT id, section_id, position, page FROM Questions WHERE id = $1',[questionId]);
        if (questionResult.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Question non trouvée' });
        }
        const question = questionResult[0];
        const sectionId = question.section_id;
        const allQuestions = await executeQuery(numdiagPool,'SELECT id, position, page FROM Questions WHERE section_id = $1 ORDER BY page, position',[sectionId])       
        const otherQuestions = allQuestions.filter(q => q.id != questionId);

        let effectivePosition = Math.max(1, parseInt(newPosition) || 1);
        let effectivePage = Math.max(1, parseInt(newPage) || question.page);
    
        const questionsOnSamePage = otherQuestions.filter(q => q.page == effectivePage);
        if (effectivePosition > questionsOnSamePage.length + 1) {
            effectivePosition = questionsOnSamePage.length + 1;
        }
    
        const reorganizedQuestions = reorganizeQuestions(otherQuestions, {
            id: parseInt(questionId),
            position: effectivePosition,
            page: effectivePage
        });
        for (const q of reorganizedQuestions) {
            await executeQuery(numdiagPool,
                'UPDATE Questions SET position = $1, page = $2 WHERE id = $3',
                [q.position, q.page, q.id]
            );
    }
    await executeQuery(numdiagPool,"COMMIT")


    const updatedQuestionsResult = await executeQuery(numdiagPool,
    'SELECT id, position, page, label FROM Questions WHERE section_id = $1 ORDER BY page, position',
    [sectionId]
    );

    
    return({
      message: 'Questions réorganisées avec succès',
      questions: updatedQuestionsResult
    });

    }
    catch(err){
        await executeQuery(numdiagPool,'ROLLBACK');
        console.error('Erreur lors de la réorganisation des questions:', err);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
    
}

async function deleteReponses(questionId) {
    const deleteReponses = executeQuery(
        numdiagPool,
        'DELETE FROM Reponses WHERE question_id = $1 RETURNING *',
        [questionId]
    )
    const deleteReponsesTranches = executeQuery(
        numdiagPool,
        'DELETE FROM ReponsesTranches WHERE question_id = $1 RETURNING *',
        [questionId]
    )
    return (deleteReponses,deleteReponsesTranches)    
}


async function createQuestion(
    section_id,
    label, 
    questiontype, 
    position, 
    page, 
    tooltip, 
    coeff, 
    theme, 
    mandatory, 
    public_cible
) {
    try {
        await numdiagPool.query('BEGIN');

        // 1. Récupérer toutes les questions de la même section et page
        const existingQuestionsQuery = `
            SELECT id, position, page 
            FROM Questions 
            WHERE section_id = $1 AND page = $2 
            ORDER BY position
        `;
        const existingQuestions = await executeQuery(
            numdiagPool, 
            existingQuestionsQuery, 
            [section_id, page]
        );

        // 2. Vérifier et ajuster la position si nécessaire
        let effectivePosition = Math.max(1, parseInt(position) || 1);
        if (effectivePosition > existingQuestions.length + 1) {
            effectivePosition = existingQuestions.length + 1;
        }

        // 3. Décaler les questions existantes si nécessaire
        if (existingQuestions.length > 0) {
            // Décaler toutes les questions à partir de la position d'insertion
            const updatePositionsQuery = `
                UPDATE Questions 
                SET position = position + 1 
                WHERE section_id = $1 AND page = $2 AND position >= $3
            `;
            await executeQuery(
                numdiagPool, 
                updatePositionsQuery, 
                [section_id, page, effectivePosition]
            );
        }

        // 4. Insérer la nouvelle question
        const insertQuestionQuery = `
            INSERT INTO Questions (
                section_id, 
                label, 
                questionType, 
                position, 
                page, 
                tooltip, 
                coeff, 
                theme, 
                mandatory, 
                public_cible
            ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
            RETURNING *
        `;
        
        const result = await executeQuery(
            numdiagPool,
            insertQuestionQuery,
            [
                section_id,
                label,
                questiontype,
                effectivePosition,
                page,
                tooltip || null,
                coeff,
                theme || null,
                mandatory,
                public_cible
            ]
        );

        await numdiagPool.query('COMMIT');

        return {
            success: true,
            question: result[0]
        };

    } catch (error) {
        await numdiagPool.query('ROLLBACK');
        console.error('Erreur lors de la création de la question:', error);
        throw error;
    }
}



export {
    addQuestion,
    getQuestionById,
    deleteQuestion,
    getAllReponsesByQuestion,
    updateQuestion,
    updatePositions,
    deleteReponses,
    createQuestion
}
