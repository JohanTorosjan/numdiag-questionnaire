import { numdiagPool, executeQuery } from '../database/client.js'

  function updateScore(scoreId, lettre= null, scoremin= null, scoremax = null) {
    console.log(scoremin)
    const fields = [];
    const values = [];
    let index = 1;

    if (lettre !== null && lettre!=='') {
      executeQuery(numdiagPool,`
            INSERT INTO Scores (lettre)
            VALUES ($1)
            ON CONFLICT (lettre) DO UPDATE
            SET lettre = EXCLUDED.lettre
            RETURNING id;`, [lettre])
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

    return executeQuery(numdiagPool, `UPDATE Scores SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`, values)

  }

  async function getAllScores(idQuestionnaire) {
    const scoreIds = await executeQuery(numdiagPool, 'SELECT score_id, scoremax, scoremin FROM JoinScoresQuestionnaires WHERE questionnaire_id = $1', [idQuestionnaire]);
    const scores=[];
    for (const scoreId of scoreIds) {
      const score = await executeQuery(numdiagPool,
        'SELECT lettre FROM Scores WHERE id = $1',
        [scoreId.score_id]
      )
      scores.push({lettre: score[0].lettre, scoremin: scoreId.scoremin, scoremax: scoreId.scoremax,})
    }
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
            RETURNING *
            `,
          [ score, idQuestionnaire, defaultMaxValues[index], defaultMinValues[index] ])
      results.push(result)
    })
    return {success: true}
  }

  async function deleteScore(idScore) {
    const deletedScore = await executeQuery(numdiagPool, 'DELETE FROM Scores WHERE id = $1', [idScore]);
    console.log(deletedScore)
    const deletedJoinScoreQuestionnaire = await executeQuery(numdiagPool, 'DELETE FROM JoinScoresQuestionnaires WHERE score_id = $1', [idScore])
    return (deletedScore, deletedJoinScoreQuestionnaire)
}

export {updateScore, getAllScores, createScore, deleteScore }
