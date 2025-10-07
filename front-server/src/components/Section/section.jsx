import QuestionResume from "../Question/questionResume";
import SectionUpdateForm from "./sectionUpdateForm";
// import PopUpEditQuestion from "../popups/editQuestion";
import "./Section.css"; // Import du CSS
import React from "react";
import { useToast } from '../../ToastSystem';

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
  const toast = useToast();


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

  async function updateSection(idSection, updates) {
    try {
      const response = await fetch(`http://localhost:3008/updateSection/${idSection}`, {
      method: 'PUT',
      headers: {
      'Content-Type': 'application/json',
    },
      body: JSON.stringify(updates) // Pass the updated section data
    });
      if (!response.ok) {
          toast.showError('Erreur lors de la mise à jour de la section');
          throw new Error('Erreur lors de la mise à jour en db des infos de section');
        } else {
        toast.showSuccess('Section mise à jour avec succès !');
      }
      const data = await response.json();
      console.log('Mise à jour de la section :', idSection);
      onUpdateSection(idSection, updates);
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
          section.id,
          {label:isSection.label,
          description:isSection.description,
          tooltip:isSection.tooltip,
          nbpages:isSection.nbpages}
        );
        setButtonUpdateSection("Modifier");
        console.log('Section updated:', updateSect);
      } catch (error) {
        console.error('Error updating section:', error);
      }
    }
  }

  const toggleButtonActiveSection = async (section_id, currentStatus) => {
    try {
      const newStatus = !currentStatus;

      const data = await updateSection(section_id, { isActive: newStatus });

      console.log('Mise à jour de la section isActive :', data);
      setSection(prev => ({ ...prev, isactive: newStatus }));
      onUpdateSection(section_id, { isactive: newStatus });
      return data;
    } catch (error) {
      console.error('Error updating section isActive:', error);
      return null;
    }
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

        </button>
          <button type="button" id="updateSectionButton" onClick={toggleButtonUpdateSection}>{buttonUpdateSection}</button>
          {/* span nécessaire du coup ? */}
          {buttonUpdateSection === "Modifier" ?
          <span>
            {section.label} (Questions: {section.questions.length}) Description:"{section.description}" Tooltip: "{section.tooltip}" Nombre de pages: "{section.nbpages}"
          </span> :
          <SectionUpdateForm section={isSection} onChange={handleSectionChange} />}
          <button type="button" onClick={() => toggleButtonActiveSection(section.id, section.isactive)}>{section.isactive ? "Désactiver" : "Activer"}</button>
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
