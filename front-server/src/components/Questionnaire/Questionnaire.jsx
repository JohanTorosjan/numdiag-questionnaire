import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "../../ToastSystem";

import Section from "../Section/section.jsx";
import QuestionnaireTitle from "./questionnaireTitle.jsx";
import QuestionnaireTitleForm from "./questionnaireTitleForm";
import CreateSection from "../Section/createSection.jsx";
import CreateReco from "../recommandations/createReco.jsx";
import RecoQuestionnaire from "../recommandations/reco_questionnaire.jsx";
import ScoreQuestionnaire from "../recommandations/score_questionnaire.jsx";
import SideModal from "../recommandations/side_modal.jsx";
import SideModalLeft from "../recommandations/side_modal_left.jsx";
import CreateScore from "../recommandations/createScore.jsx";

import {
  getAllActivePublics,
  getAllActiveThemes,
} from "../ThemePublic/themePublicFront.js";

import "./Questionnaire.css"; // Import du CSS

async function getQuestionnaire(idQuestionnaire) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/questionnaire/${idQuestionnaire}`,
    );
    if (!response.ok) {
      throw new Error("Erreur lors du chargement des sections");
    }
    const data = await response.json();
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
  code,
  default_question_type,
) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/updateQuestionnaire/${idQuestionnaire}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          label,
          description,
          insight,
          tooltip,
          code,
          default_question_type,
        }), // Pass the updated questionnaire data
      },
    );
    if (!response.ok) {
      throw new Error(
        "Erreur lors de la mise à jour en db des infos du questionnaire",
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
      `${import.meta.env.VITE_API_URL}/recommandations/${idQuestionnaire}`,
    );
    if (!response.ok) {
      throw new Error("Erreur lors du chargement des recommandations");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching recommandations:", error);
    return null;
  }
}
async function getScores(idQuestionnaire) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/scores/${idQuestionnaire}`,
    );
    if (!response.ok) {
      throw new Error("Erreur lors du chargement des scores");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching scores:", error);
    return null;
  }
}



async function getAllScores(questionnaire_id) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/scores/${questionnaire_id}`,
    );
    if (response.ok) {
      const data = await response.json();
      return data.scores
    }
  } catch (error) {
    console.error("Error fetching scores:", error);
    return [];
  }
}

async function getAssociatedThemesAndPublics(questionnaire_id) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/associatedThemesAndPublics/${questionnaire_id}`,
    );
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error("Error fetching associated themes and publics:", error);
    return [];
  }
}

async function editQuestionnaireThemesAndPublics({
  questionnaire_id,
  theme,
  publicSelect,
}) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/questionnaireThemesAndPublics/${questionnaire_id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ theme, publicSelect }), // Pass the updated questionnaire data
      },
    );
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error("Error editing associated themes and publics:", error);
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
  const [isCreateScorePopupOpen, setCreateScorePopupOpen] = useState(false);
  const [buttonAffichageSection, setButtonAffichageSection] = useState(false);
  const toast = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalScoresOpen, setIsModalScoresOpen] = useState(false);
  const [associatedThemesAndPublics, setAssociatedThemesAndPublics] = useState(
    [],
  );
  const [allPublics, setAllPublics] = useState([]);
  const [allThemes, setAllThemes] = useState([]);
  const [theme, setTheme] = useState([]);
  const [publicSelect, setPublic] = useState([]);
  const [buttonModifierThemes, setButtonModifierThemes] = useState(
    "Modifier les thèmes et publics",
  );
  const [defaultQuestionType, setDefaultQuestionType] = useState("");
  const [scores, setScores]=useState([])
  const [scoresOk, setScoresOk]= useState(false)
  const [scoresAlert, setScoresAlert] = useState([])
  const [notInitialLoad, setInitialLoad] = useState(false);
  const [sponsorsDisplay, setSponsorsDisplay] = useState(false)
  const [file, setFile] = useState(null);
  const [statusClientLogo, setStatusClientLogo] = useState(null);

  // Listes fixes pour les select
  const questionTypes = [
    { value: "entier", label: "Entier" },
    { value: "choix_simple", label: "Choix simple" },
    { value: "choix_multiple", label: "Choix multiple" },
    { value: "libre", label: "Libre" },
  ];

  useEffect(() => {
    async function fetchQuestionnaire() {
      const data = await getQuestionnaire(id);
      setQuestionnaire(data);
      const reco = await getReco(id);
      setRecommandations(reco.recommandations);
    }

    const fetchThemes = async () => {
      const data = await getAllActiveThemes();
      setAllThemes(data.data);
    };

    const fetchPublics = async () => {
      const data = await getAllActivePublics();
      setAllPublics(data.data);
    };

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
    };

    let defaultQuestionDisplay = "";
    if (
      questionnaire.default_question_type &&
      questionnaire.default_question_type != ""
    ) {
      defaultQuestionDisplay = questionnaire.default_question_type.replace(
        "_",
        " ",
      );
      defaultQuestionDisplay =
        defaultQuestionDisplay[0].toUpperCase() +
        defaultQuestionDisplay.slice(1);
    } else {
      defaultQuestionDisplay = 'Choix simple';
    }
    setDefaultQuestionType(defaultQuestionDisplay);

    if (questionnaire.isfunded) {
      setSponsorsDisplay(true)
    }
    fetchAssociateThemesAndPublics();

  }, [questionnaire]);


  useEffect(() => {
    const themesQuest = [];
    const publicQuest = [];
    associatedThemesAndPublics.themesAndPublics?.resultTheme?.forEach((theme) =>
      themesQuest.push(theme.theme_id),
    );
    setTheme(themesQuest);
    associatedThemesAndPublics.themesAndPublics?.resultPublic?.forEach(
      (publicS) => publicQuest.push(publicS.public_id),
    );
    setTheme(themesQuest);
    setPublic(publicQuest);
  }, [associatedThemesAndPublics]);

  useEffect(() => {
    if (questionnaire) {
      document.title = `${questionnaire.label}`;
    }
  }, [questionnaire]);

  useEffect(() => {
    if (!questionnaire?.id) return;
    const getScores = async () => {
      try {
          const getScore = await getAllScores(questionnaire.id);
          setScores(getScore)
      } catch (error) {
        console.error("Error fetching scores:", error);
      }
    }
    getScores()
  }, [questionnaire])

  useEffect(() => {
    const resultScores = validateScores(scores);


      if (resultScores.isValid) {
          console.log('✓ Les scores sont valides');
          setScoresOk(true)
          setScoresAlert([])
        } else {
          console.log('✗ Erreurs détectées:');
          setScoresOk(false)
          setScoresAlert(resultScores.errors)
          console.log(resultScores.errors)
      }
  }, [scores])

  useEffect(() => {
          if (notInitialLoad) {
            if (scoresOk) {
              toast.showSuccess('Les scores forment un ensemble valide')
            } else {
              toast.showError('Les scores ne sont pas valides')
            }
          }
          setInitialLoad(true)

  }, [scoresOk])


  function validateScores(testScores) {

      const messages=[]
      if (!testScores || testScores.length === 0) {
        return {
            isValid: false,
            errors: ['Aucun score à valider']
        };
    }
      // Trier les testScores par scoremin
      const sorted = [...testScores].sort((a, b) => a.scoremin - b.scoremin);

      // Vérifier que le premier score commence à 0
      if (sorted[0].scoremin !== 0) {
          messages.push(`Le premier score devrait commencer à 0, mais commence à ${sorted[0].scoremin}`);
      }

      // Vérifier que le dernier score finit à 100
      if (sorted[sorted.length - 1].scoremax !== 100) {
          messages.push(`Le dernier score devrait finir à 100, mais finit à ${sorted[sorted.length - 1].scoremax}`);
      }

      // Vérifier les trous et chevauchements
      for (let i = 0; i < sorted.length - 1; i++) {
          const current = sorted[i];
          const next = sorted[i + 1];

          // Vérifier les chevauchements
          if (current.scoremax >= next.scoremin) {
              messages.push(
                  `Chevauchement entre "${current.lettre}" (${current.scoremin}-${current.scoremax}) ` +
                  `et "${next.lettre}" (${next.scoremin}-${next.scoremax})`
              );
          }

          // Vérifier les trous (il devrait y avoir exactement 1 de différence)
          // Par exemple: score1 finit à 5, score2 devrait commencer à 6
          if (current.scoremax + 1 < next.scoremin) {
              messages.push(
                  `Écart entre "${current.lettre}" (finit à ${current.scoremax}) ` +
                  `et "${next.lettre}" (commence à ${next.scoremin}). ` +
                  `Valeurs manquantes: ${current.scoremax + 1} à ${next.scoremin - 1}`
              );
          }
      }

      return {
          isValid: messages.length === 0,
          errors: messages
      };
    }


  const updateSection = (sectionId, updatedSection) => {
    setQuestionnaire((prevQuestionnaire) => ({
      ...prevQuestionnaire,
      sections: prevQuestionnaire.sections.map((section) =>
        section.id === sectionId ? { ...section, ...updatedSection } : section,
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
                  : question,
              ),
            }
          : section,
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
          questionnaire.code,
          questionnaire.default_question_type,
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
  async function toggleButtonModifierThemesAndPublics() {
    if (buttonModifierThemes === "Modifier les thèmes et publics") {
      setButtonModifierThemes("Valider");
    } else {
      try {
        const updateThemesAndPublics = await editQuestionnaireThemesAndPublics({
          questionnaire_id: questionnaire.id,
          theme,
          publicSelect,
        });
        const refreshed = await getAssociatedThemesAndPublics(questionnaire.id);
        setAssociatedThemesAndPublics(refreshed);
        setButtonModifierThemes("Modifier les thèmes et publics");
        console.log(
          "Themes and publics updated for questionnaire:",
          questionnaire.id,
        );
        toast.showSuccess("Thème(s) et public(s) mis à jour avec succès !");
      } catch (error) {
        console.error("Error updating themes and publics:", error);
        toast.showError("Erreur lors de la mise à jour des thèmes et publics");
        // Optionally show user feedback about the error
      }
    }
  }

  async function publishQuest() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/publish/${questionnaire.id}`,
        {
          method: "PUT",
        },
      );
      const data = await response.json();
      if (response.ok) {
        toast.showSuccess("Questionnaire publié avec succès !");

        setQuestionnaire((prev) => ({
          ...prev,
          ispublished: true,
        }));
      }
      return data;
    } catch {
      console.log("ERREUR lors de la publication du questionnaire");
      toast.showError("Erreur lors de la publication du questionnaire");
      return { success: false };
    }
  }

  async function downloadJson() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/questionnaires/${questionnaire.id}/export`,
      );
      const data = await response.json();
      console.log("Creating JSON:", data);
      const jsonString = JSON.stringify(data, null, 2);
      // Create a blob from the JSON string
      const blob = new Blob([jsonString], { type: "application/json" });

      // Create a temporary URL for the blob
      const url = URL.createObjectURL(blob);

      // Create a temporary anchor element and trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = `questionnaire-${questionnaire.id}.json`; // Customize filename as needed
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      console.log("File sent to browser");

      return { success: true };
    } catch {
      console.log("ERREUR lors de la création du JSON");
      toast.showError("Erreur lors du téléchargement du JSON");
      return { success: false };
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/createSection`, {
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
  // Score and Recommandation part

  const handleCreateRecoClick = () => {
    setCreateRecoPopupOpen(true);
  };
  const handleCreateScoreClick = () => {
    setCreateScorePopupOpen(true);
  };

  const handleClosePopUpReco = () => {
    setCreateRecoPopupOpen(false);
  };
  const handleClosePopUpScore = () => {
    setCreateScorePopupOpen(false);
  };

  const handleSaveReco = async (newReco, questionnaire_id = id) => {
    try {
      console.log("Appel API sauvegarde recommandation:", {
        updatedData: newReco,
        questionnaire_id: questionnaire_id,
      });

      const response = await fetch(`${import.meta.env.VITE_API_URL}/createreco`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
          result.error || "Erreur lors de la sauvegarde de la recommandation",
        );
      }

      await new Promise((resolve) => setTimeout(resolve, 100));

      const updatedReco = await getReco(questionnaire_id);
      console.log("Updated recommandations:", updatedReco);

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

  const handleSaveScore = async (newScore, questionnaire_id = id) => {
    try {
      console.log("Appel API sauvegarde score:", {
        updatedData: newScore,
        questionnaire_id: questionnaire_id,
      });

      const response = await fetch(`${import.meta.env.VITE_API_URL}/createnewscore`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newScore,
          questionnaire_id: questionnaire_id,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result = await response.json();
      console.log("Creation score, result:", result);
      if (!result.success) {
        throw new Error(
          result.error || "Erreur lors de la sauvegarde du score",
        );
      }

      await new Promise((resolve) => setTimeout(resolve, 100));

      const updatedScores = await getAllScores(questionnaire_id);
      console.log("Updated scores:", updatedScores);

      if (updatedScores) {
        setScores(updatedScores);
        toast.showSuccess("Score créé avec succès!");
        setCreateScorePopupOpen(false);
      } else {
        toast.showError("Erreur lors de la création du score");
        throw new Error("Failed to fetch updated scores");
      }
      setCreateRecoPopupOpen(false);

    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    }
  };

  const updateReco = (recoId, updatedReco) => {
    setRecommandations((prevRecommandations) =>
      prevRecommandations.map((reco) =>
        reco.id === recoId ? { ...reco, ...updatedReco } : reco,
      ),
    );
  };

  const deleteReco = (recoId) => {
    setRecommandations((prevRecommandations) =>
      prevRecommandations.filter((reco) => reco.id !== recoId),
    );
  };

  const updateScore= async() => {
    const updatedScores = await getAllScores(id);
      console.log("Updated scores:", updatedScores);

      if (updatedScores) {
        setScores(updatedScores);
        toast.showSuccess("Score créé avec succès!");
        setCreateScorePopupOpen(false);
      } else {
        toast.showError("Erreur lors de la création du score");
        throw new Error("Failed to fetch updated scores");
      }
    console.log("New scores:",updatedScores)

  };

  const deleteScore = (scoreId) => {
    let newScores = []
    setScores((prevScore) =>
      newScores = prevScore.filter((score) => score.score_id !== scoreId),
    );

  };

  //  /////////////////////////////////////
  // Thèmes et publics

  const handleThemeChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value,
    );
    setTheme(selectedOptions);
  };
  const handlePublicChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value,
    );
    setPublic(selectedOptions);
  };

  //  //////////////////////////////////////////////////////////
  // Sponsors and client logo part

  async function handleSponsorsDisplay() {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/displaysponsors/${questionnaire.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sponsorsDisplay
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

    setSponsorsDisplay(!sponsorsDisplay)
  }

  const handleClientLogo = async (e) => {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/clientlogo/${questionnaire.id}`, { method: "POST", body: formData });
      setStatusClientLogo(res.ok ? "success" : "error");
    } catch {
      setStatusClientLogo("error");
    }
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
      {/* ////////////////////////////////////////////////// */}
      {/* Header du questionnaire */}
      <div className="questionnaire-header">
        {buttonModifierQuest === "Modifier" ? (
          <div className="questionnaire-header-content">
            <QuestionnaireTitle
              questionnaire={questionnaire}
              defaultQuestionType={defaultQuestionType}
            />
            <div className="questionnaire-actions relative mt-6">
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
                onClick={() => setIsModalScoresOpen(true)}
              >
                Éditer les scores
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
                onClick={() =>
                  setButtonAffichageSection(!buttonAffichageSection)
                }
              >
                {buttonAffichageSection
                  ? "Afficher les actifs"
                  : "Tout afficher"}
              </button>

              {!questionnaire.ispublished ? (
                <div className="flex absolute right-0 space-x-3">
                  <button
                    type="button"
                    className=" bg-lime-600 border  px-3 py-2 rounded-xl text-white font-semibold text-[0.95rem] hover:-translate-y-0.5 ease-in duration-100 hover:shadow-lg hover:bg-lime-500"
                    onClick={publishQuest}
                  >
                    Publier
                  </button>
                  <button
                    type="button"
                    className=" bg-cyan-500 border px-3 py-2 rounded-xl text-white font-semibold text-[0.95rem] hover:-translate-y-0.5 ease-in duration-100 hover:shadow-lg hover:bg-cyan-400"
                    onClick={downloadJson}
                  >
                    Télécharger
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="absolute right-0 bg-cyan-500 px-3 py-2 rounded-xl text-white font-semibold text-[0.95rem] hover:-translate-y-0.5 ease-in duration-100 hover:shadow-lg hover:bg-cyan-400"
                  onClick={downloadJson}
                >
                  Télécharger
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="questionnaire-header-content">
            <QuestionnaireTitleForm
              questionnaire={questionnaire}
              onChange={handleInputChange}
              questionTypes={questionTypes}
            />
            <div className="questionnaire-actions relative mt-6">
              <button
                type="button"
                className="btn-edit-quest"
                onClick={toggleButtonModifierQuest}
              >
                {buttonModifierQuest}
              </button>

              {!questionnaire.ispublished ? (
                <div className="flex absolute right-0 space-x-3">
                  <button
                    type="button"
                    className=" bg-lime-600  px-3 py-2 rounded-xl text-white font-semibold text-[0.95rem] hover:-translate-y-0.5 ease-in duration-100 hover:shadow-lg hover:bg-lime-500"
                    onClick={publishQuest}
                  >
                    Publier
                  </button>
                  <button
                    type="button"
                    className=" bg-cyan-500 border px-3 py-2 rounded-xl text-white font-semibold text-[0.95rem] hover:-translate-y-0.5 ease-in duration-100 hover:shadow-lg hover:bg-cyan-400"
                    onClick={downloadJson}
                  >
                    Télécharger
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="absolute right-0 bg-cyan-500 border px-3 py-2 rounded-xl text-white font-semibold text-[0.95rem] hover:-translate-y-0.5 ease-in duration-100 hover:shadow-lg hover:bg-cyan-400"
                  onClick={downloadJson}
                >
                  Télécharger
                </button>
              )}
            </div>
          </div>
        )}

        {/* ////////////////////////////////////////////////// */}
        {/* Thèmes et publics */}
        <hr className="w-4/5 text-zinc-300 mx-auto" />
        {buttonModifierThemes === "Modifier les thèmes et publics" ? (
          <div className="w-full flex space-x-4 mt-6 items-start">
            <div className="w-2/5">
              <p className="ml-1 text-blue-400 w-fit text-md border-b border-blue-100 mb-2">
                Thème(s)
              </p>
              <div className="flex flex-wrap">
                {associatedThemesAndPublics?.themesAndPublics?.themeLabels?.map(
                  (theme) => (
                    <p
                      key={theme}
                      className="ml-1 bg-blue-100 text-blue-400 px-2 py-1 text-sm rounded text-nowrap mt-1"
                    >
                      {theme}
                    </p>
                  ),
                )}
              </div>
            </div>
            <div className="w-2/5">
              <p className="ml-1 text-orange-400 text-md w-fit border-b border-orange-100 mb-2">
                Public(s)
              </p>
              <div className="flex flex-wrap">
                {associatedThemesAndPublics?.themesAndPublics?.publicLabels?.map(
                  (theme) => (
                    <p
                      key={theme}
                      className="inline ml-1 bg-orange-100 text-orange-400 px-2 py-1 text-sm rounded mt-1"
                    >
                      {theme}
                    </p>
                  ),
                )}
              </div>
            </div>

            <button
              type="button"
              className="w-1/5 self-center h-14 bg-blue-600 border px-1 py-1 rounded-xl text-white font-semibold text-[0.95rem] hover:-translate-y-0.5 ease-in duration-100 hover:shadow-lg hover:bg-blue-400"
              onClick={toggleButtonModifierThemesAndPublics}
            >
              {buttonModifierThemes}
            </button>
          </div>
        ) : (
          <div className="w-full flex space-x-4 mt-6 items-center">
            <div className="form-group bg-blue-100 px-2 py-1 rounded w-2/5 mt-4">
              <label htmlFor="theme_ids" className="text-blue-400!">
                Thèmes :{" "}
              </label>
              <select
                id="theme_ids"
                name="theme_ids"
                value={theme}
                onChange={handleThemeChange}
                multiple
                size="1"
                className="text-blue-500!"
              >
                <option value="" className="px-2"></option>
                {allThemes.map((theme) => (
                  <option key={theme.id} value={theme.id} className="px-2">
                    {theme.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group bg-orange-100 px-2 py-1 rounded w-2/5 mt-4">
              <label htmlFor="public_ids" className="text-orange-500!">
                Publics :{" "}
              </label>
              <select
                id="public_ids"
                name="public_ids"
                value={publicSelect}
                onChange={handlePublicChange}
                multiple
                size="1"
                className="text-orange-500! accent-orange-500!"
              >
                <option value="" className="px-2"></option>
                {allPublics.map((publicElement) => (
                  <option
                    key={publicElement.id}
                    value={publicElement.id}
                    className="px-2 accent-orange-500!"
                  >
                    {publicElement.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              className="w-1/5 h-14 bg-blue-600 border px-1 py-1 rounded-xl text-white font-semibold text-[0.95rem] hover:-translate-y-0.5 ease-in duration-100 hover:shadow-lg hover:bg-blue-400"
              onClick={toggleButtonModifierThemesAndPublics}
            >
              {buttonModifierThemes}
            </button>
          </div>
        )}

        {/* ////////////////////////////////////////////////// */}
        {/* Sponsors et logo client */}
        <hr className="w-4/5 text-zinc-300 mx-auto mt-7 mb-4" />
        <div className="w-full flex justify-between items-start">
          <div className="w-1/2">
            <input type="checkbox"
              id="sponsorsCheck"
              name="sponsorsCheck"
              className='mr-2'
              onChange={handleSponsorsDisplay}
              checked={sponsorsDisplay}
            />
            <label htmlFor="sponsorsCheck">Afficher les sponsors</label>
          </div>
          <div className="w-1/2">
          <form onSubmit={handleClientLogo}
                >
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
              />
              <label
                htmlFor="file-upload"
                className="mr-0 ml-auto rounded block px-3 py-1 w-fit bg-blue-400 text-white shadow hover:-translate-y-0.5 hover:shadow-lg hover:bg-blue-400/80 easein)out duration-150"
              >
                Importer un logo client
              </label>
              {file ?
              <p className="text-black text-end">{file.name}</p> :
              questionnaire.logoname ?
              <p className="text-black text-end">{questionnaire.logoname}</p> :
              <div className="hidden"></div>
              }
            <button type="submit" disabled={!file} className={`mr-0 ml-auto block mt-3 rounded w-fit px-3 py-1  ${file? "bg-blue-500 text-white" : "bg-gray-300 text-gray-200"}`}>
              Enregistrer l'image
            </button>
            {!file  ? '' : statusClientLogo ? <p className="text-blue-400 text-end mt-1">✔️ image enregistrée</p> : <p className="text-red-400 text-end mt-1">❌ image non enregistrée, veilleur recommencer</p>}
          </form>
        </div>
        </div>


      </div>

      {/* //////////////////////////////////////////////////////// */}
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
                themesAndPublicsFromQuestionnaire={associatedThemesAndPublics}
                allPublics={allPublics}
                allThemes={allThemes}
                defaultQuestionType={questionnaire.default_question_type}
              />
            </div>
          ) : (
            <div key={section.id + "error"} className="hidden"></div>
          ),
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

      {/* Div pour les scores */}
      {isModalScoresOpen && (
        <SideModalLeft
          onClose={() => setIsModalScoresOpen(false)}
          handleCreateScoreClick={handleCreateScoreClick}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        >
          <div className={`sections-list`}>
            <div className="w-fit">
              <h3 className="text-xl">Scores</h3>
              <hr className="w-2/3 text-gray-300" />
            </div>
            <div className="section">
              {/* Header de la section */}
              <div className={`section-header ${scoresOk ? '': 'bg-red-500/50!'}`}>
                <div className="section-content">
                  {scoresOk ?
                    <div className="invisible"></div>
                    :
                    scoresAlert.map((alert) =>
                      <p className="my-1 text-red-950">⚠️ {alert}</p>
                      )
                  }
                  <div className="sections-list">
                    {scores.map((score) => (
                      <ScoreQuestionnaire
                        key={`score-${score.score_id}-${score.scoremin}-${score.scoremax}`}
                        questionnaireId = {id}
                        score={score}
                        onUpdateScore={updateScore}
                        onDeleteScore={deleteScore}
                        // questionnaireId={id}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SideModalLeft>
      )}
      {isCreateScorePopupOpen && isModalScoresOpen && (
        <CreateScore onSave={handleSaveScore} onClose={handleClosePopUpScore} />
      )}

      {/* Div pour les recommandations */}
      {isModalOpen && (
        <SideModal
          onClose={() => setIsModalOpen(false)}
          handleCreateRecoClick={handleCreateRecoClick}
          isModalScoresOpen={isModalScoresOpen}
          setIsModalScoresOpen={setIsModalScoresOpen}
        >
          <div className="sections-list">
            <div className="w-fit mr-0 ml-auto">
              <h3 className="text-xl">Recommandations</h3>
              <hr className="w-2/3 text-gray-300 mr-O ml-auto" />
            </div>
            <div className="section">
              {/* Header de la section */}
              <div className="section-header">
                <div className="section-content">
                  <div className="sections-list">
                    {recommandations.map((recommandation) => (
                      <RecoQuestionnaire
                        key={`recommandation-${recommandation.id}`}
                        recommandation={recommandation}
                        onUpdateReco={updateReco}
                        onDeleteReco={deleteReco}
                        // questionnaireId={id}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SideModal>
      )}
      {isCreateRecoPopupOpen && isModalOpen && (
        <CreateReco onSave={handleSaveReco} onClose={handleClosePopUpReco} />
      )}
    </div>
  );
}

export default Questionnaire;
