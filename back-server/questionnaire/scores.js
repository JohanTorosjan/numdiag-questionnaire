import { numdiagPool, executeQuery } from '../database/client.js'

  async function updateScore({questionnaireId, scoreId, lettre= null, scoremin= null, scoremax = null}) {
    console.log(scoremin)
    const fields = [];
    const values = [];
    let index = 1;
    let newScoreId = undefined;

    if (lettre !== null && lettre!=='') {
      const result = await executeQuery(numdiagPool,`
        INSERT INTO Scores (lettre)
        VALUES ($1)
        ON CONFLICT (lettre) DO UPDATE
        SET lettre = EXCLUDED.lettre
        RETURNING id;`, [lettre]);
      newScoreId = result[0].id;
      fields.push(`score_id = $${index++}`);
      values.push(newScoreId);
    }
    
    if (scoremin !== null && scoremin!=='') {
      fields.push(`scoremin = $${index++}`);
      values.push(scoremin);
    }

    if (scoremax !== null && scoremax!=='') {
      fields.push(`scoremax = $${index++}`);
      values.push(scoremax);
    }
    values.push(scoreId);
    values.push(parseInt(questionnaireId));

    return executeQuery(numdiagPool, `UPDATE JoinScoresQuestionnaires SET ${fields.join(', ')} WHERE score_id = $${index} AND questionnaire_id=$${index+1} RETURNING *`, values)

  }

  async function getAllScores(idQuestionnaire) {
    const scoreIds = await executeQuery(numdiagPool, 'SELECT * FROM JoinScoresQuestionnaires WHERE questionnaire_id = $1 ORDER BY scoremin;', [idQuestionnaire]);
    const scores=[];
    for (const scoreId of scoreIds) {
      const score = await executeQuery(numdiagPool,
        'SELECT lettre FROM Scores WHERE id = $1',
        [scoreId.score_id]
      )
      scores.push({lettre: score[0].lettre, scoremin: scoreId.scoremin, scoremax: scoreId.scoremax, score_id: scoreId.score_id})
    }
    console.log(scoreIds)
    return scores;
  }

  async function createScore(idQuestionnaire) {
    const defaultScoresIds = [1, 2, 3];
    const defaultMaxValues = [33, 66, 100];
    const defaultMinValues = [0, 34, 67];
    const results = []

    defaultScoresIds.forEach(async(score, index) => {
      const result = await executeQuery(
          numdiagPool,
          `INSERT INTO JoinScoresQuestionnaires  (
            score_id, questionnaire_id, scoremax, scoremin
            )
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (questionnaire_id, score_id) DO NOTHING
            RETURNING *
            `,
          [ score, idQuestionnaire, defaultMaxValues[index], defaultMinValues[index] ])
      results.push(result)
    })
    return {success: true}
  }

  async function createNewScore(score, questionnaireId) {
    console.log(score);
    console.log(questionnaireId);
    const fields = [];
    const values = [];
    let index = 1;
    if (score.lettre !== null && score.lettre!=='') {
      const result = await executeQuery(numdiagPool,`
        INSERT INTO Scores (lettre)
        VALUES ($1)
        ON CONFLICT (lettre) DO UPDATE
        SET lettre = EXCLUDED.lettre
        RETURNING id;`, [score.lettre]);
        const newScoreId = result[0].id;



      if (score.scoremin !== null && score.scoremin!=='') {
      fields.push(`scoremin`);
      values.push(score.scoremin);
      }

      if (score.scoremax !== null && score.scoremax!=='') {
        fields.push(`scoremax`);
        values.push(score.scoremax);
      }
      fields.push('score_id')
      values.push(newScoreId);
      fields.push('questionnaire_id');
      values.push(parseInt(questionnaireId));

    return executeQuery(numdiagPool, `INSERT INTO JoinScoresQuestionnaires (${fields.join(', ')}) VALUES ($1, $2, $3, $4) ON CONFLICT (questionnaire_id, score_id) DO NOTHING RETURNING *`, values)

    } else {
      return {success: false}
    }
  }

  async function deleteScore(idScore, idQuestionnaire) {
    const deletedJoinScoreQuestionnaire = await executeQuery(numdiagPool, 'DELETE FROM JoinScoresQuestionnaires WHERE score_id = $1 AND questionnaire_id = $2', [idScore, idQuestionnaire])
    return (deletedJoinScoreQuestionnaire)
}

export {updateScore, getAllScores, createScore, deleteScore, createNewScore }
