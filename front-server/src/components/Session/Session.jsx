
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "../../ToastSystem";




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

    const { questionnaire_id } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [questionnaire, setQuestionnaire] = useState(null);
    const [session, setSession] = useState(null);

  useEffect(() => {
    async function fetchCreateSession() {
        setIsLoading(true)

        const data = await createSession(questionnaire_id);
        console.log(data.questionnaire)
        setQuestionnaire(data.questionnaire[0]);
        setSession(data.session[0]);

    
        setIsLoading(false)
    }
    
    fetchCreateSession();
  }, [questionnaire_id]);


  
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

        
        
        
    </div>
    );


}

export default Session;
