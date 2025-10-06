import { useState } from 'react';
import PopUpEditAnswers from './editAnswers'


function AnswersResume({answer,answerType,setQuestionnaire,questionnaireId}) {
  
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const handleEditClick = () => {
    setIsEditPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsEditPopupOpen(false);
  };


const onSaveAnswer = async (updatedAnswer) => {
    console.log(updatedAnswer)
    
    try {
        const response = await fetch(`http://127.0.0.1:3008/reponses/${answer.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                label: updatedAnswer.label,
                position: updatedAnswer.position,
                tooltip: updatedAnswer.tooltip,
                plafond: updatedAnswer.plafond,
                recommandation: updatedAnswer.recommandation,
                valeurScore: updatedAnswer.valeurScore
            })
        })
        
        const data = await response.json()
        
        if (data.success) {
            console.log('Réponse mise à jour avec succès:', data.data)
              const responseQ = await fetch(`http://localhost:3008/questionnaire/${questionnaireId}`);
                if (!responseQ.ok) {
                        throw new Error('Erreur lors du chargement du questionnaire');
                    }
                const dataQ = await responseQ.json();

                setQuestionnaire(dataQ)
                setIsEditPopupOpen(false);
            // Rafraîchir vos données ou mettre à jour l'état local
        }
    } catch (error) {
        console.error('Erreur lors de la mise à jour:', error)
    }
    
}

  return(
    <div className="answers-resume">   

      <div className="answer-row">
        <p>{answer.label}</p>
    <button onClick={handleEditClick}>
Editer la réponse 
    </button>


        {isEditPopupOpen && (
        <PopUpEditAnswers
        answer = {answer}
        answerType = {answerType}
        onSave={onSaveAnswer}
        onClose={handleClosePopup}/>
        )}

      </div>

    </div>
)
}

export default AnswersResume;