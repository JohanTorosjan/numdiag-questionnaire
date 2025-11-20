
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "../../ToastSystem";

import { useNavigate } from 'react-router-dom';



async function createSession(idQuestionnaire) {

  try {
    const response = await fetch(`http://localhost:3008/session/${idQuestionnaire}`, {
            method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              }
              });
    if (!response.ok) {
      throw new Error("Erreur lors de la création des sessions");
    }
    const data = await response.json();
    console.log("Session : ", data);
    return data.data;
  } catch (error) {
    console.error("Error creating session:", error);
    return null;
  }
}



function Session(){
    const navigate = useNavigate();
    const { questionnaire_id } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [questionnaire, setQuestionnaire] = useState(null);
    const [session, setSession] = useState(null);
    const [existingSessionId, setExistingSessionId] = useState(null);

    const toast = useToast();

  useEffect(() => {



    async function fetchCreateSession() {
        setIsLoading(true)

        const data = await createSession(questionnaire_id);
        console.log(data.questionnaire)
        setQuestionnaire(data.questionnaire[0]);
        setSession(data.session[0]);
        const storedSession = localStorage.getItem("session_id");
        const storedQuestionnaire = localStorage.getItem("questionnaire_id");

        console.log(data.questionnaire[0].id)
        if (storedSession && storedQuestionnaire==data.questionnaire[0].id) {
          setExistingSessionId(storedSession);
        }

    
        setIsLoading(false)
    }
    
        fetchCreateSession();
    }, [questionnaire_id]);


  
    const handleGoToQuestionnaireClick = async() =>{

        const response = await fetch(`http://127.0.0.1:3008/session/start/${session.id}`, {         
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
        }})
        
        const data = await response.json()
        if(data.success){
            localStorage.setItem('session_id',session.id)
            localStorage.setItem('questionnaire_id',questionnaire.id)
            navigate(`/session/questionnaire/${session.id}`)
        }
        else{
            toast.showError('Erreur lors de la création du questionnaire');

        }
    }

    if (isLoading) return <div>Chargement...</div>;

    if (!questionnaire) return <div>Café</div>;

    return (
    <div className="Session">
      
        <div className="questionnaires-infos">
            {questionnaire.label}
            {questionnaire.description}
            {questionnaire.tooltip}
            {questionnaire.insight}
        </div>


    {existingSessionId ? (
            <div className="questionnaires-start-buttons">

              <button
        onClick={() => navigate(`/session/questionnaire/${existingSessionId}`)}
        className="btn-go-to-questionnaire"
      >
        Continuer le questionnaire
      </button>
            <button
        onClick={handleGoToQuestionnaireClick}
        className="btn-go-to-questionnaire"
      >
        Commencer un nouveau questionnaire
      </button>
        </div>

    ) : (
            <div className="questionnaires-start-buttons">

      <button
        onClick={handleGoToQuestionnaireClick}
        className="btn-go-to-questionnaire"
      >
        Lancer le questionnaire
      </button>
      </div>
    )}
            
    </div>
    );


}

export default Session;
