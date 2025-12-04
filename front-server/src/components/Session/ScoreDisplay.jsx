import { useToast } from "../../ToastSystem";
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from "react";

function ScoreDisplay() {
  const { session_id } = useParams();
  const toast = useToast();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState([])

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
        setAnswers(data.data.session.answers)
      }
      fetchData()
    }, []);

    useEffect(() => {
      console.log("Updated answers =", answers);
    }, [answers]);


    return (
        <div

        >
            Hello session {session_id}
        </div>
    );
}

export default ScoreDisplay;
