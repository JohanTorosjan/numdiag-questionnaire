import React from "react";
import "./deleteQuestion.css";
import ReactDOM from "react-dom";

const PopUpDelete = ({ question,onConfirm, onCancel }) => {

  return ReactDOM.createPortal(
    <div className="popup-overlay">
      <div className="popup-container">
        <h2>Supprimer la {question?'question':'réponse'}</h2>
        <p>Cette action est irréversible.</p>

        <div className="popup-buttons">
          <button className="btn-cancel" onClick={onCancel}>
            Annuler
          </button>
          <button className="btn-confirm" onClick={onConfirm}>
            Supprimer
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PopUpDelete;
