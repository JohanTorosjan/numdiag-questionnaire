import React, { useState, useEffect } from 'react';
import '../popups/editQuestion.css';
import { useParams } from 'react-router-dom';


function CreateSection({ onSave, onClose }) {
    const [formData, setFormData] = useState({
        label:'',
        description:'',
        tooltip:'',
        nbpages:'',
    });

    const handleInputChange = (e) => {
      const { name, value } = e.target;

        let newValue = value;

        setFormData(prev => ({
            ...prev,
            [name]: newValue
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


    const updateDependencies = (answerId)=>{
        setFormData(prev => ({
            ...prev,
           dependencies: answerId
        }));
    }




    return (
      <div className="popup-overlay" onClick={handleBackdropClick}>
          <div className="popup-content">
              <div className="popup-header">
                  <h3>Nouveau Questionnaire</h3>
                  <button onClick={onClose} className="close-button">×</button>
              </div>

              <form onSubmit={handleSubmit} className="popup-form">
                  <div className="form-group">
                      <label htmlFor="label">Titre du questionnaire</label>
                      <input
                          type="text"
                          id="label"
                          name="label"
                          value={formData.label}
                          onChange={handleInputChange}
                          placeholder="My new RGPD"
                          required
                      />
                  </div>

                  <div className="form-row">
                      <div className="form-group">
                          <label htmlFor="description">Description :</label>
                          <input
                              type="text"
                              id="description"
                              name="description"
                              value={formData.description}
                              onChange={handleInputChange}
                          />
                      </div>

                      {/* <div className="form-group">
                          <label htmlFor="position">Position :</label>
                          <input
                              type="text"
                              id="position"
                              name="position"
                              value={formData.position}
                              onChange={handleInputChange}
                          />
                      </div> */}

                      <div className="form-group">
                          <label htmlFor="tooltip">Tooltip :</label>
                          <input
                              type="text"
                              id="tooltip"
                              name="tooltip"
                              value={formData.tooltip}
                              onChange={handleInputChange}
                          />
                      </div>

                      <div className="form-group">
                          <label htmlFor="nbpages">Nombre de pages :</label>
                          <input
                              id="nbpages"
                              name="nbpages"
                              value={formData.nbpages}
                              onChange={handleInputChange}
                              placeholder='Pas de code ou code pin (e.g. 0000)'

                          >
                          </input>
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

export default CreateSection;
