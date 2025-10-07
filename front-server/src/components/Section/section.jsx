import QuestionResume from "../Question/questionResume";
import SectionUpdateForm from "./sectionUpdateForm";
// import PopUpEditQuestion from "../popups/editQuestion";
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
  const [isSection, setSection] = React.useState(section);
  const [buttonUpdateSection, setButtonUpdateSection] = React.useState("Modifier");


  const toggleQuestions = () => {
    setIsQuestionsOpen(!isQuestionsOpen);
  };

  const handleSectionChange = (e) => {
     const { name, value } = e.target;

      setSection(prev => ({
          ...prev,
          [name]: value
      }));
    };

  async function updateSection(idSection, label, description, tooltip, nbPages, isActive) {
    try {
      const response = await fetch(`http://localhost:3008/updateSection/${idSection}`, {
      method: 'PUT',
      headers: {
      'Content-Type': 'application/json',
    },
      body: JSON.stringify({label, description, tooltip, nbPages, questionnaireId, isActive}) // Pass the updated section data
    });
      if (!response.ok) {
          throw new Error('Erreur lors de la mise à jour en db des infos de section');
      }
      const data = await response.json();
      console.log('Mise à jour de la section :', data);
      return data;
    } catch (error) {
      console.error('Error updating section:', error);
      return null;
    }
  }

  async function toggleButtonUpdateSection() {
    if (buttonUpdateSection === "Modifier") {
      setButtonUpdateSection("Valider");
    } else {
      try {
        const updateSect = await updateSection(
          isSection.id,
          isSection.label,
          isSection.description,
          isSection.tooltip,
          isSection.nbPages
        );
        setButtonUpdateSection("Modifier");
        console.log('Section updated:', updateSect);
      } catch (error) {
        console.error('Error updating section:', error);
      }
    }
  }



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

        </button>
          <button type="button" id="updateSectionButton" onClick={toggleButtonUpdateSection}>{buttonUpdateSection}</button>
          {/* span nécessaire du coup ? */}
          {buttonUpdateSection === "Modifier" ?
          <span>
            {section.label} ({section.questions.length})
          </span> :
          <SectionUpdateForm section={isSection} onChange={handleSectionChange} />}
      </div>
            <div>{section.id}</div>
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
