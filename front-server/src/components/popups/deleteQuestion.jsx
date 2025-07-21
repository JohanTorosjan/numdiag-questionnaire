import React from "react";

// function PopUpDeleteQuestion({ id, isVisible, handleDelete, handleCancel}) {
//     console.log("Deleting question with id:", id);
//     return (isVisible) ? (
//         <div className="popup">
//             <div className="popup-inner">
//                 <h2>Supprimer la question</h2>
//                 <p>Êtes-vous sûr.e de vouloir supprimer la question {id} ?</p>
//                 <button className="text-btn" onClick={() => handleDelete(id)}>Oui</button>
//                 <button className="close-btn" onClick={()=> props.setTrigger(false)}>Non</button>
//             </div>
//         </div>
//     ) : "";
// }

function PopUpDeleteQuestion({ id, handleDelete, trigger, setTrigger }) {
    console.log("Deleting question with id:", id);
    
    return trigger ? (
        <div className="popup">
            <div className="popup-inner">
                <h2>Supprimer la question</h2>
                <p>Êtes-vous sûr.e de vouloir supprimer la question {id} ?</p>
                <button className="text-btn" onClick={() => handleDelete(id)}>
                    Oui
                </button>
                <button className="close-btn" onClick={() => setTrigger(false)}>
                    Non
                </button>
            </div>
        </div>
    ) : null;
}


export default PopUpDeleteQuestion;