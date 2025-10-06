import { useState } from 'react';
import PopUpEditAnswers from './editAnswers'


function AnswersResume({answer,answerType}) {
  
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const handleEditClick = () => {
    setIsEditPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsEditPopupOpen(false);
  };


  const onSaveAnswer = (updatedAnswer) => {
    console.log(updatedAnswer)
    debugger
    setIsEditPopupOpen(false);
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