import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Section from '../Section/section.jsx';
import QuestionnaireTitle from './questionnaireTitle.jsx';
import QuestionnaireTitleForm from './questionnaireTitleForm';

async function getQuestionnaire(idQuestionnaire) {
    try {
        const response = await fetch(`http://localhost:3008/questionnaire/${idQuestionnaire}`);
        if (!response.ok) {
            throw new Error('Erreur lors du chargement des sections');
        }
        const data = await response.json();
        console.log('Response from server:', data);
        return data;
    } catch (error) {
        console.error('Error fetching sections:', error);
        return null;
    }
}

async function updateQuestionnaire(idQuestionnaire, label, description, insight) {
  try {
    const response = await fetch(`http://localhost:3008/updateQuestionnaire/${idQuestionnaire}`, {
    method: 'PUT',
    headers: {
    'Content-Type': 'application/json',
  },
    body: JSON.stringify({label, description, insight}) // Pass the updated questionnaire data
  });
    if (!response.ok) {
        throw new Error('Erreur lors du chargement des sections');
    }
    const data = await response.json();
    console.log('Response from server:', data);
    return data;
  } catch (error) {
    console.error('Error fetching sections:', error);
    return null;
  }
}


function Questionnaire() {
    const { id } = useParams();
    const [questionnaire, setQuestionnaire] = useState(null);
    const [button, setButton] = useState("Modifier")

    useEffect(() => {
        async function fetchQuestionnaire() {
            const data = await getQuestionnaire(id);
            setQuestionnaire(data);
        }
        fetchQuestionnaire();
    }, [id]);


     const updateSection = (sectionId, updatedSection) => {
        setQuestionnaire(prevQuestionnaire => ({
            ...prevQuestionnaire,
            sections: prevQuestionnaire.sections.map(section =>
                section.id === sectionId ? { ...section, ...updatedSection } : section
            )
        }));
    };


    const updateQuestion = (sectionId, questionId, updatedQuestion) => {
        setQuestionnaire(prevQuestionnaire => ({
            ...prevQuestionnaire,
            sections: prevQuestionnaire.sections.map(section =>
                section.id === sectionId
                    ? {
                        ...section,
                        questions: section.questions.map(question =>
                            question.id === questionId ? { ...question, ...updatedQuestion } : question
                        )
                    }
                    : section
            )
        }));
    };

    const handleInputChange = (e) => {
     const { name, value } = e.target;

      setQuestionnaire(prev => ({
          ...prev,
          [name]: value
      }));
    };

    async function toggleButton() {
      if (button === "Modifier") {
        setButton("Valider");
      } else {
        try {
          const updateQuest = await updateQuestionnaire(
            id,
            questionnaire.label,
            questionnaire.description,
            questionnaire.insight
          );
          setButton("Modifier");
          console.log('Questionnaire updated:', updateQuest);
        } catch (error) {
          console.error('Error updating questionnaire:', error);
          // Optionally show user feedback about the error
        }
      }
    }


    if (!questionnaire) {
        return <div>Ca charge (vous pouvez aller faire un cafe en attendant ^^)...</div>;
    }

    return (
        <div className="questionnaire">
          <button type="button" id="editButton" onClick={toggleButton}>{button}</button>
          {button === "Modifier" ? <QuestionnaireTitle questionnaire={questionnaire}  /> : <QuestionnaireTitleForm questionnaire={questionnaire} onChange={handleInputChange} />}
          {questionnaire.sections?.map(section => (
            <div key={section.id+'section'}>
              <Section
                  key={section.id}
                  section={section}
                  onUpdateSection={updateSection}
                  onUpdateQuestion={updateQuestion}
              />
              {/* <PopUpEditSection idSection={section_id} /> */}
            </div>
          ))}
        </div>
    );
}

export default Questionnaire;
