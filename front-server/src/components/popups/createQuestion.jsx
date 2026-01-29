import { useEffect, useState } from "react";
import "./createQuestion.css";
import { useToast } from "../../ToastSystem";
import ReactDOM from "react-dom";

function PopUpCreateQuestion({
  onSave,
  onClose,
  sectionNbPages,
  themesAndPublicsFromQuestionnaire,
  allPublics,
  allThemes,
  defaultQuestionType,
}) {
  const toast = useToast();
  const [formData, setFormData] = useState({
    coeff: 1,
    label: "",
    mandatory: false,
    page: 1,
    position: 1,
    questiontype:
      defaultQuestionType === null
        ? "choix_simple"
        : defaultQuestionType,
    tooltip: "",
  });
  const [selectedThemesQuestion, setSelectedThemesQuestion] = useState([]);
  const [selectedPublicsQuestion, setSelectedPublicsQuestion] = useState([]);

  // Listes fixes pour les select
  const questionTypes = [
    { value: "entier", label: "Entier" },
    { value: "choix_simple", label: "Choix simple" },
    { value: "choix_multiple", label: "Choix multiple" },
    { value: "libre", label: "Libre" },
  ];

  useEffect(() => {
    if (!themesAndPublicsFromQuestionnaire?.themesAndPublics) return;

    const { resultTheme } = themesAndPublicsFromQuestionnaire.themesAndPublics;
    const { resultPublic } = themesAndPublicsFromQuestionnaire.themesAndPublics;

    const themes = resultTheme.map((t) => t.theme_id);
    const publics = resultPublic.map((p) => p.public_id);

    setSelectedThemesQuestion(themes);
    setSelectedPublicsQuestion(publics);
    console.log(defaultQuestionType)
  }, [themesAndPublicsFromQuestionnaire]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    let newValue = value;

    // Gestion des types spéciaux
    if (type === "checkbox") {
      newValue = checked;
    } else if (type === "number") {
      newValue = parseInt(value) || 0;
    } else if (name === "theme" && value === "") {
      newValue = null;
    }

    if (name === "page" && newValue > sectionNbPages) {
      toast.showWarning(
        "Page ne peut pas dépasser le nombre de pages de la section (" +
          sectionNbPages +
          ")",
      );
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
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

  const handleThemeChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value,
    );
    setSelectedThemesQuestion(selectedOptions);
  };
  const handlePublicChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value,
    );
    setSelectedPublicsQuestion(selectedOptions);
  };

  return ReactDOM.createPortal(
    <div className="popup-overlay" onClick={handleBackdropClick}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h3>Créer une nouvelle question</h3>
          <button onClick={onClose} className="close-button">
            ×
          </button>
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
              <select
                id="questiontype"
                name="questiontype"
                value={formData.questiontype}
                onChange={handleInputChange}
                required
              >
                {questionTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group">
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

          <div className="flex space-x-3">
            <div className="form-group bg-blue-100 px-2 py-2 rounded">
              <label htmlFor="theme" className="text-blue-400!">
                Thème(s) :
              </label>
              <select
                id="theme"
                name="theme"
                value={selectedThemesQuestion}
                onChange={handleThemeChange}
                multiple
                size="1"
                className="text-blue-400!"
              >
                {allThemes.map((theme) => (
                  <option key={theme.id} value={theme.id} className="px-2">
                    {theme.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group bg-orange-100 px-2 py-2 rounded">
              <label htmlFor="public_cible" className="text-orange-400!">
                Public(s) :
              </label>
              <select
                id="public_cible"
                name="public_cible"
                value={selectedPublicsQuestion}
                onChange={handlePublicChange}
                multiple
                size="1"
                className="text-orange-400!"
              >
                {allPublics.map((public_cible) => (
                  <option
                    key={public_cible.id}
                    value={public_cible.id}
                    className="px-2"
                  >
                    {public_cible.label}
                  </option>
                ))}
              </select>
            </div>
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
          <div className="info-message">
            <span className="info-icon">ℹ️</span>
            <p>
              Vous pourrez éditer les dépendances de la question en la modifiant
              une fois créée
            </p>
          </div>

          <div className="popup-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Annuler
            </button>
            <button type="submit" className="save-button">
              Créer
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}

export default PopUpCreateQuestion;
