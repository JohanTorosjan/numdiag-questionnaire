
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "../../ToastSystem";

import { useNavigate } from 'react-router-dom';


async function getSessionQuestionnaire(session_id){
    try{
        const response = await fetch(`http://localhost:3008/session/questionnaire/${session_id}`);
        const data = await response.json()
        return data
    }
    catch{
        console.log("ERREUR lors du chargement")
        return{success:false}
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
            return;
        }
        setQuestionnaire(data.questionnaire);
        setSession(data.session);

    
        setIsLoading(false)
    }
        fetchSessionQuestionnaire();
    }, [session_id]);


    return(<div className="questionnaire-display">
        <div className="center">
            <QuestionnaireDisplayer/>
        </div>
    </div>)


}

export default QuestionnaireDisplay

