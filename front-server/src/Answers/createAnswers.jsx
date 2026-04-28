import { useState } from 'react';
import { useToast } from '../ToastSystem';
import ReactDOM from "react-dom";
import './createAnswers.css';

function PopUpCreateAnswer({ answerType, onClose, onSave, position }) {
    const toast = useToast();
    const [formData, setFormData] = useState({
        label: '',
        valeurScore: 0,
        tooltip: '',
        plafond: 100,
        recommandation: '',
        critique: 0
    });


    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        let newValue = value;

        // Gestion des types spéciaux
        if (type === 'checkbox') {
            newValue = checked;
        } else if (type === 'number') {
            newValue = parseInt(value, 10) || 0;
        } else if (name === 'theme' && value === '') {
            newValue = null;
        }

        setFormData((prev) => {
           const updated = { ...prev, [name]: newValue };

        // If valeurScore increases past plafond, bump plafond up
        if (name === 'valeurScore' && Number(updated.plafond) < Number(newValue)) {
            updated.plafond = newValue;
        }

        return updated;
    });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await onSave(formData);
            toast.showSuccess('Réponse créée avec succès !');
            onClose();
        } catch (e) {
            console.log(e);
            toast.showError('Erreur lors de la création de la réponse.');
        }
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return ReactDOM.createPortal(
        <div className="popup-overlay" onClick={handleBackdropClick}>
            <div className="popup-content">
                <div className="popup-header">
                    <h3>Créer une nouvelle réponse</h3>
                    <button onClick={onClose} className="close-button">×</button>
                </div>

                <form onSubmit={handleSubmit} className="popup-form">
                    {/* Label */}
                    <div className="form-group">
                        <label htmlFor="label">Intitulé de la réponse :</label>
                        <input
                            type="text"
                            id="label"
                            name="label"
                            value={formData.label}
                            onChange={handleInputChange}
                            placeholder="Votre réponse"
                            required
                        />
                    </div>


                    <div className="form-row">
                        {/* Valeur Score */}
                        <div className="form-group">
                            <label htmlFor="valeurScore">Valeur Score :</label>
                            <input
                                type="number"
                                id="valeurScore"
                                name="valeurScore"
                                value={formData.valeurScore}
                                onChange={handleInputChange}
                                placeholder="Score associé"
                            />
                        </div>

                        {/* Plafond */}
                        <div className="form-group">
                            <label htmlFor="plafond">Plafond :</label>
                            <input
                                type="number"
                                id="plafond"
                                name="plafond"
                                value={formData.plafond}
                                onChange={handleInputChange}
                                min={formData.valeurScore}
                                placeholder="0"
                            />
                        </div>
                    </div>

                    {/* Tooltip */}
                    <div className="form-group">
                        <label htmlFor="tooltip">Tooltip :</label>
                        <input
                            type="text"
                            id="tooltip"
                            name="tooltip"
                            value={formData.tooltip}
                            onChange={handleInputChange}
                            placeholder="Texte d'aide"
                        />
                    </div>

                    {/* Recommandation */}
                    <div className="form-group">
                        <label htmlFor="recommandation">Recommandation :</label>
                        <textarea
                            id="recommandation"
                            name="recommandation"
                            value={formData.recommandation}
                            onChange={handleInputChange}
                            placeholder="Conseil ou recommandation"
                        />
                    </div>
                     <div className="form-group">
                            <label htmlFor="critique">Niveau de criticité :</label>
                            <input
                                type="number"
                                id="critique"
                                name="critique"
                                value={formData.critique}
                                onChange={handleInputChange}
                                min="0"
                                placeholder="e.g. 5"
                            />
                        </div>

                    <div className="form-actions flex gap-x-4 gap-y-2">
                        <button type="button" onClick={onClose} className="btn-secondary">
                            Annuler
                        </button>
                        <button type="submit" className="btn-primary">
                            Créer
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}

export default PopUpCreateAnswer;
