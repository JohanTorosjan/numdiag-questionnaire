import React, { useState, useEffect } from 'react';
import '../popups/editQuestion.css';
import { useParams } from 'react-router-dom';


function CreateQuestionnaire({ onSave, onClose }) {
    const [formData, setFormData] = useState({
        label: '',
        description: '',
        insight: '',
        tooltip: '',
        code: '',
    });
    const [themePublic, setThemePublic] = useState({
        theme_id: '',
        public_id: '',
    });

    const handleInputChange = (e) => {
      const { name, value } = e.target;

        let newValue = value;

        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));
    };

    const handleThemePublicChange = (e) => {
        const { name, value } = e.target;
        setThemePublic(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData, themePublic);
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

                      <div className="form-group">
                          <label htmlFor="insight">Insight :</label>
                          <input
                              type="text"
                              id="insight"
                              name="insight"
                              value={formData.insight}
                              onChange={handleInputChange}
                          />
                      </div>

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
                          <label htmlFor="code">Code :</label>
                          <input
                              id="code"
                              name="code"
                              type="number"
                              value={formData.code}
                              onChange={handleInputChange}
                              placeholder='Pas de code ou code pin (e.g. 0000)'

                          >
                          </input>
                      </div>
                  </div>

                  <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="theme_id">Thème :</label>
                            <select
                                type="text"
                                id="theme_id"
                                name="theme_id"
                                value={themePublic.theme_id || ''}
                                onChange={handleThemePublicChange}
                            >
                            {themes.map(theme => (
                                    <option key={theme.value || 'null'} value={theme.value || ''}>
                                        {theme.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="public_id">Public :</label>
                            <select
                                type="text"
                                id="public_id"
                                name="public_id"
                                value={themePublic.public_id}
                                onChange={handleThemePublicChange}
                            >
                            {themes.map(theme => (
                                    <option key={theme.value || 'null'} value={theme.value || ''}>
                                        {theme.label}
                                    </option>
                                ))}
                            </select>
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

export default CreateQuestionnaire;
