import React, { useState, useEffect } from 'react';
import '../popups/editQuestion.css';
import { getAllActivePublics, getAllActiveThemes } from '../ThemePublic/themePublicFront.js';

function CreateQuestionnaire({ onSave, onClose, questionTypes }) {
    const [formData, setFormData] = useState({
        label: '',
        description: '',
        insight: '',
        tooltip: '',
        code: '',
        default_question_type:''
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
        const data = await getAllActiveThemes();
        setAllThemes(data.data);
      }

      const fetchPublics = async () => {
        const data = await getAllActivePublics();
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
      <div className="popup-overlay relative" onClick={handleBackdropClick}>
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

                  <div className="">
                      <div className="form-group">
                          <label htmlFor="description">Description :</label>
                          <textarea
                              id="description"
                              name="description"
                              value={formData.description}
                              onChange={handleInputChange}
                              className="field-sizing-content w-full break-all"
                          />
                      </div>
                      <div className="flex space-x-4">
                      <div className="form-group w-1/2">
                          <label htmlFor="insight">Insight :</label>
                          <textarea
                              id="insight"
                              name="insight"
                              value={formData.insight}
                              onChange={handleInputChange}
                              className="field-sizing-content w-full break-all"
                              />
                      </div>

                      <div className="form-group w-1/2">
                          <label htmlFor="tooltip">Tooltip :</label>
                          <textarea
                              id="tooltip"
                              name="tooltip"
                              value={formData.tooltip}
                              onChange={handleInputChange}
                              className="field-sizing-content w-full text break-all"
                              />
                      </div>
                      </div>

                      <div className="form-group block">
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
                        <div className="form-group bg-blue-100 px-2 py-1 rounded">
                            <label htmlFor="theme_ids" className="text-blue-400!">Thèmes : </label>
                            <select
                                id="theme_ids"
                                name="theme_ids"
                                value={theme.theme_id}
                                onChange={handleThemeChange}
                                multiple
                                size="1"
                                className="text-blue-500!"
                            >
                            {allThemes.map(theme => (
                                    <option key={theme.id} value={theme.id} className="px-2">
                                        {theme.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group bg-emerald-100 px-2 py-1 rounded">
                            <label htmlFor="public_ids" className="text-emerald-400!">Publics : </label>
                            <select
                                id="public_ids"
                                name="public_ids"
                                value={publicSelect.public_id}
                                onChange={handlePublicChange}
                                multiple
                                size="1"
                                className="text-emerald-500!"
                            >
                            {allPublics.map(publicElement => (
                                    <option key={publicElement.id} value={publicElement.id} className="px-2">
                                        {publicElement.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="questiontype">Type de question par défaut:</label>
                        <select
                            id="default_question_type"
                            name="default_question_type"
                            value={formData.default_question_type}
                            onChange={handleInputChange}
                            size="1"
                        >
                            <option value="Non défini" id="default_question_type"
                            name="default_question_type">Non défini</option>
                            {questionTypes.map(type => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
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
