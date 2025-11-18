import { numdiagPool, toHeroPool, connectToDatabase, executeQuery } from '../database/client.js'

async function createSession(questionnaireId) {
    try{
        const insertSessionQuery = `
            INSERT INTO Session (questionnaire_id)
            VALUES ($1)
            RETURNING *;
        `;
        const createdSession = await executeQuery(
            numdiagPool, 
            insertSessionQuery,
            [questionnaireId]
        );

        const questionnaireQuerry = `
            SELECT * FROM QUESTIONNAIRES WHERE id = $1
        `;
        
        const questionnaire = await executeQuery(
            numdiagPool, 
            questionnaireQuerry,
            [questionnaireId]
        );

        return {
            questionnaire:questionnaire,
            session:createdSession
        }
    } 
    catch{
        console.log('erreur')
    }


}


export{createSession}