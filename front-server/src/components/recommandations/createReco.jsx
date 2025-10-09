import React, { useState, useEffect } from "react";
import "../popups/editQuestion.css";
import { useParams } from "react-router-dom";

function CreateReco({ onSave, onClose }) {
  const [formData, setFormData] = useState({
    min: "",
    max: "",
    recommandation: "",
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
          <h3>Nouvelle recommandation</h3>
          <button onClick={onClose} className="close-button">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="popup-form">
          <div className="form-group">
            <label htmlFor="recommandation">Contenu de la recommandation</label>
            {/* <input
                          type="text"
                          id="recommandation"
                          name="recommandation"
                          value={formData.recommandation}
                          onChange={handleInputChange}
                          placeholder="Contenu"
                          required
                      /> */}
            <textarea
              id="recommandation"
              name="recommandation"
              value={formData.recommandation}
              onChange={handleInputChange}
              placeholder="Contenu"
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label>
              Indiquez les scores entre lesquels apparaîtront la recommandation
              :
            </label>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="min">Valeur minimum</label>
                <input
                  type="text"
                  id="min"
                  name="min"
                  value={formData.min}
                  onChange={handleInputChange}
                  placeholder="Un entier"
                />
              </div>

              <div className="form-group">
                <label htmlFor="max">Valeur maximum</label>
                <input
                  type="text"
                  id="max"
                  name="max"
                  value={formData.max}
                  onChange={handleInputChange}
                  placeholder="Un entier"
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

export default CreateReco;
