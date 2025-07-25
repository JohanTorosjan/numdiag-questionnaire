import React, {useEffect, useState} from "react";

function PopUpDeleteQuestion({ idQuestion, trigger, setTrigger }) {

  const handleDeleteClick = () => {
    handelDelete(idQuestion)
      .then(data => {
        console.log("Suppression réussie :", data);
        setTrigger(false); 
      })
      .catch(error => {
        console.error("Erreur lors de la suppression :", error);
      });
  };

  return  (trigger) ? (
    <div className="popup">
      <div className="popup-inner">
        <h2>Supprimer la question</h2>
        <p>Êtes-vous sûr.e de vouloir supprimer la question {idQuestion} ?</p>
        <button className="text-btn" onClick={handleDeleteClick}>
          Oui
        </button>
        <button className="close-btn" onClick={() => setTrigger(false)}>
          Non
        </button>
      </div>
    </div>
  ): "";
}


async function handelDelete(idQuestion){
    try {
        const response = await fetch(`http://127.0.0.1:3008/question/${idQuestion}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (response.ok) {
            console.log('Question supprimée avec succès');
            return { success: true };
        }
    } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        return { success: false, error: error.message };
    }      
}

export default PopUpDeleteQuestion;
