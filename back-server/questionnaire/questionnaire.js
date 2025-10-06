import { numdiagPool, toHeroPool, connectToDatabase, executeQuery } from '../database/client.js'

function getQuestionnaireById(req, res) {
    const { id } = req.params;
    const query = 'SELECT * FROM questionnaires WHERE id = $1';
    executeQuery(numdiagPool, query, [id])
        .then(result => {
            if (result.length === 0) {
                return res.status(404).json({ error: 'Questionnaire not found' });
            }
            res.json(result[0]);
        })
        .catch(error => {
            console.error('Error fetching questionnaire:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
}


async function getAllInfosQuestionnaire(idQuestionnaire) {
    // Récupération du questionnaire
    const [questionnaire] = await executeQuery(
        numdiagPool,
        'SELECT * FROM questionnaires WHERE id = $1',
        [idQuestionnaire]
    );
    if (!questionnaire) return null;

    // Récupération des sections
    const sections = await executeQuery(
        numdiagPool,
        'SELECT * FROM sections WHERE questionnaire_id = $1 ORDER BY position',
        [idQuestionnaire]
    );

    // Récupération des questions (pour toutes les sections en une seule fois)
    const questions = await executeQuery(
        numdiagPool,
        'SELECT * FROM questions WHERE section_id = ANY($1) ORDER BY position',
        [sections.map(s => s.id)]
    );

    // Récupération des réponses (pour toutes les questions en une seule fois)
    const reponses = await executeQuery(
        numdiagPool,
        'SELECT * FROM reponses WHERE question_id = ANY($1) ORDER BY position',
        [questions.map(q => q.id)]
    );

    // On indexe les réponses par question_id
    const reponsesByQuestion = {};
    for (const rep of reponses) {
        if (!reponsesByQuestion[rep.question_id]) {
            reponsesByQuestion[rep.question_id] = [];
        }
        reponsesByQuestion[rep.question_id].push(rep);
    }

    // On indexe les questions par section_id
    const questionsBySection = {};
    for (const q of questions) {
        q.reponses = reponsesByQuestion[q.id] || [];
        if (!questionsBySection[q.section_id]) {
            questionsBySection[q.section_id] = [];
        }
        questionsBySection[q.section_id].push(q);
    }

    // On rattache les questions à leur section
    for (const s of sections) {
        s.questions = questionsBySection[s.id] || [];
    }

    // On rattache les sections au questionnaire
    questionnaire.sections = sections;

    return questionnaire;
}

function getSectionofQuestionnaire(idQuestionnaire) {
    return executeQuery(numdiagPool, 'SELECT * FROM sections WHERE id_questionnaire = $1', [idQuestionnaire])
}

function getAllQuestionnaires(req, res) {
    const query = 'SELECT * FROM questionnaires';
    executeQuery(numdiagPool, query)
        .then(result => res.json(result))
        .catch(error => {
            console.error('Error fetching questionnaires:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
}

function getAllQuestionnaireResume() {
    const query = 'SELECT id, label, isactive, created_at FROM questionnaires';
    return executeQuery(numdiagPool, query);
}

function updateQuestionnaireInfo(idQuestionnaire, label = null, description = null, insight = null, isactive=null) {
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
    if (insight !== null) {
        fields.push(`insight = $${index++}`)
        values.push(insight)
    }
    if (isactive !== null) {
        fields.push(`isactive = $${index++}`)
        values.push(isactive)
    }

    values.push(idQuestionnaire);

    executeQuery(numdiagPool, `UPDATE Questionnaires SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`, values)
  }

  function createQuestionnaire(label = null, description = null, insight = null, tooltip = null, code = null) {
    const fields = [];
    const placeholders=[];
    const values = [];
    let index = 1;

    if (label !== null && label!=='') {
      fields.push(`label`);
      placeholders.push(`$${index++}`);
      values.push(label);
    }
    if (description !== null && description!=='') {
      fields.push(`description`);
      placeholders.push(`$${index++}`);
      values.push(description);
    }
    if (insight !== null && insight!=='') {
      fields.push(`insight`);
      placeholders.push(`$${index++}`);
      values.push(insight);
    }
    if (tooltip !== null && tooltip!=='') {
      fields.push(`tooltip`);
      placeholders.push(`$${index++}`);
      values.push(tooltip);
    }
    if (code !== null && code!=='') {
      fields.push(`code`);
      placeholders.push(`$${index++}`);
      values.push(code);
    }


     return executeQuery(
        numdiagPool,
        `INSERT INTO Questionnaires (${fields.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING *`,
        values
    )
}



async function getAllQuestionsByQuestionnaire(questionnaireId) {
  try {
    // Requête pour récupérer toutes les questions d'un questionnaire avec leurs réponses
    const query = `
      SELECT
        q.id as question_id,
        q.label as question_label,
        q.questionType as question_type,
        q.position as question_position,
        q.page as question_page,
        q.tooltip as question_tooltip,
        q.coeff as question_coeff,
        q.theme as question_theme,
        q.mandatory as question_mandatory,
        q.public_cible as question_public_cible,
        r.id as answer_id,
        r.label as answer_label,
        r.position as answer_position,
        r.tooltip as answer_tooltip,
        r.plafond as answer_plafond,
        r.recommandation as answer_recommandation,
        r.valeurScore as answer_value_score
      FROM Questions q
      INNER JOIN Sections s ON q.section_id = s.id
      LEFT JOIN Reponses r ON q.id = r.question_id
      WHERE s.questionnaire_id = $1
      ORDER BY q.position ASC, r.position ASC
    `;

    const result = await executeQuery(numdiagPool,query, [questionnaireId]);

    // Transformation des données pour le format attendu
    const questionsMap = new Map();

    result.forEach(row => {
      const questionId = row.question_id;

      // Si la question n'existe pas encore dans le Map, on l'ajoute
      if (!questionsMap.has(questionId)) {
        questionsMap.set(questionId, {
          id: questionId,
          label: row.question_label,
          questiontype: row.question_type.replace('_', '-'), // Conversion choix_multiple -> choix-multiple
          position: row.question_position,
          page: row.question_page,
          tooltip: row.question_tooltip,
          coeff: row.question_coeff,
          theme: row.question_theme,
          mandatory: row.question_mandatory,
          public_cible: row.question_public_cible,
          answers: []
        });
      }

      // Si il y a une réponse associée, on l'ajoute
      if (row.answer_id) {
        const question = questionsMap.get(questionId);
        question.answers.push({
          id: row.answer_id,
          text: row.answer_label,
          value: row.answer_label.toLowerCase()
            .replace(/[àáâãäå]/g, 'a')
            .replace(/[èéêë]/g, 'e')
            .replace(/[ìíîï]/g, 'i')
            .replace(/[òóôõö]/g, 'o')
            .replace(/[ùúûü]/g, 'u')
            .replace(/[ç]/g, 'c')
            .replace(/[^a-z0-9]/g, '_')
            .replace(/_+/g, '_')
            .replace(/^_|_$/g, ''),
          position: row.answer_position,
          tooltip: row.answer_tooltip,
          plafond: row.answer_plafond,
          recommandation: row.answer_recommandation,
          valeurScore: row.answer_value_score
        });
      }
    });

    // Conversion du Map en array
    return Array.from(questionsMap.values());

  } catch (error) {
    console.error('Error in getAllQuestionsByQuestionnaire:', error);
    throw error;
  }
}
const getDependenciesForQuestion = async (questionId) => {
  try {
    const query = `
      SELECT
        r.question_id,
        qd.reponse_id as answer_id
      FROM QuestionDependencies qd
      INNER JOIN Reponses r ON qd.reponse_id = r.id
      WHERE qd.question_id = $1
      ORDER BY r.question_id, qd.reponse_id
    `;

    const result = await executeQuery(numdiagPool, query, [questionId]);

    // Transformation des résultats en tableau de clés de dépendance
    // Maintenant question_id correspond à la question associée à la réponse
    const dependencies = result.map(row => {
        return `${row.question_id}_${row.answer_id}`;
    });

    return dependencies;

  } catch (error) {
    console.error('Error in getDependenciesForQuestion:', error);
    throw error;
  }
};



export {
    createQuestionnaire,
    getQuestionnaireById,
    getAllInfosQuestionnaire,
    getAllQuestionnaires,
    getAllQuestionnaireResume,
    getSectionofQuestionnaire,
    updateQuestionnaireInfo,
    getAllQuestionsByQuestionnaire,
    getDependenciesForQuestion
}
