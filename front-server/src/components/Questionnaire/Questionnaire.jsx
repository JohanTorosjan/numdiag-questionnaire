import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Section from '../Section/section.jsx';
import QuestionnaireTitle from './questionnaireTitle.jsx';
import QuestionnaireTitleForm from './questionnaireTitleForm';
import CreateSection from '../Section/createSection.jsx';

async function getQuestionnaire(idQuestionnaire) {
    try {
        const response = await fetch(`http://localhost:3008/questionnaire/${idQuestionnaire}`);
        if (!response.ok) {
            throw new Error('Erreur lors du chargement des sections');
        }
        const data = await response.json();
        console.log('Questionnaire : ', data);
        return data;
    } catch (error) {
        console.error('Error fetching questionnaire:', error);
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
    console.log('Mise à jour du questionnaire :', data);
    return data;
  } catch (error) {
    console.error('Error updating questionnaire:', error);
    return null;
  }
}


function Questionnaire() {
    const { id } = useParams();
    const [questionnaire, setQuestionnaire] = useState(null);
    const [buttonModifierQuest, setButtonModifierQuest] = useState("Modifier");
    const [isCreateSectionPopupOpen, setIsCreateSectionPopupOpen] = useState(false);

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

    async function toggleButtonModifierQuest() {
      if (buttonModifierQuest === "Modifier") {
        setButtonModifierQuest("Valider");
      } else {
        try {
          const updateQuest = await updateQuestionnaire(
            id,
            questionnaire.label,
            questionnaire.description,
            questionnaire.insight
          );
          setButtonModifierQuest("Modifier");
          console.log('Questionnaire updated:', updateQuest);
        } catch (error) {
          console.error('Error updating questionnaire:', error);
          // Optionally show user feedback about the error
        }
      }
    }

    const handleCreateSectionClick = () => {
        setIsCreateSectionPopupOpen(true);
    };

  const handleClosePopupSection = () => {
      setIsCreateSectionPopupOpen(false);
  };

  const handleSaveSection = async (newSection, questionnaire_id=id) => {
      try {
          // Ici tu feras ton appel API plus tard
          console.log('Appel API sauvegarde section:', {
              updatedData: newSection,
              questionnaire_id: questionnaire_id,
          });
          // setIsCreating(true)
          const response = await fetch(`http://localhost:3008/createSection`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  // Ajoute l'auth si nécessaire
                  // 'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                  ...newSection,
                  questionnaire_id: questionnaire_id,
              })
              });


          if (!response.ok) {
              throw new Error(`Erreur HTTP: ${response.status}`);
          }

          const result = await response.json();

          if (!result.success) {
          throw new Error(result.error || 'Erreur lors de la sauvegarde');
          }
          const data = await getQuestionnaire(id);
          setQuestionnaire(data);
          // Ferme la popup
          setIsCreateSectionPopupOpen(false);
      } catch (error) {
          console.error('Erreur lors de la sauvegarde:', error);
      }
      // finally{
      //     setIsCreating(false)
      // }
    }


    if (!questionnaire) {
        return <div>Ca charge (vous pouvez aller faire un cafe en attendant ^^)...</div>;
    }

    return (
        <div className="questionnaire">
          <button type="button" id="editQuestButton" onClick={toggleButtonModifierQuest}>{buttonModifierQuest}</button>
          {buttonModifierQuest === "Modifier" ? <QuestionnaireTitle questionnaire={questionnaire}  /> : <QuestionnaireTitleForm questionnaire={questionnaire} onChange={handleInputChange} />}
          {questionnaire.sections?.map(section => (
            <div key={section.id+'section'}>
              <Section
                  key={section.id}
                  section={section}
                  onUpdateSection={updateSection}
                  onUpdateQuestion={updateQuestion}
                  setQuestionnaire={setQuestionnaire}
                  questionnaireId={id}
              />
              {/* <PopUpEditSection idSection={section_id} /> */}
            </div>
          ))}
          <button onClick={handleCreateSectionClick} className="edit-button">
                Créer une section
            </button>

            {/* Popup de création de section */}
            {isCreateSectionPopupOpen && (
                <CreateSection
                    onSave={handleSaveSection}
                    onClose={handleClosePopupSection}
                />
            )}
        </div>
    );
}

export default Questionnaire;
