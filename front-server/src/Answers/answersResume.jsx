import { useState } from 'react';
import PopUpEditAnswers from './editAnswers';
import './answersResume.css';

function AnswersResume({answer, answerType, setQuestionnaire, questionnaireId}) {
  
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
        }
    } catch (error) {
        console.error('Erreur lors de la mise à jour:', error)
    }
  }

  return (
    <div className="answer-resume">   
      <div className="answer-content">
        <div className="answer-main">
          <p className="answer-label">{answer.label}</p>
        </div>
        
        <div className="answer-metadata">
          {answer.valeurscore !== undefined && answer.valeurscore !== null && (
            <span className="answer-score">Score: {answer.valeurscore}</span>
          )}
          {answer.plafond > 0 && (
            <span className="answer-plafond">Plafond : {answer.plafond}</span>
          )}
        </div>
      </div>

      <button onClick={handleEditClick} className="btn-edit-answer">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        Éditer
      </button>

      {isEditPopupOpen && (
        <PopUpEditAnswers
          answer={answer}
          answerType={answerType}
          onSave={onSaveAnswer}
          onClose={handleClosePopup}
        />
      )}
    </div>
  )
}

export default AnswersResume;