import React, { useState, useEffect, useRef } from 'react';
import '../popups/editQuestion.css';


function CreateThemePublic({ onSave, onClose, type }) {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);


    const [formData, setFormData] = useState({
        label: '',
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
    }




    return (
      <div className="popup-overlay" onClick={handleBackdropClick}>
          <div className="popup-content">
              <div className="popup-header">
                  <h3>Nouveau {type}</h3>
                  <button onClick={onClose} className="close-button">×</button>
              </div>

              <form onSubmit={handleSubmit} className="popup-form">
                  <div className="form-group">
                      <label htmlFor="label">Label du public</label>
                      <input
                          ref={inputRef}
                          type="text"
                          id="label"
                          name="label"
                          value={formData.label}
                          onChange={handleInputChange}
                          placeholder="Public cible"
                          required

                      />
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

export default CreateThemePublic;
