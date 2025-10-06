import { useState } from 'react';
import { useToast } from '../ToastSystem';

function PopUpEditAnswers({ answer, answerType, onClose, onSave }) {
    const toast = useToast();
    const [formData, setFormData] = useState({
        label: answer?.label || '',
        valeurScore: answer?.valeurscore || '',
        tooltip: answer?.tooltip || '',
        plafond: answer?.plafond || 0,
        recommandation: answer?.recommandation || '',
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

        setFormData((prev) => ({
            ...prev,
            [name]: newValue,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await onSave(formData);
            toast.showSuccess('Réponse mise à jour avec succès !');
            onClose();
        } catch (e) {
            console.log(e)
            toast.showError('Erreur lors de la sauvegarde de la réponse.');
        }
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
                    <h3>Éditer la Réponse</h3>
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

                    <div className="form-actions">
                        <button type="button" onClick={onClose} className="btn-secondary">
                            Annuler
                        </button>
                        <button type="submit" className="btn-primary">
                            Sauvegarder
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default PopUpEditAnswers;
