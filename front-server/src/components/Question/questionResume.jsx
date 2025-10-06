import { useState } from 'react';
import PopUpEditQuestion from '../popups/editQuestion';
import AnswersResume from '../../Answers/answersResume';
import PopUpEditAnswerSlots from '../../Answers/editAnswerSlots';

import { useToast } from '../../ToastSystem';
import './questionResume.css'; // Import du CSS
const answerTypeMatch = {
  "choix_simple":"Choix simple",
  "entier":"Entier",
  "choix_multiple":"Choix multiple",
  "libre":"Libre",
}
function QuestionResume({ question, sectionId, onUpdateQuestion, sectionNbPages,setQuestionnaire,questionnaireId}) {
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [isEditAnswerSlotsOpen, setIsEditAnswerSlotsOpen] = useState(false);

    const [isUpdating, setIsUpdating] = useState(false);
    const [isAnswersOpen, setIsAnwersOpen] = useState(false);
    const answerTypeDisplayed = answerTypeMatch[question.questiontype]

    const toggleAnswers = () => {
      setIsAnwersOpen(!isAnswersOpen);
    };
    
    const toast = useToast();

    const handleEditClick = () => {
        setIsEditPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsEditPopupOpen(false);
    };

    const handleEditSlotsClick = () => {
        setIsEditAnswerSlotsOpen(true);
    };

    const handleCloseSlotsPopup = () => {
        setIsEditAnswerSlotsOpen(false);
    };
    const handleSaveQuestion = async (updatedQuestion) => {
        try {
            setIsUpdating(true)
            if((question.position!==updatedQuestion.position) || (question.page!==updatedQuestion.page)){
                const updatePositionResponse = await fetch(`http://localhost:3008/questions/${question.id}/position`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    // Ajoute l'auth si nécessaire
                    // 'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    position:updatedQuestion.position,
                    page:updatedQuestion.page
                })
                });

                if (!updatePositionResponse.ok) {
                    toast.showError('Erreur lors de la mise a jour de la position')
                    throw new Error(`Erreur HTTP: ${updatePositionResponse.status}`);
                }
            
            }

        ////// ICI ON AJOUTERA PAREIL SI IL MODIFIE LE TYPE DE QUESTION ON SUPPRIME TOUTES LES RÉPONSES 


            const response = await fetch(`http://localhost:3008/questions/${question.id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    // Ajoute l'auth si nécessaire
                    // 'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    section_id: sectionId,
                    ...updatedQuestion
                })
                });


            if (!response.ok) {
                toast.showError('Erreur lors de la mise a jour de la question')
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            
            const result = await response.json();
    
            if (!result.success) {
            toast.showError('Erreur')
            throw new Error(result.error || 'Erreur lors de la sauvegarde');
            }
          
            try {
                const response = await fetch(`http://localhost:3008/questionnaire/${questionnaireId}`);
                if (!response.ok) {
                        throw new Error('Erreur lors du chargement des sections');
                    }
                const data = await response.json();

                setQuestionnaire(data)
                setIsEditPopupOpen(false);
                toast.showSuccess("Question mise à jour")

                } catch (error) {
                toast.showError('Erreur fetching questionnaire')
                console.error('Error fetching questionnaire:', error);
                 return null;
            }
            // Ferme la popup
        } catch (error) {
            toast.showError('Erreur lors de la sauvegarde')
            console.error('Erreur lors de la sauvegarde:', error);
        }
        finally{
            setIsUpdating(false)
        }
    };

    return (
        
        <div className="question-resume">
            <h4>{question.label} {question.mandatory?"*":""} </h4>
                      <p> {isUpdating}</p>    

            <p>{question.description}</p> {answerTypeDisplayed}
 
          {/* Bouton pour ouvrir la popup d'édition */}
            <button onClick={handleEditClick} className="edit-button">
                Éditer la question 
            </button>

        <div className='answers'>
      {Array.isArray(question.reponses) && question.reponses.length > 0 && (question.questiontype === 'choix_multiple' ||  question.questiontype === 'choix_simple')  && (
        <div className="answers-toggle">
          <button onClick={toggleAnswers} className="chevron-button">
            <svg
              className={`chevron-icon ${isAnswersOpen ? 'rotated' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              width="16"
              height="16"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            <span>
                  Réponses ({question.reponses.length})
            </span>
          </button>
        </div>
      )}


      { question.questiontype ==='entier' && (
        <div className="answers-toggle">
          <button onClick={handleEditSlotsClick} className="chevron-button">
            <svg
              className={`chevron-icon }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              width="16"
              height="16"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            <span>
                 Éditer les tranches de réponses
            </span>
          </button>
        </div>
      )}

    <div className={`answers-container ${isAnswersOpen ? 'open' : 'closed'}`}>


      {Array.isArray(question.reponses) && question.reponses.map(answer => (
        
        <AnswersResume
        key={answer.id}
        answer={answer}
        answerType={question.questiontype}
        />        
      ))

      }
      </div>
         </div>
            {isEditPopupOpen && (
                <PopUpEditQuestion
                    question={question}
                    onSave={handleSaveQuestion}
                    onClose={handleClosePopup}
                    sectionNbPages={sectionNbPages}
                />
            )}
            {isEditAnswerSlotsOpen && (
                <PopUpEditAnswerSlots
                onClose={handleEditSlotsClick}
                />
            )}

        </div>
    );
}

export default QuestionResume;