
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
    <div className="Session px-5 w-full h-full relative grid grid-rows-[auto_1fr_auto] pb-10">

        <div className="questionnaires-infos mt-0 w-full py-10 mx-auto self-start">
          <div className="md:w-2/3 w-full mx-auto border border-gray-200 px-6 py-2 rounded-xl shadow">
            <h1 className="text-xl font-semibold tracking-wide">{questionnaire.label}</h1>
            <div className="w-fit">
              <hr className="text-indigo-400/50 mt-3 mb-2"/>
              <h2 className="text-lg text-justify">{questionnaire.description}</h2>
            </div>
          </div>
        </div>
        <div className="questionnaires-infos w-full mx-auto self-start">
          <div className="md:w-1/2 flex flex-nowrap gap-x-10 mx-auto w-full justify-center items-stretch px-3 py-2">
            <p className="text-lg font-light text-wrap max-w-1/2.2 text-justify">{questionnaire.tooltip}</p>
            <div className="w-0.5 bg-gray-300"></div>
            <p className="text-lg font-light text-wrap max-w-1/2.2 text-justify">{questionnaire.insight}</p>
          </div>
        </div>


    {existingSessionId ? (
            <div className="questionnaires-start-buttons self-center md:w-2/3 w-full mx-auto grid grid-cols-[3fr_1fr_3fr] md:grid-cols-[minmax(300px,3fr)_minmax(20px,1fr)_minmax(300px,3fr)]">

      <button
        onClick={() => navigate(`/session/questionnaire/${existingSessionId}`)}
        className="btn-go-to-questionnaire self-center justify-self-start px-4 py-2 bg-indigo-500 rounded text-white w-fit md:w-[210px]"
      >
        Continuer le questionnaire précédent
      </button>
      <img src="/images/way.svg" className="h-9 w-9 mt-4 self-center md:self-start justify-self-center" alt="" />
      <button
        onClick={handleGoToQuestionnaireClick}
        className="btn-go-to-questionnaire self-center justify-self-end px-4 py-2 bg-indigo-500 rounded text-white w-fit md:w-[210px] text-wrap"
      >
        Commencer un nouveau questionnaire
      </button>
      </div>

    ) : (
            <div className="questionnaires-start-buttons w-full flex flex-col justify-center flex-nowrap">

      <button
        onClick={handleGoToQuestionnaireClick}
        className="btn-go-to-questionnaire px-4 py-2 bg-indigo-500 rounded text-white w-fit mx-auto"
      >
        Lancer le questionnaire
      </button>
        <img src="/images/rocket.svg" className="h-7 w-7 mt-4 self-center" alt="" />
      </div>
    )}

    </div>
    );


}

export default Session;
