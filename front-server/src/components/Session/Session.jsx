import './session.css'
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "../../ToastSystem";
import DocumentTitle from '../hooks/documentTitle';
import { useNavigate } from 'react-router-dom';



async function createSession(idQuestionnaire) {

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/session/${idQuestionnaire}`, {
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

async function getInfos(idQuestionnaire, idSession) {
  try {

    const response = await fetch(`${import.meta.env.VITE_API_URL}/sessionStorage`, {
            method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  idQuestionnaire: idQuestionnaire,
                  idSession: idSession
                }),
              });
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des infos de session");
    }
    const data = await response.json();
    console.log("Session récupérée : ", data);
    return data.data;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

async function codeQuestionnaire(idQuestionnaire) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/code/${idQuestionnaire}`);
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération du code du questionnaire");
    }
    const data = await response.json();
    console.log("Code :", data);
    return data.data
  } catch (error) {
    console.error("Error getting questionnaire code:", error);
    return null;
  }
}



function Session(){
    const navigate = useNavigate();
    const { questionnaire_id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [questionnaire, setQuestionnaire] = useState(null);
    const [session, setSession] = useState(null);
    const [existingSessionId, setExistingSessionId] = useState(null);
    const [code, setCode] = useState(false)
    const [sessionCode, setSessionCode] = useState("")
    const [errorCode, setErrorCode]= useState(false)
    const toast = useToast();


  useEffect(() => {
      fetchCreateSession();
    }, [questionnaire_id]);


    useEffect(() => {
    async function fetchCodeQuestionnaire() {
      console.log("Questionnaire:", questionnaire)
    if (questionnaire) {
        document.title = `Numdiag - ${questionnaire.label}`;
        const data = await codeQuestionnaire(questionnaire.id);
        console.log("Code for React state:", data)
        console.log("Session:", session)

        if (data) {
            const testCode = await codeForSession({session_id: session.id,
            code: session.code})
            if (testCode) {
              setCode(true)
            }
        } else {
          setCode(true)
        }
    }
  }
  fetchCodeQuestionnaire()
    }, [questionnaire, session]);

    useEffect(() => {
    if (questionnaire) {
      setIsLoading(false)
    } else {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000); // Wait 1 second before showing error
    }
  }, [questionnaire_id])



  async function fetchCreateSession() {
      if (existingSessionId) {
        return;
      }

      try {

        const storedSession = sessionStorage.getItem("session_id");
        const storedQuestionnaire = sessionStorage.getItem("questionnaire_id");

        if (storedSession && storedQuestionnaire) {
          setExistingSessionId(true);
          console.log("Stored Session", storedSession)
          console.log("Stored Questionnaire", storedQuestionnaire)
          const data = await getInfos(storedQuestionnaire, storedSession)
          setQuestionnaire(data.questionnaire[0]);
          setSession(data.session[0]);
          return
        }

        const data = await createSession(questionnaire_id);
        setQuestionnaire(data.questionnaire[0]);
        setSession(data.session[0]);
        sessionStorage.setItem('session_id',session.id)
        sessionStorage.setItem('questionnaire_id',questionnaire.id)
        // }
      } catch (error) {
      console.error(error);
      } // Wait 1 second before showing error

    }

  async function codeForSession({session_id, code, isUserSubmit = false}) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/sessioncode/${session_id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code
          }),
        });
      if (!response.ok) {
        throw new Error("Erreur lors du traitement du code");
      }
      const data = await response.json();
      console.log("Code validation : ", data);
      if (data.data.code === true) {
        setCode(true)
      } else if (data.data.code != true && isUserSubmit) {
        setErrorCode(true)
        toast.showError("Ce n'est pas le bon code")
      }
      return data.data;
    } catch (error) {
      console.error("Error sending code:", error);
      toast.showError("Problème lors de l'envoi du code")
      return null;
    }
  }

    const handleGoToQuestionnaireClick = async () =>{
      try {

        const data = await createSession(questionnaire_id);
        sessionStorage.clear();
        setQuestionnaire(data.questionnaire[0]);
        setSession(data.session[0]);
        sessionStorage.setItem('session_id',data.session[0].id)
        sessionStorage.setItem('questionnaire_id',data.questionnaire[0].id)



      const response = await fetch(`${import.meta.env.VITE_API_URL}/session/start/${data.session[0].id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
        }})

        const data2 = await response.json()
        console.log("data2", data2.success)
        if (data2.success){
            navigate(`/session/questionnaire/${data.session[0].id}`)
        }
        else {
            toast.showError("Erreur lors de l'ouverture du questionnaire");
        }
      } catch (error) {
      console.error(error);
      }
    }

    const handleCodeSubmit = async () => {
      await codeForSession({session_id: session.id, code: sessionCode, isUserSubmit: true});
    };


  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-700 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Chargement du questionnaire...</p>
        </div>
      </div>
    );
  }


 if (!questionnaire) {
    return (
      <div className="w-full h-full">
        <img src="/images/sorry_pardon.svg" alt="" className="sm:h-40 sm:w-40 h-25 w-25 absolute top-30 md:top-20 lg:left-60 md:left-40 sm:left-5 sm:top-20 left-1" />
        <img src="/images/sorry.svg" alt="" className="sm:h-25 sm:w-25 h-17 w-17 absolute md:top-20 lg:right-60 md:right-40 sm:right-5 sm:top-20 top-25 right-3" />
        <p className="text-center mt-40 text-2xl text-orange-700 font-bold">Nous sommes navrés</p>
        <p className="text-center mt-10 text-xl font-semibold">Ce questionnaire semble ne pas exister.</p>
        <p className="text-center mt-3 text-md">Vérifiez que l'url entrée est correcte.</p>
        <p className="text-center mt-3 text-md">En cas de problème, n'hésitez pas à contacter l'auteur du questionnaire.</p>
        </div>
    )
  }
  if (!questionnaire.ispublished || !questionnaire.isactive) {
    return (
      <div className="w-full h-full">
        <img src="/images/sorry_pardon.svg" alt="" className="sm:h-40 sm:w-40 h-25 w-25 absolute top-30 md:top-20 lg:left-60 md:left-40 sm:left-5 sm:top-20 left-1" />
        <img src="/images/sorry.svg" alt="" className="sm:h-25 sm:w-25 h-17 w-17 absolute md:top-20 lg:right-60 md:right-40 sm:right-5 sm:top-20 top-25 right-3" />
        <p className="text-center mt-40 text-2xl text-orange-700 font-bold">Nous sommes navrés</p>
        <p className="text-center mt-10 text-xl font-semibold">Ce questionnaire n'est pas accessible.</p>
        <p className="text-center mt-3 text-md">Il n'a pas encore été publié par son auteur ou n'est plus actif.</p>
        </div>
    )
  }
  if (questionnaire.ispublished && questionnaire.isactive) {
    if (!code) {
      return (
        <div className="background-new-visual px-5 w-full h-full flex flex-col items-center justify-center">
          <label htmlFor="code" className="text-xl"> Un code est nécessaire pour accéder à ce questionnaire</label>
          <input type="password" name='code' placeholder="xxxx"
          value={sessionCode}
          onChange={(e) => setSessionCode(e.target.value)}
          className="border border-gray-200 rounded-lg mt-4 px-2 py-1"
          />
          <button onClick={handleCodeSubmit} className="rounded-xl bg-calypso-400 shadow-calypso-800 shadow-lg hover:bg-calypso-500 hover:-translate-y-0.5 px-3 py-2 text-white font-semibold mt-6 tracking-wide">Envoyer</button>
          {errorCode ?
          <div className="text-sm text-orange-700 mt-1">Il est nécessaire d'entrer le bon code pour continuer
        </div>
        :
        <div className="hidden"></div>}
        </div>
      )
    } else {
        return (
            <div className="Session px-5 w-full h-full relative grid grid-rows-[2fr_2fr_0.5fr_0.5fr] pb-10 background-new-visual">
              <img src="/images/NumDiag_new_logo.png" alt="logo de NumDiag" className="h-18 w-18 absolute top-3 left-3" />

                <div className="questionnaires-infos mt-0 w-full py-10 mx-auto self-start">
                  <div className="md:w-2/3 w-full mx-auto border-b border-calypso-700 px-6 py-2 rounded-xl shadow-lg">
                    <h1 className="text-xl font-semibold tracking-wide">{questionnaire.label}</h1>
                    <div className="w-fit">
                      <hr className="text-calypso-500 mt-3 mb-2"/>
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


              {(existingSessionId && !session.score) ? (
                <div className="questionnaires-start-buttons self-center md:w-2/3 w-full mx-auto grid grid-cols-[3fr_1fr_3fr] md:grid-cols-[minmax(300px,3fr)_minmax(20px,1fr)_minmax(300px,3fr)]">

                    <button
                      onClick={() => navigate(`/session/questionnaire/${session.id}`)}
                      className="btn-go-to-questionnaire self-center justify-self-start px-4 py-2 cursor-pointer bg-calypso-700 shadow-calypso-500 hover:-translate-y-0.5 hover:bg-calypso-600 border-t border-calypso-500 shadow rounded text-white w-fit md:w-[210px]"
                    >
                      Continuer le questionnaire précédent
                    </button>
                    <img src="/images/way.svg" className="h-9 w-9 mt-4 self-center md:self-start justify-self-center" alt="" />
                    {/* ajouter une conditionnelle pour accéder au score si session.state = finished */}
                    <button
                      onClick={handleGoToQuestionnaireClick}
                      className="btn-go-to-questionnaire self-center justify-self-end px-4 py-2 cursor-pointer bg-calypso-700 shadow-calypso-500 hover:-translate-y-0.5 hover:bg-calypso-600 border-t border-calypso-500 shadow rounded text-white w-fit md:w-[210px] text-wrap"
                    >
                      Commencer un nouveau questionnaire
                    </button>
                </div>

              ) : (existingSessionId && session.state==='finished') ?
                <div className="questionnaires-start-buttons self-center md:w-2/3 w-full mx-auto grid grid-cols-[3fr_1fr_3fr] md:grid-cols-[minmax(300px,3fr)_minmax(20px,1fr)_minmax(300px,3fr)]">

                  <button
                    onClick={() => navigate(`/score/${session.id}`)}
                    className="btn-go-to-questionnaire self-center justify-self-start px-4 py-2 cursor-pointer bg-calypso-700 shadow-calypso-500 hover:-translate-y-0.5 hover:bg-calypso-600 border-t border-calypso-500 shadow rounded text-white w-fit md:w-[210px]"
                  >
                    Accéder au score et aux recommandations
                  </button>
                  <img src="/images/way.svg" className="h-9 w-9 mt-4 self-center md:self-start justify-self-center" alt="" />
                  {/* ajouter une conditionnelle pour accéder au score si session.state = finished */}
                  <button
                    onClick={handleGoToQuestionnaireClick}
                    className="btn-go-to-questionnaire self-center justify-self-end px-4 py-2 cursor-pointer bg-calypso-700 shadow-calypso-500 hover:-translate-y-0.5 hover:bg-calypso-600 border-t border-calypso-500 shadow rounded text-white w-fit md:w-[210px] text-wrap"
                  >
                    Commencer un nouveau questionnaire
                  </button>
                </div>
            : (
                <div className="questionnaires-start-buttons w-full flex flex-col justify-center flex-nowrap">

                  <button
                    onClick={handleGoToQuestionnaireClick}
                    className="btn-go-to-questionnaire px-4 py-2 cursor-pointer bg-calypso-700 shadow-calypso-500 hover:-translate-y-0.5 hover:bg-calypso-600 border-t border-calypso-500 shadow rounded text-white w-fit mx-auto"
                  >
                    Lancer le questionnaire
                  </button>
                    <img src="/images/rocket.svg" className="h-7 w-7 mt-4 self-center" alt="" />
                  </div>
              )}
              {questionnaire.isfunded ? (
                <div className="flex w-full justify-center items-center mt-5">
                  <img src="/images/sponsors.png" alt="" className='rounded opacity-50'/>
                </div>
              ) : <div className="hidden"></div>}
          </div>
          );
      }
    }
}


export default Session;
