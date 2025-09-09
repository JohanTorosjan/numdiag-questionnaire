import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Section from '../Section/section.jsx';

async function getAllQuestionnaire(idQuestionnaire) {
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
            const data = await getAllQuestionnaire(id);
            debugger
            setQuestionnaire(data);
        }
        fetchQuestionnaire();
    }, [id]);

    if (!questionnaire) {
        return <div>Ca charge (vous pouvez aller faire un cafe en attendant ^^)...</div>;
    }

    return (
        <div className="questionnaire">
            {questionnaire.sections?.map(section => (
                <Section
                    key={section.id}
                    sectionId={section.id}
                    sectionTitle={section.label}
                    sectionContent={section.description}
                />
            ))}
        </div>
    );
}

export default Questionnaire;