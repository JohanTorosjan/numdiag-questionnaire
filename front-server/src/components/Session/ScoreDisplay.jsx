import { useToast } from "../../ToastSystem";
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from "react";

function ScoreDisplay() {
  const { session_id } = useParams();
  const toast = useToast();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({})
  const [recoSections, setRecoSections] = useState([]);

  async function getScore(session_id){
    try{
        const response = await fetch(`http://localhost:3008/score/${session_id}`);
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
        if(localStorage.getItem('session_id')!= session_id){
          navigate(`/session/${data.data.questionnaire.id}`)
        }
        const questionnaire = data.data.questionnaire;
        console.log(data)

        if (questionnaire) {
            document.title = `Your score - ${questionnaire.label}`;
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
      console.log("recoSections:", recoSections);
    }, [answers]);


    return (
        <div className="w-full">
            <h1>Hello session {session_id}</h1>
            <p>Score : {answers.scoreQuestionnaire}</p>
            <div className="text-teal-500">{answers.recommandationQuestionnaire?.map((reco,i) =>
              <p key={i}>{reco.recommandation}</p>
              )}</div>

            <div className="text-sky-500">{recoSections.map((reco,i) =>
              <p key={i}>{reco.reco}</p>
              )}</div>



        </div>
    );
}

export default ScoreDisplay;
