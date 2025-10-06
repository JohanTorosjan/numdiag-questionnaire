import QuestionResume from "../Question/questionResume";
import PopUpEditQuestion from "../popups/editQuestion";
import "./Section.css"; // Import du CSS
import React from "react";

function Section({
  section,
  onUpdateSection,
  onUpdateQuestion,
  setQuestionnaire,
  questionnaireId,
}) {
  const [isQuestionsOpen, setIsQuestionsOpen] = React.useState(false);

  const toggleQuestions = () => {
    setIsQuestionsOpen(!isQuestionsOpen);
  };

  return (
    <div className="section">
      {/* Bouton chevron pour déplier/replier les questions */}
      <div className="questions-toggle">
        <button onClick={toggleQuestions} className="chevron-button">
          <svg
            className={`chevron-icon ${isQuestionsOpen ? "rotated" : ""}`}
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
          {/* span nécessaire du coup ? */}
          <span>
            {section.label} ({section.questions.length})
          </span>
        </button>
      </div>

      {/* Container des questions avec animation */}
      <div
        className={`questions-container ${isQuestionsOpen ? "open" : "closed"}`}
      >
        <p>{section.description}</p>
        <p>Nombre de pages : {section.nbpages}</p>
        <div className="questions-list">
          {Array.isArray(section.questions) &&
            [...section.questions]
              .sort((a, b) => {
                if (a.page !== b.page) {
                  return a.page - b.page; // d'abord tri par page
                }
                return a.position - b.position; // puis tri par position
              })
              .map((question) => (
                <QuestionResume
                  key={question.id}
                  question={question}
                  sectionId={section.id}
                  onUpdateQuestion={onUpdateQuestion}
                  sectionNbPages={section.nbpages}
                  setQuestionnaire={setQuestionnaire}
                  questionnaireId={questionnaireId}
                />
              ))}
        </div>
      </div>
    </div>
  );
}

export default Section;
