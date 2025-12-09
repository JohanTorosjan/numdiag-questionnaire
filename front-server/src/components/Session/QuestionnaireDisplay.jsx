import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "../../ToastSystem";
import { useNavigate } from 'react-router-dom';
import QuestionnaireDisplayer from "./QuestionnaireDisplayer.jsx";

async function getSessionQuestionnaire(session_id){
    try{
        const response = await fetch(`http://localhost:3008/session/questionnaire/${session_id}`);
        const data = await response.json()
        return data
    }
    catch{
        console.log("ERREUR lors du chargement")
        return {success: false}
    }
}

async function updateSession(session_id, sessionData){
    try{

        console.log(sessionData)
        const response = await fetch(`http://localhost:3008/session/${session_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(sessionData)
        });
        const data = await response.json()
        console.log(data)
        return data
    }
    catch(error){
        console.log("ERREUR lors de la mise à jour", error)
        return {success: false}
    }
}

function QuestionnaireDisplay(){
    const navigate = useNavigate();
    const { session_id } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [questionnaire, setQuestionnaire] = useState(null);
    const [session, setSession] = useState(null);
    const toast = useToast();

    useEffect(() => {

        async function fetchSessionQuestionnaire() {
            setIsLoading(true)

            const data = await getSessionQuestionnaire(session_id);
            if(!data.success){
                toast.showError('Erreur lors du chargement')
                setIsLoading(false)
                return;
            }
            console.log(data.data.questionnaire.id)
            if(localStorage.getItem('session_id')!= session_id){
            navigate(`/session/${data.data.questionnaire.id}`)
            }
            setQuestionnaire(data.data.questionnaire);
            setSession(data.data.session);

            setIsLoading(false)
        }
        fetchSessionQuestionnaire();
    }, [session_id]);

    // Gérer la mise à jour de la session
    const handleSessionUpdate = async (updatedSession) => {
        console.log(updatedSession)

        //
        setSession(updatedSession);
       // debugger
        const result = await updateSession(session_id, updatedSession);
        if (!result.success) {
            toast.showError('Erreur lors de la sauvegarde');
        }
    };


    if (!questionnaire || !session ) {
      return (<div className="flex justify-center items-center min-h-screen">
                <div className="text-lg">Le questionnaire n'est plus disponible</div>
            </div>);
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg">Chargement...</div>
            </div>
        );
    }

    return (
        <div className="w-screen h-screen text-lg">
            <QuestionnaireDisplayer
                questionnaire={questionnaire}
                session={session}
                onSessionUpdate={handleSessionUpdate}
            />

            {/* Debug : Afficher les réponses (à retirer en production) */}
            {/* {session.answers && session.answers.length > 0 && (
                <div className="mt-8 p-4 bg-gray-100 rounded">
                    <h3 className="font-bold mb-2">Réponses actuelles :</h3>
                    <pre className="text-xs overflow-auto">
                        {JSON.stringify(session.answers, null, 2)}
                    </pre>
                </div>
            )} */}
        </div>
    )
}

export default QuestionnaireDisplay
