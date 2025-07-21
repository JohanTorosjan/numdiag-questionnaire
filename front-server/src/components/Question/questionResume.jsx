import { useState } from 'react'
import { editButton, deleteButton } from '../button/button.jsx';
import PopUpDeleteQuestion from '../popups/deleteQuestion.jsx';
import PopUpEditQuestion from '../popups/editQuestion.jsx'

// function QuestionResume({ questionId, questionLabel }) {
//     const [showDeletePopup, setShowDeletePopup] = useState(false)
//     return (
//         <div className="question-resume">
//             <h2>{questionLabel}</h2>
//             <div>
//                 {editButton(questionId, 'question')}
//                 {deleteButton(questionId, 'question')}
//             </div>
//             <p>{questionId}</p>
//         </div>
//     );
// }

function QuestionResume({ questionId, questionLabel, handleDelete,handleEdit }) {
    const [popupDelete, setPopupDelete] = useState(false);
    const [popupEdit, setPopupEdit] = useState(false);

    return (
        <div className="question-resume">
            <h2>{questionLabel}</h2>
            <div>
                {editButton(setPopupEdit)}
                {deleteButton(setPopupDelete)}
            </div>
            <p>{questionId}</p>
            
            <PopUpDeleteQuestion 
                id={questionId}
                handleDelete={handleDelete}
                trigger={popupDelete}          
                setTrigger={setPopupDelete}   
            />
            <PopUpEditQuestion
                id={questionId}
                handleEdit={handleEdit}
                trigger={popupEdit}          
                setTrigger={setPopupEdit}   
            />


        </div>
    );
}


export default QuestionResume