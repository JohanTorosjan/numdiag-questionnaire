import { useState, useEffect } from 'react';
import './editQuestion.css';
import { useParams } from 'react-router-dom';
import QuestionDependencies from '../Question/questionDependencies';
import { useToast } from '../../ToastSystem';
import ReactDOM from "react-dom";

function PopUpEditQuestion({ question, onSave, onClose, sectionNbPages, selectedThemes, selectedPublics, allPublics, allThemes }) {
  const toast = useToast();
    const [formData, setFormData] = useState({
        coeff: question?.coeff ?? 1,
        label: question?.label || '',
        mandatory: question?.mandatory || false,
        page: question?.page || 1,
        position: question?.position || 1,
        questiontype: question?.questiontype || '',
        tooltip: question?.tooltip || '',
        dependencies : []
    });
    const [selectedThemesQuestion, setSelectedThemesQuestion]=useState([])
    const [selectedPublicsQuestion, setSelectedPublicsQuestion]=useState([])

    const { id } = useParams();


    // Listes fixes pour les select
    const questionTypes = [
        { value: 'entier', label: 'Entier' },
        { value: 'choix_simple', label: 'Choix simple' },
        { value: 'choix_multiple', label: 'Choix multiple' },
        { value: 'libre', label: 'Libre' },

    ];

    useEffect(() => {
      const themes = selectedThemes.map(t => t.id);
      const publics = selectedPublics.map(p => p.id);
      setSelectedThemesQuestion(themes);
      setSelectedPublicsQuestion(publics)
    }, [selectedThemes, selectedPublics]);

    useEffect(()=>{
      console.log("Selected themes:", selectedThemesQuestion)
    },[selectedThemesQuestion])

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        let newValue = value;

        // Gestion des types spéciaux
        if (type === 'checkbox') {
            newValue = checked;
        } else if (type === 'number') {
            newValue = parseInt(value) || 0;
        } else if (name === 'theme' && value === '') {
            newValue = null;
        }


        if(name==="page" && newValue>sectionNbPages){
            toast.showWarning('Page ne peut pas dépasser le nombre de pages de la section ('+sectionNbPages+')');
            return
        }


        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData, selectedPublicsQuestion, selectedThemesQuestion);
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


    const handleThemeChange = (e) => {
      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
      setSelectedThemesQuestion(selectedOptions);
    };
    const handlePublicChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setSelectedPublicsQuestion(selectedOptions);
    };


    return ReactDOM.createPortal(
        <div className="popup-overlay" onClick={handleBackdropClick}>
            <div className="popup-content"onClick={e => e.stopPropagation()}>
                <div className="popup-header">
                    <h3>Éditer la question</h3>
                    <button onClick={onClose} className="close-button">×</button>
                </div>

                <form onSubmit={handleSubmit} className="popup-form">
                    <div className="form-group">
                        <label htmlFor="label">Intitulé de la question :</label>
                        <input
                            type="text"
                            id="label"
                            name="label"
                            value={formData.label}
                            onChange={handleInputChange}
                            placeholder="Ex: Combien d'employés sont présents dans votre entreprise"
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="coeff">Coefficient :</label>
                            <input
                                type="number"
                                id="coeff"
                                name="coeff"
                                value={formData.coeff}
                                onChange={handleInputChange}
                                min="0"
                                step="1"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="page">Page :</label>
                            <input
                                type="number"
                                id="page"
                                name="page"
                                value={formData.page}
                                onChange={handleInputChange}
                                min="1"
                                step="1"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="position">Position :</label>
                            <input
                                type="number"
                                id="position"
                                name="position"
                                value={formData.position}
                                onChange={handleInputChange}
                                min="1"
                                step="1"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="questiontype">Type de question :</label>
                            <p>Attention, la modification de ce champ entrainera la suppression de toutes les réponses</p>
                            <select
                                id="questiontype"
                                name="questiontype"
                                value={formData.questiontype}
                                onChange={handleInputChange}
                                required
                            >
                                {questionTypes.map(type => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group bg-blue-100 px-2 py-2 rounded">
                            <label className="text-blue-400!" htmlFor="theme">Thème(s) :</label>
                            <select
                                id="theme"
                                name="theme"
                                value={selectedThemesQuestion}
                                onChange={handleThemeChange}
                                multiple
                                size="1"
                                className="text-blue-400!"
                            >
                                {allThemes.map(theme => (
                                    <option key={theme.id} value={theme.id} className="px-2">
                                        {theme.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                         <div className="form-group bg-emerald-100 px-2 py-2 rounded">
                            <label htmlFor="public_cible" className="text-emerald-400!">Public(s) :</label>
                            <select
                                id="public_cible"
                                name="public_cible"
                                value={selectedPublicsQuestion}
                                onChange={handlePublicChange}
                                multiple
                                size="1"
                                className="text-emerald-400!"
                            >
                                {allPublics.map(public_cible => (
                                    <option key={public_cible.id} value={public_cible.id} className="px-2">
                                        {public_cible.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-group ">
                        <label htmlFor="tooltip">Aide/Tooltip :</label>
                        <input
                            type="text"
                            id="tooltip"
                            name="tooltip"
                            value={formData.tooltip}
                            onChange={handleInputChange}
                            placeholder="Texte d'aide pour l'utilisateur"
                        />
                    </div>

                    <div className="form-group checkbox-group">
                        <label htmlFor="mandatory" className="checkbox-label">
                          Question obligatoire
                            <input
                                type="checkbox"
                                id="mandatory"
                                name="mandatory"
                                checked={formData.mandatory}
                                onChange={handleInputChange}
                            />

                        </label>
                    </div>


                    <div className="form-group depencies-component">
                        <label htmlFor="tooltip">Dépendances:</label>
                        <p>
                          Cochez les réponses qui permettront l'affichage de la question
                        </p>

                       <QuestionDependencies
                      key={question.id}
                      questionnaire = {id}
                      question={question}
                      onUpdate={updateDependencies}
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
    ,document.body);
}

export default PopUpEditQuestion;
