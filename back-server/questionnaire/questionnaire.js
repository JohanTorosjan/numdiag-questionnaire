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


async function getAllInfosQuestionnaire(idQuestionnaire){
    let questionnaire = await executeQuery(numdiagPool, 'SELECT * FROM questionnaires WHERE id = $1', [idQuestionnaire])
    console.log('Questionnaire fetched:', questionnaire);

    let sections = await executeQuery(numdiagPool, 'SELECT * FROM sections WHERE questionnaire_id = $1', [idQuestionnaire])
    let questions = []
    for (const section of sections) {
        const sectionQuestions = await executeQuery(numdiagPool, 'SELECT * FROM questions WHERE section_id = $1', [section.id_section])
        questions.push({
            ...section,
            questions: sectionQuestions
        })
    }
    console.log('Questionnaire with sections and questions:', questionnaire, sections, questions);
    return { ...questionnaire, sections: questions }
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
    const query = 'SELECT id, label, created_at FROM questionnaires';
    return executeQuery(numdiagPool, query);
}

export {
    createQuestionnaire,
    getQuestionnaireById,
    getAllInfosQuestionnaire,
    getAllQuestionnaires,
    getAllQuestionnaireResume,
    getSectionofQuestionnaire
}