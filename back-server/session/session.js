import { numdiagPool, toHeroPool, connectToDatabase, executeQuery } from '../database/client.js'

async function createSession(questionnaireId) {
    try{    


        const sectionQuerry = `
            SELECT id FROM Sections WHERE questionnaire_id = $1
        `;
        
        const section = await executeQuery(
            numdiagPool, 
            sectionQuerry,
            [questionnaireId]
        );
        if(section.length==0){
            return {'nosections':true}
        }

        const insertSessionQuery = `
            INSERT INTO Session (questionnaire_id, current_section_id)
            VALUES ($1,$2)
            RETURNING *;
        `;
        const createdSession = await executeQuery(
            numdiagPool, 
            insertSessionQuery,
            [questionnaireId,section[0].id]
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

export{createSession,launchSession}