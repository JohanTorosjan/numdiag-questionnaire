
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "../../ToastSystem";

import { useNavigate } from 'react-router-dom';



function QuestionnaireDisplayer(){
    const navigate = useNavigate();
    const { session_id } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [questionnaire, setQuestionnaire] = useState(null);
    const [session, setSession] = useState(null);
    const toast = useToast();

    


    return(<div className="questionnaire-displayer">
        ENCORE COUCOU 
    </div>)
}

export default QuestionnaireDisplayer