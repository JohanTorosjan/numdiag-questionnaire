import { numdiagPool, executeQuery } from '../database/client.js'

  function updateScore(scoreId, lettre= null, scoremin= null, scoremax = null) {
    console.log(scoremin)
    const fields = [];
    const values = [];
    let index = 1;

    if (lettre !== null && lettre!=='') {
      fields.push(`lettre = $${index++}`);
      values.push(lettre);
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
    const scoreIds = await executeQuery(numdiagPool, 'SELECT score_id FROM JoinScoresQuestionnaires WHERE questionnaire_id = $1', [idQuestionnaire]);
    const scores=[];
    for (const scoreId of scoreIds) {
      const score = await executeQuery(numdiagPool,
        'SELECT * FROM Scores WHERE id = $1',
        [scoreId.score_id]
      )
      scores.push(score[0])
    }
    return scores;
  }

  async function defaultScores() {
    const scoresQuery = `SELECT id, lettre, scoremax, scoremin
                          FROM scores
                          ORDER BY id ASC
                          LIMIT 3;`

    const defaultScores = await executeQuery(
          numdiagPool,
          scoresQuery
        );
    console.log(defaultScores)
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

  async function deleteScore(idScore) {
    const deletedScore = await executeQuery(numdiagPool, 'DELETE FROM Scores WHERE id = $1', [idScore]);
    console.log(deletedScore)
    const deletedJoinScoreQuestionnaire = await executeQuery(numdiagPool, 'DELETE FROM JoinScoresQuestionnaires WHERE score_id = $1', [idScore])
    return (deletedScore, deletedJoinScoreQuestionnaire)
}

export {updateScore, getAllScores, createScore, deleteScore, defaultScores }
