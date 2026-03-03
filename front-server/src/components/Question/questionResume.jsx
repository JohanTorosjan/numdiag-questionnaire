import { useState, useEffect } from "react";
import PopUpEditQuestion from "../popups/editQuestion";
import AnswersResume from "../../Answers/answersResume";
import PopUpEditAnswerSlots from "../../Answers/editAnswerSlots";
import { useToast } from "../../ToastSystem";
import "./questionResume.css";
import PopUpCreateAnswer from "../../Answers/createAnswers";
import PopUpDelete from "../popups/deleteQuestion";
import { getPublicsAndThemes } from "../ThemePublic/themePublicFront.js";
const answerTypeMatch = {
  choix_simple: "Choix simple",
  entier: "Entier",
  choix_multiple: "Choix multiple",
  libre: "Libre",
};

function QuestionResume({
  question,
  sectionId,
  onUpdateQuestion,
  sectionNbPages,
  setQuestionnaire,
  questionnaireId,
  themesAndPublicsFromQuestionnaire,
  allPublics,
  allThemes,
}) {
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isEditAnswerSlotsOpen, setIsEditAnswerSlotsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isAnswersOpen, setIsAnswersOpen] = useState(false);
  const [isCreateAnswersOpen, setIsCreateAnswersOpen] = useState(false);
  const [isDeleteQuestionOpen, setIsDeleteQuestionOpen] = useState(false);
  const [themes, setThemes] = useState([]);
  const [publics, setPublics] = useState([false]);

  const openCreateAnswers = () => {
    setIsCreateAnswersOpen(true);
  };

  const closeCreateAnswers = () => {
    setIsCreateAnswersOpen(false);
  };

  const handleDeleteClick = async () => {
    setIsDeleteQuestionOpen(true);
  };

  const handleCloseDeleteQuestionOpen = () => {
    setIsDeleteQuestionOpen(false);
  };

  useEffect(() => {
    const fetchThemesAndPublics = async () => {
      const data = await getPublicsAndThemes(question.id);
      setThemes(data.themesAndPublics.themeLabels);
      setPublics(data.themesAndPublics.publicLabels);
    };

    fetchThemesAndPublics();
  }, [question]);

  const handleDeleteQuestion = async () => {
    try {
      debugger
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/questions/${question.id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        },
      );

      if (response.status === 200) {
        setIsDeleteQuestionOpen(false);

        try {
          const responseQ = await fetch(
            `${import.meta.env.VITE_API_URL}/questionnaire/${questionnaireId}`,
          );
          if (!responseQ.ok) {
            throw new Error("Erreur lors du chargement des sections");
          }

          const data = await responseQ.json();
          console.log("Questionnaire :", data);
          toast.showSuccess("Question supprimée");

          setQuestionnaire(data);
        } catch (error) {
          console.error("Error fetching questionnaire:", error);
          toast.showError("Erreur lors du rechargement");
          return null;
        }
      }
    } catch (e) {
      console.log(e);
      toast.showError("Erreur de suppression");
    }
  };

  const handleSaveAnswers = async (newAnswers) => {
    console.log(newAnswers);
    const response = await fetch(`${import.meta.env.VITE_API_URL}/reponses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question_id: question.id,
        label: newAnswers.label,
        tooltip: newAnswers.tooltip,
        plafond: newAnswers.plafond,
        recommandation: newAnswers.recommandation,
        valeurScore: newAnswers.valeurScore,
      }),
    });

    const data = await response.json();

    if (response.status == 201) {
      try {
        const responseQ = await fetch(
          `${import.meta.env.VITE_API_URL}/questionnaire/${questionnaireId}`,
        );
        if (!responseQ.ok) {
          throw new Error("Erreur lors du chargement des sections");
        }
        const dataQ = await responseQ.json();
        console.log("Questionnaire : ", dataQ);
        setQuestionnaire(dataQ);
        setIsCreateAnswersOpen(false);
        return;
      } catch (error) {
        console.error("Error fetching questionnaire:", error);
        toast.showError("Erreur en voulant recharger la page");
        setIsCreateAnswersOpen(false);
      }
    } else {
      toast.showError("Erreur lors de la création");
    }
    return data;
  };

  const answerTypeDisplayed = answerTypeMatch[question.questiontype];
  const toast = useToast();

  const toggleAnswers = () => {
    setIsAnswersOpen(!isAnswersOpen);
  };

  const handleEditClick = () => {
    setIsEditPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsEditPopupOpen(false);
  };

  const handleEditSlotsClick = () => {
    setIsEditAnswerSlotsOpen(true);
  };

  const handleCloseSlotsPopup = () => {
    setIsEditAnswerSlotsOpen(false);
  };

  const handleSaveQuestion = async (updatedQuestion, publics, themes) => {
    try {
      setIsUpdating(true);
      if (
        question.position !== updatedQuestion.position ||
        question.page !== updatedQuestion.page
      ) {
        const updatePositionResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/questions/${question.id}/position`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              position: updatedQuestion.position,
              page: updatedQuestion.page,
            }),
          },
        );

        if (!updatePositionResponse.ok) {
          toast.showError("Erreur lors de la mise a jour de la position");
          throw new Error(`Erreur HTTP: ${updatePositionResponse.status}`);
        }
      }

      if (question.questiontype !== updatedQuestion.questiontype) {
        const deletingResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/questions/${question.id}/deleteReponses`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        console.log(deletingResponse);
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/questions/${question.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            section_id: sectionId,
            ...updatedQuestion,
            themes,
            publics,
          }),
        },
      );

      if (!response.ok) {
        toast.showError("Erreur lors de la mise a jour de la question");
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        toast.showError("Erreur");
        throw new Error(result.error || "Erreur lors de la sauvegarde");
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/questionnaire/${questionnaireId}`,
        );
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des sections");
        }
        const data = await response.json();
        setQuestionnaire(data);
        setIsEditPopupOpen(false);
        toast.showSuccess("Question mise à jour");
      } catch (error) {
        toast.showError("Erreur fetching questionnaire");
        console.error("Error fetching questionnaire:", error);
        return null;
      }
    } catch (error) {
      toast.showError("Erreur lors de la sauvegarde");
      console.error("Erreur lors de la sauvegarde:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const saveAnswersSlots = async (updatedSlots) => {
    try {
      console.log("aaa");
      console.log(updatedSlots);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/questions/${question.id}/tranches`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tranches: updatedSlots.tranches }),
        },
      );

      const result = await response.json();
      console.log("Tranches saved:", result);
      return result;
    } catch (error) {
      console.error("Error saving tranches:", error);
      throw new Error(error);
    }
  };

  return (
    <div className="question-resume">
      {/* Header de la question */}
      <div className="question-header">
        <div className="question-main-info">
          <h4 className="question-title">
            <p>
              {question.page}.{question.position}{" "}
            </p>
            {question.id}
            {question.label}
            {question.mandatory && <span className="mandatory-badge">*</span>}
            <p className="question-tooltip-text">{question.tooltip} </p>
          </h4>
          <div className="flex justify-between items-start">
            <div className="space-x-1.5 w-1/3">
              <span className="question-type-badge text-nowrap">
                {answerTypeDisplayed}
              </span>
              <span className="question-type-badge text-nowrap">
                Page : {question.page}
              </span>
              <span className="question-type-badge text-nowrap">
                Coeff : {question.coeff}
              </span>
            </div>
            <div className="w-1/2 flex space-x-4">
              <span className="">
                {themes.length === 0 ? (
                  <p className="rounded px-2 py-1 mx-1 my-1 bg-blue-100 text-blue-400 text-nowrap text-sm line-through">
                    Pas de thème
                  </p>
                ) : (
                  <div className="flex flex-wrap w-full" key={themes[0].label}>
                    {themes.map((theme) => (
                      <p
                        className="rounded px-2 py-1 mx-1 my-1 bg-blue-100 text-blue-400 text-nowrap text-sm"
                        key={theme.label + theme.id}
                      >
                        {theme.label}
                      </p>
                    ))}
                  </div>
                )}
              </span>
              <span className="">
                {publics.length === 0 ? (
                  <p className="rounded px-2 py-1 mx-1 my-1 bg-orange-100 text-orange-400 text-nowrap text-sm line-through">
                    Pas de public
                  </p>
                ) : (
                  <div className="flex flex-wrap w-full" key={publics[0].label}>
                    {publics.map((publicSelect) => (
                      <p
                        className="rounded px-2 py-1 mx-1 my-1 bg-orange-100 text-orange-400 text-nowrap text-sm"
                        key={publicSelect.label + publicSelect.id}
                      >
                        {publicSelect.label}
                      </p>
                    ))}
                  </div>
                )}
              </span>
            </div>
          </div>
        </div>

        <button onClick={handleEditClick} className="btn-edit-question">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          Éditer
        </button>
        <button onClick={handleDeleteClick} className="btn-edit-question">
          🗑️
        </button>
      </div>

      {/* Description */}
      {question.description && (
        <p className="question-description">{question.description}</p>
      )}

      {/* Section réponses */}
      <div className="question-answers-section">
        {/* Réponses choix multiple/simple */}
        {Array.isArray(question.reponses) &&
          question.reponses.length > 0 &&
          (question.questiontype === "choix_multiple" ||
            question.questiontype === "choix_simple") && (
            <div className="answers-toggle-wrapper">
              <button onClick={toggleAnswers} className="btn-toggle-answers">
                <svg
                  className={`chevron-icon ${isAnswersOpen ? "rotated" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                <span>Réponses ({question.reponses.length})</span>
              </button>
            </div>
          )}

        {/* Tranches pour type entier */}
        {question.questiontype === "entier" && (
          <div className="answers-toggle-wrapper">
            <button onClick={handleEditSlotsClick} className="btn-edit-slots">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
              <span>Éditer les tranches de réponses</span>
            </button>
          </div>
        )}

        {/* Container des réponses */}
        <div
          className={`answers-container ${isAnswersOpen ? "open" : "closed"}`}
        >
          {Array.isArray(question.reponses) &&
            question.reponses.map((answer) => (
              <AnswersResume
                key={answer.id}
                answer={answer}
                answerType={question.questiontype}
                setQuestionnaire={setQuestionnaire}
                questionnaireId={questionnaireId}
              />
            ))}
        </div>
      </div>

      {/* Popups */}
      {isEditPopupOpen && (
        <PopUpEditQuestion
          question={question}
          onSave={handleSaveQuestion}
          onClose={handleClosePopup}
          sectionNbPages={sectionNbPages}
          selectedThemes={themes}
          selectedPublics={publics}
          allPublics={allPublics}
          allThemes={allThemes}
        />
      )}
      {isEditAnswerSlotsOpen && (
        <PopUpEditAnswerSlots
          onClose={handleCloseSlotsPopup}
          onSave={saveAnswersSlots}
          questionId={question.id}
        />
      )}

      {(question.questiontype === "choix_multiple" ||
        question.questiontype === "choix_simple") && (
        <div className="create-answer-container">
          <button className="btn-answer-question" onClick={openCreateAnswers}>
            <span className="btn-icon">+</span>
            Ajouter une réponse
          </button>
        </div>
      )}

      {isCreateAnswersOpen && (
        <PopUpCreateAnswer
          answerType={question.questiontype}
          onClose={closeCreateAnswers}
          onSave={handleSaveAnswers}
        />
      )}

      {isDeleteQuestionOpen && (
        <PopUpDelete
          question={true}
          onCancel={handleCloseDeleteQuestionOpen}
          onConfirm={handleDeleteQuestion}
        />
      )}
    </div>
  );
}

export default QuestionResume;
