import { numdiagPool, toHeroPool, connectToDatabase, executeQuery } from '../database/client.js'

async function createSession(questionnaireId) {
    try {
        const sectionQuery = `
            SELECT id FROM Sections WHERE questionnaire_id = $1 ORDER BY id ASC
        `;

        const section = await executeQuery(
            numdiagPool,
            sectionQuery,
            [questionnaireId]
        );

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

        const questions = await executeQuery(
            numdiagPool,
            questionsQuery,
            [questionnaireId]
        );

        // Créer le tableau answers avec toutes les questions
        const answers = questions.map(q => ({
            questionId: q.question_id,
            reponseIds: [],
            flatReponse: null
        }));

        const insertSessionQuery = `
            INSERT INTO Session (questionnaire_id, current_section_id, answers)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;

        const createdSession = await executeQuery(
            numdiagPool,
            insertSessionQuery,
            [questionnaireId, section[0].id, JSON.stringify(answers)]
        );

        const questionnaireQuery = `
            SELECT * FROM Questionnaires WHERE id = $1
        `;

        const questionnaire = await executeQuery(
            numdiagPool,
            questionnaireQuery,
            [questionnaireId]
        );

        return {
            questionnaire: questionnaire,
            session: createdSession
        };
    }
    catch (error) {
        console.log('erreur:', error);
        throw error;
    }
}

async function launchSession(session_id) {
    try{
    const launchSessionQuerry =
    `UPDATE session SET page = 1, state = 'launched' WHERE id=${session_id}  RETURNING *`
    const response = await executeQuery(numdiagPool,launchSessionQuerry)
    console.log(response)
    return {success:true}
    }
catch{
    console.log('erreur launching')

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

    const sessionResult = await executeQuery(numdiagPool, sessionQuery, [session_id]);

    if (!sessionResult || sessionResult.length === 0) {
        throw new Error('Session not found');
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
            created_at
        FROM Questionnaires
        WHERE id = $1
    `;

    const questionnaireResult = await executeQuery(numdiagPool, questionnaireQuery, [questionnaireId]);
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

    const sections = await executeQuery(numdiagPool, sectionsQuery, [questionnaireId]);

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
            q.theme,
            q.mandatory,
            q.public_cible
        FROM Questions q
        WHERE q.section_id = ANY($1)
        ORDER BY q.section_id, q.position
    `;

    const sectionIds = sections.map(s => s.id);
    const questions = await executeQuery(numdiagPool, questionsQuery, [sectionIds]);

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

    const questionIds = questions.map(q => q.id);
    const reponses = await executeQuery(numdiagPool, reponsesQuery, [questionIds]);

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

    const reponsesTranches = await executeQuery(numdiagPool, tranchesQuery, [questionIds]);

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

    const sectionDependencies = await executeQuery(numdiagPool, sectionDependenciesQuery, [questionnaireId]);

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

    const questionDependencies = await executeQuery(numdiagPool, questionDependenciesQuery, [questionIds]);

    // 9. Organiser les données hiérarchiquement
    // Grouper les réponses par question
    const reponsesByQuestion = {};
    reponses.forEach(reponse => {
        if (!reponsesByQuestion[reponse.question_id]) {
            reponsesByQuestion[reponse.question_id] = [];
        }
        reponsesByQuestion[reponse.question_id].push(reponse);
    });

    // Grouper les tranches par question
    const tranchesByQuestion = {};
    reponsesTranches.forEach(tranche => {
        if (!tranchesByQuestion[tranche.question_id]) {
            tranchesByQuestion[tranche.question_id] = [];
        }
        tranchesByQuestion[tranche.question_id].push(tranche);
    });

    // Attacher les réponses aux questions
    const questionsWithReponses = questions.map(question => ({
        ...question,
        reponses: reponsesByQuestion[question.id] || [],
        reponsesTranches: tranchesByQuestion[question.id] || []
    }));

    // Grouper les questions par section
    const questionsBySection = {};
    questionsWithReponses.forEach(question => {
        if (!questionsBySection[question.section_id]) {
            questionsBySection[question.section_id] = [];
        }
        questionsBySection[question.section_id].push(question);
    });

    // Attacher les questions aux sections
    const sectionsWithQuestions = sections.map(section => ({
        ...section,
        questions: questionsBySection[section.id] || []
    }));

    // 10. Formater les dépendances
    const dependances = [
        ...sectionDependencies.map(dep => ({
            type: 'section',
            section_id: dep.section_id,
            reponse_id: dep.reponse_id,
            question_id: dep.question_id
        })),
        ...questionDependencies.map(dep => ({
            type: 'question',
            question_id: dep.question_id,
            reponse_id: dep.reponse_id,
            parent_question_id: dep.parent_question_id
        }))
    ];

    // 11. Construire l'objet final
    const result = {
        questionnaire: {
            ...questionnaire,
            sections: sectionsWithQuestions,
            dependances: dependances
        },
        session: session
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
            SET ${updates.join(', ')}
            WHERE id = $${paramIndex}
            RETURNING *
        `;

        const result = await executeQuery(numdiagPool, query, values);

        return {
            success: true,
            data: result[0]
        };

    } catch (error) {
        console.error("ERREUR lors de la mise à jour de la session:", error);
        return {
            success: false,
            error: error.message
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

    const sessionResult = await executeQuery(numdiagPool, sessionQuery, [session_id]);

    if (!sessionResult || sessionResult.length === 0) {
        throw new Error('Session not found');
    }

    const session = sessionResult[0];
    const questionnaireId = session.questionnaire_id;

    // // 2. Récupérer le questionnaire
    const questionnaireQuery = `
        SELECT
            id,
            scoremax,
            created_at
        FROM Questionnaires
        WHERE id = $1
    `;

    const questionnaireResult = await executeQuery(numdiagPool, questionnaireQuery, [questionnaireId]);
    const questionnaire = questionnaireResult[0];

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

    const sections = await executeQuery(numdiagPool, sectionsQuery, [questionnaireId]);

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

    const sectionIds = sections.map(s => s.id);
    const questions = await executeQuery(numdiagPool, questionsQuery, [sectionIds]);

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

    const questionIds = questions.map(q => q.id);
    const reponses = await executeQuery(numdiagPool, reponsesQuery, [questionIds]);

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

    const reponsesTranches = await executeQuery(numdiagPool, tranchesQuery, [questionIds]);

    // // 7. Récupérer les dépendances de sections
    // const sectionDependenciesQuery = `
    //     SELECT
    //         sd.section_id,
    //         sd.reponse_id,
    //         r.question_id
    //     FROM SectionDependencies sd
    //     JOIN Reponses r ON sd.reponse_id = r.id
    //     JOIN Questions q ON r.question_id = q.id
    //     JOIN Sections s ON q.section_id = s.id
    //     WHERE s.questionnaire_id = $1
    // `;

    // const sectionDependencies = await executeQuery(numdiagPool, sectionDependenciesQuery, [questionnaireId]);

    // // 8. Récupérer les dépendances de questions
    // const questionDependenciesQuery = `
    //     SELECT
    //         qd.question_id,
    //         qd.reponse_id,
    //         r.question_id as parent_question_id
    //     FROM QuestionDependencies qd
    //     JOIN Reponses r ON qd.reponse_id = r.id
    //     WHERE qd.question_id = ANY($1)
    // `;

    // const questionDependencies = await executeQuery(numdiagPool, questionDependenciesQuery, [questionIds]);

    // 9. Organiser les données hiérarchiquement
    // Grouper les réponses par question
    const reponsesByQuestion = {};
    reponses.forEach(reponse => {
        if (!reponsesByQuestion[reponse.question_id]) {
            reponsesByQuestion[reponse.question_id] = [];
        }
        reponsesByQuestion[reponse.question_id].push(reponse);
    });

    // Grouper les tranches par question
    const tranchesByQuestion = {};
    reponsesTranches.forEach(tranche => {
        if (!tranchesByQuestion[tranche.question_id]) {
            tranchesByQuestion[tranche.question_id] = [];
        }
        tranchesByQuestion[tranche.question_id].push(tranche);
    });

    // Attacher les réponses aux questions
    const questionsWithReponses = questions.map(question => ({
        ...question,
        reponses: reponsesByQuestion[question.id] || [],
        reponsesTranches: tranchesByQuestion[question.id] || []
    }));

    // Grouper les questions par section
    const questionsBySection = {};
    questionsWithReponses.forEach(question => {
        if (!questionsBySection[question.section_id]) {
            questionsBySection[question.section_id] = [];
        }
        questionsBySection[question.section_id].push(question);
    });

    // Attacher les questions aux sections
    const sectionsWithQuestions = sections.map(section => ({
        ...section,
        questions: questionsBySection[section.id] || []
    }));

    // // 10. Formater les dépendances
    // const dependances = [
    //     ...sectionDependencies.map(dep => ({
    //         type: 'section',
    //         section_id: dep.section_id,
    //         reponse_id: dep.reponse_id,
    //         question_id: dep.question_id
    //     })),
    //     ...questionDependencies.map(dep => ({
    //         type: 'question',
    //         question_id: dep.question_id,
    //         reponse_id: dep.reponse_id,
    //         parent_question_id: dep.parent_question_id
    //     }))
    // ];

    // 11. Construire l'objet final
    const result = {
        questionnaire: {
            ...questionnaire,
            sections: sectionsWithQuestions,
        },
        session: session
    };

    console.log(session.answers)

    // now need to compute score with session.answers array (questionIds; and reponse Ids in an array)
    // and questionnaire.scoremax - questionnaire.sections.scoremax - questionnaire.sections.questions array
    // in questionnaire.sections.questions array: questionnaire.sections.questions.coeff -
    // if questionnaire.sections.questions.questiontype == "choix multiple" -> can take multiple responses
    // if questionnaire.sections.questions.questiontype == "entier" -> tranche reponse + plafond
    // in questionnaire.sections.questions.reponses array : take into account plafond
    // match session.answers reponse ids with questionnaire.sections.questions.reponses ids


    // recommandations :
    // Reponses recommandation -> questionnaire.sections.questions.reponses[x].recommandation
    // ReponsesTranches recommandation questionnaire.sections.questions.reponsesTranches[x].plafond
    // RecommandationsReponses recommandation -> nvelle query
    // RecommandationsQuestionnaires recommandation -> nvelle query en fonction du score au questionnaire


    return result;
}

export{createSession,launchSession,getSessionQuestionnaire,updateSession, getScore}
