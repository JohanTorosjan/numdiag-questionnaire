async function getAllQuestionnaire(idQuestionnaire) {
    try {
        const response = await fetch(`http://localhost:3008/questionnaire/${idQuestionnaire}`);
        if (!response.ok) {
            throw new Error('Erreur lors du chargement des sections');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching sections:', error);
        return [];
    }
}

function Questionnaire({ questionnaireId }) {
    let questionnaire = getAllQuestionnaire(questionnaireId);

    return (
        <div className="questionnaire">
            {questionnaire.sections.map(section => (
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