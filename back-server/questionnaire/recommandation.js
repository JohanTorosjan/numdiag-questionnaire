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


function getAllReco(idQuestionnaire) {
    return executeQuery(numdiagPool, 'SELECT * FROM RecommandationsQuestionnaires WHERE questionnaire_id = $1', [idQuestionnaire])
}


function updateReco(idReco, {recommandation= null, min= null, max  = null}) {
    const fields = []
    const values = []
    let index = 1

    if (recommandation !== null) {
        fields.push(`recommandation = $${index++}`)
        values.push(recommandation)
    }
    if (min !== null) {
        fields.push(`min = $${index++}`)
        values.push(min)
    }
    if (max !== null) {
        fields.push(`max = $${index++}`)
        values.push(max)
    }
    // fields.push(`id = $${index}`)
    values.push(idReco)


    return executeQuery(numdiagPool, `UPDATE RecommandationsQuestionnaires SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`, values)
}

export {createReco, getAllReco, updateReco}
