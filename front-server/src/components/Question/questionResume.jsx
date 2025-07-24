import React, { useEffect, useState } from 'react';
import PopUpDeleteQuestion from '../popups/deleteQuestion.jsx';
import PopUpEditQuestion from '../popups/editQuestion.jsx'

function QuestionResume({ questionId, questionLabel}) {
    const [popupDelete, setPopupDelete] = useState(false);  // teste popup
    const [popupEdit, setPopupEdit] = useState(false);

    if (popupDelete){
        return (
            <div className="question-resume">
                <h2>{questionLabel}</h2>
                <div>
                    <button className="green-btn" onClick={() => setPopupEdit(true)}>
                        {/* <Edit className="icone" size={18} /> */}
                        Edit
                    </button>
                    <button className="red-btn" onClick={() => setPopupDelete(true)}>
                        {/* <Trash2 className="icon" size={18} /> */}
                        Delete
                    </button>
                </div>
                <div className='btn-action'>
                    <PopUpDeleteQuestion 
                    id={questionId}        
                    setTrigger={setPopupDelete}   
                    /> 
                </div>
            </div>
        )
    }

    if(popupEdit){
        return (
            <div className="question-resume">
                <h2>{questionLabel}</h2>
                <div>
                    <button className="green-btn" onClick={() => setPopupEdit(true)}>
                        {/* <Edit className="icone" size={18} /> */}
                        Edit
                    </button>
                    <button className="red-btn" onClick={() => setPopupDelete(true)}>
                        {/* <Trash2 className="icon" size={18} /> */}
                        Delete
                    </button>
                </div>
                <div className='btn-action'>
                    <PopUpEditQuestion
                        id={questionId}       
                        setTrigger={setPopupEdit}   
                    />
                </div>

            </div>
        );
    }
    else{
        return (
            <div className="question-resume">
                <h2>{questionLabel}</h2>
                <div>
                    <button className="green-btn" onClick={() => setPopupEdit(true)}>
                        {/* <Edit className="icone" size={18} /> */}
                        Edit
                    </button>
                    <button className="red-btn" onClick={() => setPopupDelete(true)}>
                        {/* <Trash2 className="icon" size={18} /> */}
                        Delete
                    </button>
                </div>
            </div>
        );
    }

}

export default QuestionResume