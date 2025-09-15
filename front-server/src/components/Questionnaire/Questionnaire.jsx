import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Section from '../Section/section.jsx';

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

function Questionnaire() {
    const { id } = useParams();
    const [questionnaire, setQuestionnaire] = useState(null);

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



    if (!questionnaire) {
        return <div>Ca charge (vous pouvez aller faire un cafe en attendant ^^)...</div>;
    }

    return (
        <div className="questionnaire">
            
        <h1>
        {questionnaire.label}
        </h1>
        <h2>
        {questionnaire.description}
        </h2>         
        <p>
        {questionnaire.insight}
        </p>  


            {questionnaire.sections?.map(section => (
                <Section
                    key={section.id}
                    section={section}
                    onUpdateSection={updateSection}
                    onUpdateQuestion={updateQuestion}
                />
            ))}
        </div>
    );
}

export default Questionnaire;