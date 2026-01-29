import { numdiagPool, executeQuery } from '../database/client.js'

  function updateScore(questionnaire_id, score= null, min= null, max = null) {
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

  async function getAllScores(idQuestionnaire) {
    const scores = await executeQuery(numdiagPool, 'SELECT score_id FROM JoinScoresQuestionnaires WHERE questionnaire_id = $1', [idQuestionnaire])
    console.log("Scores:", scores)

  }

  async function createScore(idQuestionnaire) {
    const defaultScoresIds = [1, 2, 3]
    const scoresQuery = `SELECT id, lettre, scoremax, scoremin
                          FROM scores
                          WHERE id = ANY($1)`

    const selectDefault = await executeQuery(
          numdiagPool,
          scoresQuery,
          [defaultScoresIds]
        );

    for (const score of defaultScoresIds) {
      const result = await executeQuery(
          numdiagPool,
          `INSERT INTO JoinScoresQuestionnaires  (
            score_id, questionnaire_id
            )
            VALUES ($1, $2)
            RETURNING *
            `,
            [ score, idQuestionnaire ])
    }
    return {scores: selectDefault}
  }

export {updateScore, getAllScores, createScore }
