import { numdiagPool, toHeroPool, connectToDatabase, executeQuery } from '../database/client.js'

// function addReponse(idReponse, idQuestion, idSection, label, position, tooltip) {
//     return executeQuery(numdiagPool, 'INSERT INTO reponses (id_reponse, id_question, id_section, label, position, tooltip) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [idReponse, idQuestion, idSection, label, position, tooltip])
// }

function getReponseById(idReponse) {
    return executeQuery(numdiagPool, 'SELECT * FROM reponses WHERE id_reponse = $1', [idReponse])
}

function deleteSingleReponse(idReponse) {
    return executeQuery(numdiagPool, 'DELETE FROM reponses WHERE id = $1 RETURNING *', [idReponse])
}

function updateReponse(idReponse, label, tooltip, plafond, recommandation, critique, valeurScore) {
    console.log('--------')
        console.log(valeurScore)
    return executeQuery(
        numdiagPool,
        'UPDATE reponses SET label = $1, tooltip = $2, plafond = $3, recommandation = $4, valeurScore = $5, critique=$6 WHERE id = $7 RETURNING *',
        [label, tooltip, plafond, recommandation, valeurScore, critique, idReponse]
    )
}


async function createReponse(  {question_id,
    label,
    tooltip,
    plafond,
    recommandation,
    critique,
    position,
    valeurScore}){
    console.log('--------')
    console.log(valeurScore)
        try{
    const insertReponseQuery = `
            INSERT INTO Reponses (
                question_id,
                label,
                tooltip,
                plafond,
                recommandation,
                valeurScore,
                position,
                critique
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `;

        const result = await executeQuery(
            numdiagPool,
            insertReponseQuery,
            [
                question_id,
                label,
                tooltip || null,
                plafond || 0,
                recommandation || null,
                valeurScore || 0,
                position,
                critique || 0
            ]
        );

        await numdiagPool.query('COMMIT');

               return {
            success: true,
            reponse: result[0]
        };

    } catch (error) {
        await numdiagPool.query('ROLLBACK');
        console.error('Erreur lors de la création de la réponse:', error);
        throw error;
    }

}




export {
    // addReponse,
    getReponseById,
    deleteSingleReponse,
    updateReponse,
    createReponse
}
