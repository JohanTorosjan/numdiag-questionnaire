import { numdiagPool, executeQuery } from '../database/client.js'

function createReco(questionnaire_id, recommandation= null, min= null, max = null) {
    const fields = [];
    const placeholders=[];
    const values = [];
    let index = 1;

    if (recommandation !== null && recommandation!=='') {
      fields.push(`recommandation`);
      placeholders.push(`$${index++}`);
      values.push(recommandation);
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
        `INSERT INTO RecommandationsQuestionnaires (${fields.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING *`,
        values
    );
}

export {createReco}
