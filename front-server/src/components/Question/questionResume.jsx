import React, { useEffect, useState } from 'react';
import PopUpDeleteQuestion from '../popups/deleteQuestion.jsx';
import PopUpEditQuestion from '../popups/editQuestion.jsx'

function QuestionResume({questionId}) {
    const [popupDelete, setPopupDelete] = useState(false);  // teste popup
    const [popupEdit, setPopupEdit] = useState(false);
    const [responseId, setResponseId] = useState(null);

    useEffect(() => {
        async function fetchResponseId() {
            try {
                const response = await fetch(`http://127.0.0.1:3008/question?id=${questionId}`);
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setResponseId(data.responseId);
            } catch (err) {
                console.error('Error fetching responseId:', err);
            }
        }
        if (questionId) {
            fetchResponseId();
        }
    }, [questionId]);

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
                    trigger={popupDelete}    
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
                        trigger={popupEdit}  
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