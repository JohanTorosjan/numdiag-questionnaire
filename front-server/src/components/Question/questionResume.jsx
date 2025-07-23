import { useState } from 'react'
import { editButton, deleteButton } from '../button/button.jsx';
import PopUpDeleteQuestion from '../popups/deleteQuestion.jsx';
import PopUpEditQuestion from '../popups/editQuestion.jsx'

function QuestionResume({ questionId, questionLabel, handleDelete,handleEdit }) {
    const [popupDelete, setPopupDelete] = useState(false);  // teste popup
    const [popupEdit, setPopupEdit] = useState(false);
    return (
        <div className="question-resume">
            <h2>{questionLabel}</h2>
            <div>
                {editButton(setPopupEdit)}
                {deleteButton(setPopupDelete)}

                {/* {editButton(set)} */}
            </div>
            {/* <p>{questionId}</p> */}
            <div className='btn-action'>
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

        </div>
    );
}

export default QuestionResume