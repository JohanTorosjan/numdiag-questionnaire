import { numdiagPool, executeQuery } from '../database/client.js'

  function createScore(questionnaire_id, score= null, min= null, max = null) {
    const fields = [];
    const placeholders=[];
    const values = [];
    let index = 1;

    if (score !== null && score!=='') {
      fields.push(`lettre`);
      placeholders.push(`$${index++}`);
      values.push(score);
    }
    if (min !== null && min!=='') {
      fields.push(`min`);
      placeholders.push(`$${index++}`);
      values.push(min);
    }

    if (max !== null && max!=='') {
      fields.push(`max`);
      placeholders.push(`$${index++}`);
      values.push(max);
    }

    fields.push(`questionnaire_id`);
    placeholders.push(`$${index++}`);
    values.push(questionnaire_id);

     return executeQuery(
        numdiagPool,
        `INSERT INTO Scores (${fields.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING *`,
        values
    );


  }

  function getAllScores(idQuestionnaire) {
    return executeQuery(numdiagPool, 'SELECT * FROM scores WHERE questionnaire_id = $1', [idQuestionnaire])
  }

export {createScore }
