import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "../../ToastSystem";

import Section from "../Section/section.jsx";
import QuestionnaireTitle from "./questionnaireTitle.jsx";
import QuestionnaireTitleForm from "./questionnaireTitleForm";
import CreateSection from "../Section/createSection.jsx";
import CreateReco from "../recommandations/createReco.jsx";
import RecoQuestionnaire from "../recommandations/reco_questionnaire.jsx";

import "./Questionnaire.css"; // Import du CSS

async function getQuestionnaire(idQuestionnaire) {
  try {
    const response = await fetch(
      `http://localhost:3008/questionnaire/${idQuestionnaire}`
    );
    if (!response.ok) {
      throw new Error("Erreur lors du chargement des sections");
    }
    const data = await response.json();
    console.log("Questionnaire : ", data);
    return data;
  } catch (error) {
    console.error("Error fetching questionnaire:", error);
    return null;
  }
}

async function updateQuestionnaire(
  idQuestionnaire,
  label,
  description,
  insight
) {
  try {
    const response = await fetch(
      `http://localhost:3008/updateQuestionnaire/${idQuestionnaire}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ label, description, insight }), // Pass the updated questionnaire data
      }
    );
    if (!response.ok) {
      throw new Error(
        "Erreur lors de la mise à jour en db des infos du questionnaire"
      );
    }
    const data = await response.json();
    console.log("Mise à jour du questionnaire :", data);
    return data;
  } catch (error) {
    console.error("Error updating questionnaire:", error);
    return null;
  }
}

async function getReco(idQuestionnaire) {
  try {
    const response = await fetch(
      `http://localhost:3008/recommandations/${idQuestionnaire}`
    );
    if (!response.ok) {
      throw new Error("Erreur lors du chargement des recommandations");
    }
    const data = await response.json();
    console.log("Recommandations : ", data);
    return data;
  } catch (error) {
    console.error("Error fetching recommandations:", error);
    return null;
  }
}

function Questionnaire() {
  const { id } = useParams();
  const [questionnaire, setQuestionnaire] = useState(null);
  const [recommandations, setRecommandations] = useState([]);
  const [buttonModifierQuest, setButtonModifierQuest] = useState("Modifier");
  const [isCreateSectionPopupOpen, setIsCreateSectionPopupOpen] =
    useState(false);
  const [isCreateRecoPopupOpen, setCreateRecoPopupOpen] = useState(false);
  const [buttonAffichageSection, setButtonAffichageSection] = useState(false);
  const toast = useToast();

  useEffect(() => {
    async function fetchQuestionnaire() {
      const data = await getQuestionnaire(id);
      setQuestionnaire(data);
      const reco = await getReco(id);
      setRecommandations(reco.recommandations);
    }

    fetchQuestionnaire();
  }, [id]);

  const updateSection = (sectionId, updatedSection) => {
    setQuestionnaire((prevQuestionnaire) => ({
      ...prevQuestionnaire,
      sections: prevQuestionnaire.sections.map((section) =>
        section.id === sectionId ? { ...section, ...updatedSection } : section
      ),
    }));
  };

  const updateQuestion = (sectionId, questionId, updatedQuestion) => {
    setQuestionnaire((prevQuestionnaire) => ({
      ...prevQuestionnaire,
      sections: prevQuestionnaire.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              questions: section.questions.map((question) =>
                question.id === questionId
                  ? { ...question, ...updatedQuestion }
                  : question
              ),
            }
          : section
      ),
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setQuestionnaire((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  async function toggleButtonModifierQuest() {
    if (buttonModifierQuest === "Modifier") {
      setButtonModifierQuest("Valider");
    } else {
      try {
        const updateQuest = await updateQuestionnaire(
          id,
          questionnaire.label,
          questionnaire.description,
          questionnaire.insight
        );
        setButtonModifierQuest("Modifier");
        console.log("Questionnaire updated:", updateQuest);
        toast.showSuccess("Questionnaire mis à jour avec succès !");
      } catch (error) {
        console.error("Error updating questionnaire:", error);
        toast.showError("Erreur lors de la mise à jour du questionnaire");
        // Optionally show user feedback about the error
      }
    }
  }

  //////////////////////////////////////////
  // Section part

  const handleCreateSectionClick = () => {
    setIsCreateSectionPopupOpen(true);
  };

  const handleClosePopupSection = () => {
    setIsCreateSectionPopupOpen(false);
  };

  const handleSaveSection = async (newSection, questionnaire_id = id) => {
    try {
      // Ici tu feras ton appel API plus tard
      console.log("Appel API sauvegarde section:", {
        updatedData: newSection,
        questionnaire_id: questionnaire_id,
      });
      // setIsCreating(true)
      const response = await fetch(`http://localhost:3008/createSection`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Ajoute l'auth si nécessaire
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newSection,
          questionnaire_id: questionnaire_id,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result = await response.json();
      console.log("Creation section, result:", result);
      if (!result.success) {
        throw new Error(result.error || "Erreur lors de la sauvegarde");
      }

      await new Promise((resolve) => setTimeout(resolve, 100));

      // Refresh the questionnaire data
      const updatedQuestionnaire = await getQuestionnaire(id);
      console.log("Updated questionnaire:", updatedQuestionnaire); // Add this for debugging

      if (updatedQuestionnaire) {
        setQuestionnaire(updatedQuestionnaire);
        toast.showSuccess("Section créée avec succès!");
      } else {
        toast.showError("Erreur lors de la création de section");
        throw new Error("Failed to fetch updated questionnaire");
      }
      setIsCreateSectionPopupOpen(false);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    }
  };

  //////////////////////////////////////////
  // Recommandation part

  const handleCreateRecoClick = () => {
    setCreateRecoPopupOpen(true);
  };

  const handleClosePopUpReco = () => {
    setCreateRecoPopupOpen(false);
  };

  const handleSaveReco = async (newReco, questionnaire_id = id) => {
    try {
      // Ici tu feras ton appel API plus tard
      console.log("Appel API sauvegarde recommandation:", {
        updatedData: newReco,
        questionnaire_id: questionnaire_id,
      });

      const response = await fetch(`http://localhost:3008/createreco`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Ajoute l'auth si nécessaire
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newReco,
          questionnaire_id: questionnaire_id,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result = await response.json();
      console.log("Creation recommandation, result:", result);
      if (!result.success) {
        throw new Error(
          result.error || "Erreur lors de la sauvegarde de la recommandation"
        );
      }

      await new Promise((resolve) => setTimeout(resolve, 100));

      // Refresh the questionnaire data
      const updatedReco = await getReco(id);
      console.log("Updated recommandations:", updatedReco); // Add this for debugging

      if (updatedReco) {

        setRecommandations(updatedReco.recommandations);
        toast.showSuccess("Recommandation créée avec succès!");
      } else {
        toast.showError("Erreur lors de la création de la recommandation");
        throw new Error("Failed to fetch updated questionnaire");
      }
      setCreateRecoPopupOpen(false);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    }
  };

  const updateReco = (recoId, updatedReco) => {
    setRecommandations((prevRecommandations) =>
    prevRecommandations.map((reco) =>
      reco.id === recoId ? { ...reco, ...updatedReco } : reco
    )
  );
  };

  const deleteReco = (recoId) => {
  setRecommandations((prevRecommandations) =>
    prevRecommandations.filter((reco) => reco.id !== recoId)
  );
};


  ////////////////////////////////
  // html component part
  // let i = 1

  if (!questionnaire) {
    return (
      <div>Ca charge (vous pouvez aller faire un cafe en attendant ^^)...</div>
    );
  }

  return (
    <div className="questionnaire-container">
      {/* Header du questionnaire */}
      <div className="questionnaire-header">
        <div className="questionnaire-header-content">
          {buttonModifierQuest === "Modifier" ? (
            <QuestionnaireTitle questionnaire={questionnaire} />
          ) : (
            <QuestionnaireTitleForm
              questionnaire={questionnaire}
              onChange={handleInputChange}
            />
          )}
        </div>
        <div className="questionnaire-actions">
          <button
            type="button"
            className="btn-edit-quest"
            onClick={toggleButtonModifierQuest}
          >
            {buttonModifierQuest}
          </button>
          <button
            type="button"
            className="btn-toggle-sections"
            onClick={() => setButtonAffichageSection(!buttonAffichageSection)}
          >
            {buttonAffichageSection ? "Afficher les actifs" : "Tout afficher"}
          </button>
        </div>
      </div>

      {/* Liste des sections */}
      <div className="sections-list">
        {questionnaire.sections?.map((section) =>
          section.isactive || buttonAffichageSection ? (
            <div
              key={section.id + "section"}
              className={`section-card ${
                section.isactive ? "active" : "inactive"
              }`}
            >
              <Section
                key={section.id}
                section={section}
                onUpdateSection={updateSection}
                onUpdateQuestion={updateQuestion}
                setQuestionnaire={setQuestionnaire}
                questionnaireId={id}
              />
            </div>
          ) : (
            <div key={section.id + "error"} className="hidden"></div>
          )
        )}
      </div>

      {/* Bouton de création */}
      <div className="create-section-container">
        <button
          onClick={handleCreateSectionClick}
          className="btn-create-section"
        >
          <span className="btn-icon">+</span>
          Créer une section
        </button>
      </div>

      {/* Popup de création de section */}
      {isCreateSectionPopupOpen && (
        <CreateSection
          onSave={handleSaveSection}
          onClose={handleClosePopupSection}
        />
      )}

      {/* Div pour les recommandations */}
      <div className="sections-list">
        <div className="section">
          {/* Header de la section */}
          <div className="section-header">
            <div className="section-content">
              <h3>Recommandations</h3>
              <div className="sections-list">
                {recommandations.map((recommandation) => (
                  <RecoQuestionnaire
                    key={`recommandation-${recommandation.id}`}
                    recommandation={recommandation}
                    onUpdateReco = {updateReco}
                    onDeleteReco= {deleteReco}
                    // questionnaireId={id}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="create-section-container">
            <button
              onClick={handleCreateRecoClick}
              className="btn-create-section"
            >
              <span className="btn-icon">+</span>
              Créer une recommandation
            </button>
          </div>
        </div>
      </div>
      {/* pop up creation recommandations */}
      {isCreateRecoPopupOpen && (
        <CreateReco onSave={handleSaveReco} onClose={handleClosePopUpReco} />
      )}
    </div>
  );
}

export default Questionnaire;
