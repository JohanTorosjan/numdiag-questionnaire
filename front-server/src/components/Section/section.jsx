import QuestionResume from '../Question/questionResume';
import PopUpEditQuestion from '../popups/editQuestion';
import './Section.css'; // Import du CSS
import React from 'react';

async function getQuestionofSection(sectionId) {
    try {
        const response = await fetch(`http://localhost:3008/sections/${sectionId}`);
        if (!response.ok) {
            throw new Error('Erreur lors du chargement des questions');
        }
        const data = await response.json();
        return data.questions;
    } catch (error) {
        console.error('Error fetching questions:', error);
        return {};
    }
}

function Section({ section,onUpdateSection,onUpdateQuestion }) {

 const [isQuestionsOpen, setIsQuestionsOpen] = React.useState(false);

    const toggleQuestions = () => {
      setIsQuestionsOpen(!isQuestionsOpen);
    };

    return (
 <div className="section">

      {/* Bouton chevron pour déplier/replier les questions */}
      {Array.isArray(section.questions) && section.questions.length > 0 && (
        <div className="questions-toggle">
          <button onClick={toggleQuestions} className="chevron-button">
            <svg
              className={`chevron-icon ${isQuestionsOpen ? 'rotated' : ''}`}
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
            <span>
                  {section.label}  ({section.questions.length})
            </span>
          </button>
        </div>
      )}

      {/* Container des questions avec animation */}
      <div className={`questions-container ${isQuestionsOpen ? 'open' : 'closed'}`}>
              <p>{section.description}</p>

        <div className="questions-list">
          {Array.isArray(section.questions) && section.questions.map(question => (
            <QuestionResume
              key={question.id}
              question={question}
              sectionId={section.id} // Passe l'ID de la section
              onUpdateQuestion={onUpdateQuestion} // Passe le callback
            />
          ))}
        </div>
      </div>

    </div>
  );

}


export default Section;