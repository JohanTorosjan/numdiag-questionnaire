import { numdiagPool, toHeroPool, connectToDatabase, executeQuery } from '../database/client.js'

function createQuestionnaire(req, res) {
  const { questionnaire } = req.body;
  if (!questionnaire || !questionnaire.name) {
    questionnaire.name = 'Nouveau questionnaire';
  }

  const query = 'INSERT INTO questionnaires (label, description) VALUES ($1, $2) RETURNING *';
  const values = [questionnaire.label || 'Nouveau questionnaire', questionnaire.description || ''];

  executeQuery(numdiagPool, query, values)
    .then(result => res.status(201).json(result[0]))
    .catch(error => {
      console.error('Error creating questionnaire:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
}

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
    const query = 'SELECT id, label, isActive, created_at FROM questionnaires';
    return executeQuery(numdiagPool, query);
}

function updateQuestionnaireInfo(idQuestionnaire, label = null, description = null, insight = null, isActive=true) {
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
    if (isActive !== true) {
        fields.push(`isactive = $${index++}`)
        values.push(insight)
    }

    values.push(idQuestionnaire);

    executeQuery(numdiagPool, `UPDATE Questionnaires SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`, values)
}

export {
    createQuestionnaire,
    getQuestionnaireById,
    getAllInfosQuestionnaire,
    getAllQuestionnaires,
    getAllQuestionnaireResume,
    getSectionofQuestionnaire,
    updateQuestionnaireInfo
}
