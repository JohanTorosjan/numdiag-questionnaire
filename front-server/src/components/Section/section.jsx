import QuestionResume from "../Question/questionResume";
import SectionUpdateForm from "./sectionUpdateForm";
import "./Section.css";
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

  async function updateSection(idSection, updates) {
    try {
      const response = await fetch(`http://localhost:3008/updateSection/${idSection}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates)
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour en db des infos de section');
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
          {
            label: isSection.label,
            description: isSection.description,
            tooltip: isSection.tooltip,
            nbpages: isSection.nbpages
          }
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
      {/* Header de la section */}
      <div className="section-header">
        <div className="section-header-left">
          {/* Bouton chevron */}
          <button onClick={toggleQuestions} className="chevron-button">
            <svg
              className={`chevron-icon ${isQuestionsOpen ? "rotated" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              width="20"
              height="20"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Contenu de la section */}
          <div className="section-content">
            {buttonUpdateSection === "Modifier" ? (
              <div className="section-info">
                <h3 className="section-title">{section.label}</h3>
                <div className="section-metadata">
                  <span className="metadata-item">
                    <span className="metadata-label">Questions:</span> {section.questions.length}
                  </span>
                  <span className="metadata-item">
                    <span className="metadata-label">Pages:</span> {section.nbpages}
                  </span>
                </div>
                {section.description && (
                  <p className="section-description">{section.description}</p>
                )}
                {section.tooltip && (
                  <p className="section-tooltip"> {section.tooltip}</p>
                )}
              </div>
            ) : (
              <SectionUpdateForm section={isSection} onChange={handleSectionChange} />
            )}
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="section-actions">
          <button 
            type="button" 
            className="btn-action btn-edit" 
            onClick={toggleButtonUpdateSection}
          >
            {buttonUpdateSection}
          </button>
          <button 
            type="button" 
            className={`btn-action btn-toggle ${section.isactive ? 'active' : 'inactive'}`}
            onClick={() => toggleButtonActiveSection(section.id, section.isactive)}
          >
            {section.isactive ? "🗑️" : "Activer"}
          </button>
        </div>
      </div>

      {/* Container des questions avec animation */}
      <div className={`questions-container ${isQuestionsOpen ? "open" : "closed"}`}>
        <div className="questions-list">
          {Array.isArray(section.questions) &&
            [...section.questions]
              .sort((a, b) => {
                if (a.page !== b.page) {
                  return a.page - b.page;
                }
                return a.position - b.position;
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