import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "../../ToastSystem";

import Section from "../Section/section.jsx";
import QuestionnaireTitle from "./questionnaireTitle.jsx";
import QuestionnaireTitleForm from "./questionnaireTitleForm";
import CreateSection from "../Section/createSection.jsx";
import CreateReco from "../recommandations/createReco.jsx";
import RecoQuestionnaire from "../recommandations/reco_questionnaire.jsx";
import SideModal from "../recommandations/side_modal.jsx";
import { getAllPublics, getAllThemes } from '../ThemePublic/themePublic.js';


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
  insight,
  tooltip,
  code
) {
  try {
    const response = await fetch(
      `http://localhost:3008/updateQuestionnaire/${idQuestionnaire}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ label, description, insight, tooltip, code }), // Pass the updated questionnaire data
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

async function getAssociatedThemesAndPublics(questionnaire_id) {
  try {
        const response = await fetch(`http://localhost:3008/associatedThemesAndPublics/${questionnaire_id}`);
        if (response.ok) {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.error('Error fetching associated themes and publics:', error);
        return [];
    }
}

async function editQuestionnaireThemesAndPublics({questionnaire_id, theme, publicSelect}) {
  try {
        const response = await fetch(`http://localhost:3008/questionnaireThemesAndPublics/${questionnaire_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ theme, publicSelect }), // Pass the updated questionnaire data
        }
        );
        if (response.ok) {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.error('Error editing associated themes and publics:', error);
        return [];
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [associatedThemesAndPublics, setAssociatedThemesAndPublics] = useState([]);
  const [allPublics, setAllPublics] = useState([])
  const [allThemes, setAllThemes] = useState([])
  const [theme, setTheme] = useState([]);
  const [publicSelect, setPublic] = useState([]);

  useEffect(() => {
    async function fetchQuestionnaire() {
      const data = await getQuestionnaire(id);
      setQuestionnaire(data);
      const reco = await getReco(id);
      setRecommandations(reco.recommandations);
    }

    const fetchThemes = async () => {
      const data = await getAllThemes();
      setAllThemes(data.data);
    }

    const fetchPublics = async () => {
      const data = await getAllPublics();
      setAllPublics(data.data);
    }

    fetchQuestionnaire();
    fetchThemes();
    fetchPublics();
  }, [id]);

  useEffect(() => {
    if (!questionnaire?.id) return;
    const fetchAssociateThemesAndPublics = async () => {
        try {
        const data = await getAssociatedThemesAndPublics(questionnaire.id);
        setAssociatedThemesAndPublics(data);
      } catch (error) {
        console.error("Error fetching associated themes and publics:", error);
      }
    }
    fetchAssociateThemesAndPublics();
  }, [questionnaire]);

  useEffect(() => {
    const themesQuest=[];
    const publicQuest=[];
    associatedThemesAndPublics.themesAndPublics?.resultTheme?.forEach((theme)=>
      themesQuest.push(theme.theme_id)
    )
    setTheme(themesQuest)
    associatedThemesAndPublics.themesAndPublics?.resultPublic?.forEach((publicS)=>
      publicQuest.push(publicS.public_id)
    )
    setTheme(themesQuest);
    setPublic(publicQuest);
  }, [associatedThemesAndPublics])


  useEffect(() => {
    if (questionnaire) {
        document.title = `${questionnaire.label}`;
    }
    }, [questionnaire]);


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
          questionnaire.insight,
          questionnaire.tooltip,
          questionnaire.code
        );
        const updateThemesAndPublics = await editQuestionnaireThemesAndPublics(
          {questionnaire_id:questionnaire.id,theme, publicSelect}
        )
        setButtonModifierQuest("Modifier");
        const refreshed = await getAssociatedThemesAndPublics(questionnaire.id);
        setAssociatedThemesAndPublics(refreshed);
        console.log("Questionnaire updated:", updateQuest);
        console.log("Themes and publics updated:", updateThemesAndPublics)
        toast.showSuccess("Questionnaire mis à jour avec succès !");
      } catch (error) {
        console.error("Error updating questionnaire:", error);
        toast.showError("Erreur lors de la mise à jour du questionnaire");
        // Optionally show user feedback about the error
      }
    }
  }

  async function publishQuest() {
    try{
        const response = await fetch(`http://localhost:3008/publish/${questionnaire.id}`,{
        method: "PUT",});
        const data = await response.json()
        if (response.ok) {
          toast.showSuccess("Questionnaire publié avec succès !");

          setQuestionnaire((prev) => ({
            ...prev,
            ispublished: true,
          }));
        }
        return data
      }
      catch{
        console.log("ERREUR lors de la publication du questionnaire")
        toast.showError("Erreur lors de la publication du questionnaire");
        return {success: false}
    }
  }

  async function downloadJson() {
    try{
        const response = await fetch(`http://localhost:3008/questionnaires/${questionnaire.id}/export`);
        const data = await response.json()
        console.log("Creating JSON:", data)
        const jsonString = JSON.stringify(data, null, 2);
        // Create a blob from the JSON string
    const blob = new Blob([jsonString], { type: 'application/json' });

    // Create a temporary URL for the blob
    const url = URL.createObjectURL(blob);

    // Create a temporary anchor element and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = `questionnaire-${questionnaire.id}.json`; // Customize filename as needed
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    console.log("File sent to browser")

    return { success: true };
      }
      catch{
        console.log("ERREUR lors de la création du JSON")
        toast.showError("Erreur lors du téléchargement du JSON");
        return {success: false}
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

  const handleThemeChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setTheme(selectedOptions);
};
const handlePublicChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setPublic(selectedOptions);
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
    <div className="questionnaire-container main-content">
      {/* Header du questionnaire */}
      <div className="questionnaire-header">
          {buttonModifierQuest === "Modifier" ? (
            <div className="questionnaire-header-content grid grid-cols-[4fr_1fr] gap-x-2">
            <QuestionnaireTitle questionnaire={questionnaire} />
            <div className='w-full'>
              <div className="w-full mt-6">
              {associatedThemesAndPublics?.themesAndPublics?.themeLabels?.map( theme =>
                <p key={theme} className="inline ml-1 bg-blue-100 text-blue-400 px-2 py-1 text-sm rounded">{theme}</p>
              )}
              </div>
              <div className="w-full mt-2">
              {associatedThemesAndPublics?.themesAndPublics?.publicLabels?.map( theme =>
                <p key={theme} className="inline ml-1 bg-emerald-100 text-emerald-400 px-2 py-1 text-sm rounded">{theme}</p>
              )}
              </div>
            </div>
            </div>
          ) : (
            <div className="questionnaire-header-content grid grid-cols-[4fr_1fr] gap-x-4">
            <QuestionnaireTitleForm
              questionnaire={questionnaire}
              onChange={handleInputChange}
            />
            <div>
              <div className="form-group bg-blue-100 px-2 py-1 rounded">
                <label htmlFor="theme_ids" className="text-blue-400!">Thèmes : </label>
                <select
                    id="theme_ids"
                    name="theme_ids"
                    value={theme}
                    onChange={handleThemeChange}
                    multiple
                    size="1"
                    className="text-blue-400!"
                >
                <option value="" className="px-2"></option>
                {allThemes.map(theme => (
                        <option key={theme.id} value={theme.id} className="px-2">
                            {theme.label}
                        </option>

                    ))}
                </select>
            </div>

            <div className="form-group bg-emerald-100 px-2 py-1 rounded">
                <label htmlFor="public_ids" className="text-emerald-500!">Publics : </label>
                <select
                    id="public_ids"
                    name="public_ids"
                    value={publicSelect}
                    onChange={handlePublicChange}
                    multiple
                    size="1"
                    className="text-emerald-500! accent-emerald-500!"
                >
                <option value="" className="px-2"></option>
                {allPublics.map(publicElement => (
                        <option key={publicElement.id} value={publicElement.id} className="px-2 accent-emerald-500!">
                            {publicElement.label}
                        </option>
                    ))}
                </select>
              </div>
            </div>
            </div>
          )}
        <div className="questionnaire-actions relative">
          <button
            type="button"
            className="btn-edit-quest"
            onClick={toggleButtonModifierQuest}
          >
            {buttonModifierQuest}
          </button>
          <button
            type="button"
            className="btn-edit-quest"
            onClick={() => setIsModalOpen(true)}
          >
            Éditer les recommandations
          </button>
          <button
            type="button"
            className="btn-toggle-sections"
            onClick={() => setButtonAffichageSection(!buttonAffichageSection)}
          >
            {buttonAffichageSection ? "Afficher les actifs" : "Tout afficher"}
          </button>

          {!questionnaire.ispublished ?
          <div className="flex absolute right-0 space-x-3">
          <button
            type="button"
            className=" bg-orange-700 border border-orange-700 px-3 py-2 rounded-xl text-white font-semibold text-[0.95rem] hover:-translate-y-0.5 ease-in duration-100 hover:shadow-lg hover:bg-orange-600 hover:border-orange-600"
            onClick={publishQuest}
          >
            Publier
          </button>
          <button
            type="button"
            className=" bg-emerald-600 border border-emerald-600 px-3 py-2 rounded-xl text-white font-semibold text-[0.95rem] hover:-translate-y-0.5 ease-in duration-100 hover:shadow-lg hover:bg-emerald-500 hover:border-emerald-500"
            onClick={downloadJson}
          >
            Télécharger
          </button>
          </div>
          : <button
            type="button"
            className="absolute right-0 bg-emerald-600 border border-emerald-600 px-3 py-2 rounded-xl text-white font-semibold text-[0.95rem] hover:-translate-y-0.5 ease-in duration-100 hover:shadow-lg hover:bg-emerald-500 hover:border-emerald-500"
            onClick={downloadJson}
          >Télécharger
          </button>}

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
      {isModalOpen && (
      <SideModal onClose={() => setIsModalOpen(false)}>
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
      </SideModal>
    )
    }
    {isCreateRecoPopupOpen && isModalOpen && (
        <CreateReco onSave={handleSaveReco} onClose={handleClosePopUpReco} />
    )}
    </div>
  );
}

export default Questionnaire;
