import React, { useState, useEffect } from "react";
import "../popups/editQuestion.css";
import { useParams } from "react-router-dom";

function CreateScore({ onSave, onClose }) {
  const [formData, setFormData] = useState({
    scoremin: 0,
    scoremax: 0,
    lettre: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="popup-overlay" onClick={handleBackdropClick}>
      <div className="popup-content">
        <div className="popup-header">
          <h3>Nouveau score</h3>
          <button onClick={onClose} className="close-button">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="popup-form">
          <div className="form-group">
            <label htmlFor="lettre">Lettre</label>
            <input
              type="text"
              id="lettre"
              name="lettre"
              value={formData.lettre}
              onChange={handleInputChange}
              placeholder="Contenu"
              required
            />
          </div>
          <div className="form-group">
            <p>Indiquez les scores entre lesquels apparaîtront la lettre :</p>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="scoremin">Valeur minimum</label>
                <input
                  type="number"
                  id="scoremin"
                  name="scoremin"
                  value={formData.scoremin}
                  onChange={handleInputChange}
                  placeholder="Un entier"
                  onKeyDown={(e) =>
                    ["e", "E", "+", "-", ".", ","].includes(e.key) &&
                    e.preventDefault()
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="scoremax">Valeur maximum</label>
                <input
                  type="number"
                  id="scoremax"
                  name="scoremax"
                  value={formData.scoremax}
                  onChange={handleInputChange}
                  placeholder="Un entier"
                  onKeyDown={(e) =>
                    ["e", "E", "+", "-", ".", ","].includes(e.key) &&
                    e.preventDefault()
                  }
                  min={formData.min}
                  required
                />
              </div>
            </div>
          </div>

          <div className="popup-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Annuler
            </button>
            <button type="submit" className="save-button">
              Sauvegarder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateScore;
