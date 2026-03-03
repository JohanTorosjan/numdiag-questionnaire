import { useToast } from "../../ToastSystem";
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from "react";

function ScoreDisplay() {
  const { session_id } = useParams();
  const toast = useToast();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({})
  const [recoSections, setRecoSections] = useState([]);
  const [questionnaire, setQuestionnaire] = useState({})

  async function getScore(session_id){
    try{
        const response = await fetch(`${import.meta.env.VITE_API_URL}/score/${session_id}`);
        const data = await response.json()
        return data
    }
    catch{
        console.log("ERREUR lors du chargement")
        return {success: false}
    }
  }

    useEffect(() => {
      document.title = `Numdiag - Votre score`;
    }, []);


  useEffect(() => {

      async function fetchData() {
        const data = await getScore(session_id);
        if (!data.success) {
          toast.showError("Erreur lors du chargement");
          // setIsLoading(true);
          return;
        }
        if(sessionStorage.getItem('session_id')!= session_id){
          navigate(`/session/${data.data.questionnaire.id}`)
        }
        console.log(data)
        const questionnaire_const = data.data.questionnaire;
        setQuestionnaire(data.data.questionnaire)

        if (questionnaire) {
          document.title = `Your score - ${questionnaire_const.label}`;
        }
        setAnswers(data.data)
      }
      fetchData()
    }, [session_id]);

    useEffect(() => {
      console.log("Updated answers =", answers);

      const newReco = [];

      for (let sectionId in answers.sectionsInfos) {
        const section = answers.sectionsInfos[sectionId];
        section.recommandations.forEach((recommandation) => {
          newReco.push({ reco: recommandation, section: sectionId });
        });
      }

      setRecoSections(newReco);
      console.log("questionnaire", questionnaire.isfunded)
      console.log("recoSections:", recoSections);
    }, [answers]);


    return (
        <div className="w-full background-new-visual relative">
          <img src="/images/NumDiag_new_logo.png" alt="logo de NumDiag" className="h-18 w-18 absolute top-3 left-3" />
          <div className="max-w-4xl mx-auto pt-20 px-5 text-white">

            <h1 className="text-center mx-auto w-fit text-xl px-5 pb-1 rounded-3xl border-b border-calypso-600">Vous obtenez un score de {answers.scoreQuestionnaire}</h1>

            <div className="text-white mt-20">
              <div className="w-fit mb-5">
                <h2 className="text-xl">Nos recommandations :</h2>
                <hr className="w-1/3 text-calypso-500 mt-1"/>
              </div>

              {answers.recommandationQuestionnaire?.map((reco,i) =>
              <p key={i} className="drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] text-xl">{reco.recommandation}</p>
              )}
              </div>

            <div className="w-fit mt-20 mb-5 mr-0 ml-auto">
              <h2 className="text-xl">Certaines de vos réponses nous amènent aussi à vous conseiller :</h2>
              <hr className="w-1/3 text-calypso-500 mt-1 mr-0 ml-auto"/>
            </div>
            <div className="w-full">
              {recoSections.map((reco,i) =>
              <p key={i} className="text-end">{reco.reco}</p>
              )}
            </div>
          </div>

          {questionnaire.isfunded ? (
          <div className="absolute bottom-10 w-full left-0">
            <div className="flex w-full justify-center items-center">
              <img src="/images/sponsors.png" alt="" className='rounded opacity-50'/>
            </div>
          </div>

          ) : <div className="hidden"></div>}
        </div>
    );
}

export default ScoreDisplay;
