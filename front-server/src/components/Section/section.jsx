import QuestionResume from '../Question/questionResume';

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

function Section({ sectionId, sectionTitle, sectionContent }) {
  const questions = getQuestionofSection(sectionId);
  
  return (
    <div className="section">
      <h2>{sectionTitle}</h2>
      <div>
        {Array.isArray(questions) && questions.map(question => (
          <QuestionResume
            key={question.id}
            questionId={question.id}
            questionLabel={question.label}
          />
        ))}
      </div>
      <p>{sectionContent}</p>
    </div>
  );
}


export default Section;