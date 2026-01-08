import React, { useState, useEffect } from 'react';
import '../popups/editQuestion.css';


async function getAllPublics() {
    try {
        const response = await fetch('http://localhost:3008/publics');
        if (response.ok) {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.error('Error fetching publics:', error);
        return [];
    }
}
async function getAllThemes() {
    try {
        const response = await fetch('http://localhost:3008/themes');
        if (response.ok) {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.error('Error fetching themes:', error);
        return [];
    }
}


function CreateQuestionnaire({ onSave, onClose }) {
    const [formData, setFormData] = useState({
        label: '',
        description: '',
        insight: '',
        tooltip: '',
        code: '',
    });
    const [theme, setTheme] = useState({
        theme_id: [],
    });
    const [publicSelect, setPublic] = useState({
        public_id: [],
    });
    const [allPublics, setAllPublics] = useState([])
    const [allThemes, setAllThemes] = useState([])

    useEffect(() => {
      const fetchThemes = async () => {
        const data = await getAllThemes();
        setAllThemes(data.data);
      }

      const fetchPublics = async () => {
        const data = await getAllPublics();
        setAllPublics(data.data);
      }

        fetchThemes();
        fetchPublics();
    }, []);

    const handleInputChange = (e) => {
      const { name, value } = e.target;

        let newValue = value;

        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));
    };

    const handleThemeChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setTheme({
            theme_id: selectedOptions
        });
    };
    const handlePublicChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setPublic({
            public_id: selectedOptions
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({formData, theme, publicSelect});
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
                            <label htmlFor="theme_id">Thèmes : </label>
                            <select
                                id="theme_ids"
                                name="theme_ids"
                                value={theme.theme_id}
                                onChange={handleThemeChange}
                                multiple
                                size="1"
                            >
                            <option value=""></option>
                            {allThemes.map(theme => (
                                    <option key={theme.id} value={theme.id}>
                                        {theme.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="publics_id">Publics : </label>
                            <select
                                id="public_ids"
                                name="public_ids"
                                value={publicSelect.public_id}
                                onChange={handlePublicChange}
                                multiple
                                size="1"
                            >
                            <option value=""></option>
                            {allPublics.map(publicElement => (
                                    <option key={publicElement.id} value={publicElement.id}>
                                        {publicElement.label}
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
