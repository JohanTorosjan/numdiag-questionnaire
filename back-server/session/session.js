import {
  numdiagPool,
  toHeroPool,
  connectToDatabase,
  executeQuery,
} from "../database/client.js";

async function createSession(questionnaireId) {
  try {
    const sectionQuery = `
            SELECT id FROM Sections WHERE questionnaire_id = $1 ORDER BY id ASC
        `;

    const section = await executeQuery(numdiagPool, sectionQuery, [
      questionnaireId,
    ]);

    if (section.length === 0) {
      return { nosections: true };
    }

    // Récupérer toutes les questions du questionnaire
    const questionsQuery = `
            SELECT q.id as question_id
            FROM Questions q
            INNER JOIN Sections s ON q.section_id = s.id
            WHERE s.questionnaire_id = $1
            ORDER BY q.id ASC
        `;

    const questions = await executeQuery(numdiagPool, questionsQuery, [
      questionnaireId,
    ]);

    // Créer le tableau answers avec toutes les questions
    const answers = questions.map((q) => ({
      questionId: q.question_id,
      reponseIds: [],
      flatReponse: null,
    }));

    const insertSessionQuery = `
            INSERT INTO Session (questionnaire_id, current_section_id, answers)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;

    const createdSession = await executeQuery(numdiagPool, insertSessionQuery, [
      questionnaireId,
      section[0].id,
      JSON.stringify(answers),
    ]);

    const questionnaireQuery = `
            SELECT id, label, description, tooltip, insight, ispublished, isactive, isfunded FROM Questionnaires WHERE id = $1
        `;

    const questionnaire = await executeQuery(numdiagPool, questionnaireQuery, [
      questionnaireId,
    ]);

    return {
      questionnaire: questionnaire,
      session: createdSession,
    };
  } catch (error) {
    console.log("erreur:", error);
    throw error;
  }
}
async function getQuestionnaireInfos(idQuestionnaire, idSession) {
  try {

    const questionnaireQuery = `
            SELECT id, label, description, tooltip, insight, ispublished, isactive, isfunded FROM Questionnaires WHERE id = $1
        `;

    const questionnaire = await executeQuery(numdiagPool, questionnaireQuery, [
      idQuestionnaire,
    ]);

    const insertSessionQuery = `
            SELECT * FROM Session WHERE id = $1
        `;

    const getSession = await executeQuery(numdiagPool, insertSessionQuery, [idSession,]);

    return {
      questionnaire: questionnaire,
      session: getSession,
    };
  } catch (error) {
    console.log("erreur:", error);
    throw error;
  }
}

async function launchSession(session_id) {
  try {
    const launchSessionQuerry = `UPDATE session SET page = 1, state = 'launched' WHERE id=${session_id}  RETURNING *`;
    const response = await executeQuery(numdiagPool, launchSessionQuerry);
    return { success: true };
  } catch {
    console.log("erreur launching");
  }
}

async function getSessionQuestionnaire(session_id) {
  // 1. Récupérer les informations de la session
  const sessionQuery = `
        SELECT
            s.id,
            s.questionnaire_id,
            s.page,
            s.state,
            s.score,
            s.current_section_id,
            s.answers
        FROM Session s
        WHERE s.id = $1
    `;

  const sessionResult = await executeQuery(numdiagPool, sessionQuery, [
    session_id,
  ]);

  if (!sessionResult || sessionResult.length === 0) {
    throw new Error("Session not found");
  }

  const session = sessionResult[0];
  const questionnaireId = session.questionnaire_id;

  // 2. Récupérer le questionnaire
  const questionnaireQuery = `
        SELECT
            id,
            label,
            description,
            code,
            version,
            insight,
            tooltip,
            isactive,
            scoremax,
            isPublished,
            isfunded,
            created_at
        FROM Questionnaires
        WHERE id = $1
    `;

  const questionnaireResult = await executeQuery(
    numdiagPool,
    questionnaireQuery,
    [questionnaireId]
  );
  const questionnaire = questionnaireResult[0];

  // 3. Récupérer toutes les sections du questionnaire
  const sectionsQuery = `
        SELECT
            id,
            questionnaire_id,
            label,
            description,
            tooltip,
            scoremax,
            nbPages,
            isactive
        FROM Sections
        WHERE questionnaire_id = $1
        ORDER BY id
    `;

  const sections = await executeQuery(numdiagPool, sectionsQuery, [
    questionnaireId,
  ]);

  // 4. Récupérer toutes les questions des sections
  const questionsQuery = `
        SELECT
            q.id,
            q.section_id,
            q.label,
            q.questionType,
            q.position,
            q.page,
            q.tooltip,
            q.coeff,
            q.mandatory
        FROM Questions q
        WHERE q.section_id = ANY($1)
        ORDER BY q.section_id, q.position
    `;

  const sectionIds = sections.map((s) => s.id);
  const questions = await executeQuery(numdiagPool, questionsQuery, [
    sectionIds,
  ]);

  // 5. Récupérer toutes les réponses des questions
  const reponsesQuery = `
        SELECT
            r.id,
            r.question_id,
            r.label,
            r.position,
            r.tooltip,
            r.plafond,
            r.recommandation,
            r.valeurScore
        FROM Reponses r
        WHERE r.question_id = ANY($1)
        ORDER BY r.question_id, r.position
    `;

  const questionIds = questions.map((q) => q.id);
  const reponses = await executeQuery(numdiagPool, reponsesQuery, [
    questionIds,
  ]);

  // 6. Récupérer les tranches de réponses si nécessaire
  const tranchesQuery = `
        SELECT
            rt.id,
            rt.question_id,
            rt.min,
            rt.max,
            rt.value,
            rt.tooltip,
            rt.plafond,
            rt.recommandation
        FROM ReponsesTranches rt
        WHERE rt.question_id = ANY($1)
        ORDER BY rt.question_id, rt.min
    `;

  const reponsesTranches = await executeQuery(numdiagPool, tranchesQuery, [
    questionIds,
  ]);

  // 7. Récupérer les dépendances de sections
  const sectionDependenciesQuery = `
        SELECT
            sd.section_id,
            sd.reponse_id,
            r.question_id
        FROM SectionDependencies sd
        JOIN Reponses r ON sd.reponse_id = r.id
        JOIN Questions q ON r.question_id = q.id
        JOIN Sections s ON q.section_id = s.id
        WHERE s.questionnaire_id = $1
    `;

  const sectionDependencies = await executeQuery(
    numdiagPool,
    sectionDependenciesQuery,
    [questionnaireId]
  );

  // 8. Récupérer les dépendances de questions
  const questionDependenciesQuery = `
        SELECT
            qd.question_id,
            qd.reponse_id,
            r.question_id as parent_question_id
        FROM QuestionDependencies qd
        JOIN Reponses r ON qd.reponse_id = r.id
        WHERE qd.question_id = ANY($1)
    `;

  const questionDependencies = await executeQuery(
    numdiagPool,
    questionDependenciesQuery,
    [questionIds]
  );

  // 9. Organiser les données hiérarchiquement
  // Grouper les réponses par question
  const reponsesByQuestion = {};
  reponses.forEach((reponse) => {
    if (!reponsesByQuestion[reponse.question_id]) {
      reponsesByQuestion[reponse.question_id] = [];
    }
    reponsesByQuestion[reponse.question_id].push(reponse);
  });

  // Grouper les tranches par question
  const tranchesByQuestion = {};
  reponsesTranches.forEach((tranche) => {
    if (!tranchesByQuestion[tranche.question_id]) {
      tranchesByQuestion[tranche.question_id] = [];
    }
    tranchesByQuestion[tranche.question_id].push(tranche);
  });

  // Attacher les réponses aux questions
  const questionsWithReponses = questions.map((question) => ({
    ...question,
    reponses: reponsesByQuestion[question.id] || [],
    reponsesTranches: tranchesByQuestion[question.id] || [],
  }));

  // Grouper les questions par section
  const questionsBySection = {};
  questionsWithReponses.forEach((question) => {
    if (!questionsBySection[question.section_id]) {
      questionsBySection[question.section_id] = [];
    }
    questionsBySection[question.section_id].push(question);
  });

  // Attacher les questions aux sections
  const sectionsWithQuestions = sections.map((section) => ({
    ...section,
    questions: questionsBySection[section.id] || [],
  }));

  // 10. Formater les dépendances
  const dependances = [
    ...sectionDependencies.map((dep) => ({
      type: "section",
      section_id: dep.section_id,
      reponse_id: dep.reponse_id,
      question_id: dep.question_id,
    })),
    ...questionDependencies.map((dep) => ({
      type: "question",
      question_id: dep.question_id,
      reponse_id: dep.reponse_id,
      parent_question_id: dep.parent_question_id,
    })),
  ];

  // 11. Construire l'objet final
  const result = {
    questionnaire: {
      ...questionnaire,
      sections: sectionsWithQuestions,
      dependances: dependances,
    },
    session: session,
  };

  return result;
}

async function updateSession(session_id, sessionData) {
  try {
    // Construire la requête UPDATE avec les champs dynamiques
    const updates = [];
    const values = [];
    let paramIndex = 1;

    // Ajouter les champs à mettre à jour
    if (sessionData.page !== undefined) {
      updates.push(`page = $${paramIndex++}`);
      values.push(sessionData.page);
    }
    if (sessionData.state !== undefined) {
      updates.push(`state = $${paramIndex++}`);
      values.push(sessionData.state);
    }
    if (sessionData.score !== undefined) {
      updates.push(`score = $${paramIndex++}`);
      values.push(sessionData.score);
    }
    if (sessionData.current_section_id !== undefined) {
      updates.push(`current_section_id = $${paramIndex++}`);
      values.push(sessionData.current_section_id);
    }
    if (sessionData.answers !== undefined) {
      updates.push(`answers = $${paramIndex++}`);
      values.push(JSON.stringify(sessionData.answers));
    }

    // Ajouter l'ID de session comme dernier paramètre
    values.push(session_id);

    // Construire et exécuter la requête
    const query = `
            UPDATE session
            SET ${updates.join(", ")}
            WHERE id = $${paramIndex}
            RETURNING *
        `;

    const result = await executeQuery(numdiagPool, query, values);

    return {
      success: true,
      data: result[0],
    };
  } catch (error) {
    console.error("ERREUR lors de la mise à jour de la session:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

async function getScore(session_id) {
  // 1. Récupérer les informations de la session
  const sessionQuery = `
        SELECT
            s.id,
            s.questionnaire_id,
            s.page,
            s.state,
            s.score,
            s.current_section_id,
            s.answers
        FROM Session s
        WHERE s.id = $1
    `;

  const sessionResult = await executeQuery(numdiagPool, sessionQuery, [
    session_id,
  ]);


  if (!sessionResult || sessionResult.length === 0) {
    throw new Error("Session not found");
  }

  const session = sessionResult[0];
  const questionnaireId = session.questionnaire_id;

  // // 2. Récupérer le questionnaire
  const questionnaireQuery = `
  SELECT
  id,
  label,
  isfunded,
  scoremax,
  created_at
  FROM Questionnaires
  WHERE id = $1
  `;

  const questionnaireResult = await executeQuery(
    numdiagPool,
    questionnaireQuery,
    [questionnaireId]
  );
  const questionnaireInfos = questionnaireResult[0];


  // 3. Récupérer toutes les sections du questionnaire
  const sectionsQuery = `
  SELECT
  id,
  questionnaire_id,
  scoremax
  FROM Sections
  WHERE questionnaire_id = $1
  ORDER BY id
  `;

  const sections = await executeQuery(numdiagPool, sectionsQuery, [
    questionnaireId,
  ]);


  // 4. Récupérer toutes les questions des sections
  const questionsQuery = `
  SELECT
  q.id,
  q.section_id,
  q.questionType,
  q.coeff,
  q.mandatory
  FROM Questions q
  WHERE q.section_id = ANY($1)
  ORDER BY q.section_id, q.position
  `;

  const sectionIds = sections.map((s) => s.id);
  const questions = await executeQuery(numdiagPool, questionsQuery, [
    sectionIds,
  ]);


  // 5. Récupérer toutes les réponses des questions
  const reponsesQuery = `
  SELECT
  r.id,
  r.question_id,
  r.plafond,
  r.recommandation,
  r.valeurScore
  FROM Reponses r
  WHERE r.question_id = ANY($1)
  ORDER BY r.question_id, r.position
  `;

  const questionIds = questions.map((q) => q.id);
  const reponses = await executeQuery(numdiagPool, reponsesQuery, [
    questionIds,
  ]);

  // 6. Récupérer les tranches de réponses si nécessaire
  const tranchesQuery = `
  SELECT
  rt.id,
  rt.question_id,
  rt.value,
  rt.plafond,
  rt.recommandation
  FROM ReponsesTranches rt
  WHERE rt.question_id = ANY($1)
  ORDER BY rt.question_id, rt.min
  `;

  const reponsesTranches = await executeQuery(numdiagPool, tranchesQuery, [
    questionIds,
  ]);

  // now need to compute score with session.answers array (questionIds; and reponse Ids in an array)
  // take all the answer as a single element in answerFlat for future computation
  const grouped = {};
  const sectionScore = {};
  session.answers.forEach((answer) => {
    // loop on array of answers to make an array of all flatten answers within a section
    if (!grouped[answer.sectionId]) {
      grouped[answer.sectionId] = [];  // property on an object, NOT an array index
    }
    if (!sectionScore[answer.sectionId]) {
      sectionScore[answer.sectionId] = {};  // property on an object, NOT an array index
    }
    answer.reponseIds.forEach((id) => {
      grouped[answer.sectionId].push({
        questionId: answer.questionId,
        answerId: id,
        answer: answer.flatReponse ? parseInt(answer.flatReponse) : null,
        type: answer.questionType,
        sectionId: answer.sectionId,
      });
    });
  });


  // scoremax = 100
  // score d'une question toujours sur 100

  let scores = [];
  for (const section in grouped) {
    let plafond = 100;
    let values=[];
    let coeffs=[];
    let recommandations=[];

    grouped[section].forEach((qAndA) => {
      let value = 0;
      let recommandation;
      if (qAndA.type === "entier") {
        // on récupère la tranche de reponse
        let tranches = reponsesTranches.filter((tranche) => tranche.id === qAndA.answerId);
        // on ajuste le plafond si nécessaire, on récupère la valeur de la tranche et la reco
        plafond = plafond > tranches[0].plafond ? tranches[0].plafond : plafond;
        value = tranches[0].value;
        recommandation = tranches[0].recommandation;
      } else if (qAndA.type === "choix_simple" || qAndA.type === "choix_multiple"){
        // les questions sont déjà mises à plat donc 1 rép par question dans tous les cas
        // on récupère les infos de la réponse
        let answers = reponses.filter((reponse) => reponse.id === qAndA.answerId);
        // on ajuste le plafond si nécessaire, on récupère la valeur de la réponse et la reco
        value = answers[0].valeurscore;
        plafond = plafond > answers[0].plafond ? answers[0].plafond : plafond;
        recommandation = answers[0].recommandation
      }
      // on calcule la valeur finale de la réponse en prenant en compte le coeff qui est dans la question
      let question = questions.filter((question) => question.id === qAndA.questionId);
      value = value * question[0].coeff;
      coeffs.push(question[0].coeff);
      values.push(value);
      recommandations.push(recommandation);

      // ATTENTION !!!!
      ///////////////////////////////////////////////////////////////////
      // RecommandationsReponses recommandation -> nvelle query ???
      // dans quel cas cette table est-elle utilisée ? à garder ?
    });
    grouped[section].plafond = plafond;

    const initialValue = 0;
    const sumValues = values.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      initialValue,
    );

    const sumCoeffs = coeffs.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      initialValue,
    );
    let score = sumValues / sumCoeffs;
    // let score = sumValues;
    sectionScore[section].score = score > plafond ? plafond : score;

    scores.push(sectionScore[section].score)
    sectionScore[section].recommandations = recommandations;

  };
  // score final : valeur de la plus petite section
  sectionScore.scoreQuestionnaire = Math.min(...scores)

  // RecommandationsQuestionnaires recommandation -> nvelle query en fonction du score au questionnaire
  const recoQuestionnaireQuery = `
  SELECT recommandation
  FROM recommandationsquestionnaires
  WHERE questionnaire_id = $1
  AND $2 BETWEEN min AND max;
  `;

  const recoQuestionnaireResult = await executeQuery(
    numdiagPool,
    recoQuestionnaireQuery,
    [questionnaireId, sectionScore.scoreQuestionnaire ]
  );
  sectionScore.recommandationQuestionnaire = recoQuestionnaireResult;

  const { scoreQuestionnaire, recommandationQuestionnaire, ...sectionsInfos } = sectionScore;

  // update la session pour un state 'finished'
  // update le score
  const updateSessionQuery = `
  UPDATE Session
  SET state = $2, score = $3
  WHERE id = $1 RETURNING *;
  `;

  const updateSessionResult = await executeQuery(
    numdiagPool,
    updateSessionQuery,
    [session_id, 'finished', sectionScore.scoreQuestionnaire ]
  );

  const scoreIdQuery = `
  SELECT
  score_id
  FROM JoinScoresQuestionnaires
  WHERE questionnaire_id = $1
  AND $2 <= scoremax AND $2 >= scoremin
  `;

  const scoreIdResult = await executeQuery(numdiagPool, scoreIdQuery, [
    questionnaireInfos.id, sectionScore.scoreQuestionnaire
  ]);

  const lettreQuery = `
  SELECT lettre from Scores WHERE id = $1`;
  const lettreResult = await executeQuery(numdiagPool, lettreQuery, [
    scoreIdResult[0].score_id,
  ]);

  const lettre= lettreResult[0].lettre;

  return {
    sectionsInfos: sectionsInfos,
    questionnaire: questionnaireInfos,
    scoreQuestionnaire: scoreQuestionnaire,
    recommandationQuestionnaire: recommandationQuestionnaire,
    lettre: lettre
};

}

async function trySessionCode({id_session, code}) {
  // Récupérer les informations de la session et le code du questionnaire
  const sessionQuery = `
        SELECT code, questionnaire_id
        FROM Session
        WHERE id = $1;
    `;

  const sessionResult = await executeQuery(numdiagPool, sessionQuery, [
    id_session,
  ]);

  if (!sessionResult || sessionResult.length === 0) {

      throw new Error("Session not found");
    }

    const session = sessionResult[0]; // first row


  const codeQuery = `
        SELECT
            code
        FROM Questionnaires
        WHERE id = $1
    `;

  const codeResult = await executeQuery(numdiagPool, codeQuery, [
    session.questionnaire_id,
  ]);


  if (codeResult[0].code != code) {
    return false
  } else {
    const sessionCodeQuery = `
        UPDATE Session
        SET code = $2
        WHERE id = $1
    `;

    const sessionCodeResult = await executeQuery(numdiagPool, sessionCodeQuery, [
      id_session, true
    ]);
  }

  const newSessionQuery = await executeQuery(numdiagPool, sessionQuery, [
    id_session,
  ]);

  if (newSessionQuery[0].code === true) {
    return { questionnaire: session.questionnaire_id, code:true }
  }

}

async function getQuestionnaireCode(id_questionnaire) {
  // Récupérer le code du questionnaire
  const codeQuery = `
        SELECT
            code
        FROM Questionnaires
        WHERE id = $1
    `;

  const codeResult = await executeQuery(numdiagPool, codeQuery, [
    id_questionnaire,
  ]);

  if (codeResult[0].code) {
    return true;
  } else {
    return false;
  }
}

export {
  createSession,
  launchSession,
  getSessionQuestionnaire,
  updateSession,
  getScore,
  trySessionCode,
  getQuestionnaireCode,
  getQuestionnaireInfos
};
