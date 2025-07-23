import QuestionnaireResume from "../Questionnaire/questionnaireResume";

function getAllQuestionnairesResume() {
    try {
        const response = fetch('http://localhost:3008/questionnairesResume');
        if (!response.ok) {
            throw new Error('Erreur lors du chargement des questionnaires');
        }
        return response.json();
    } catch (error) {
        console.error('Error fetching questionnaires:', error);
        return [];
    }
}

function Home() {
    const questionnaires = getAllQuestionnairesResume();

    if (!questionnaires || questionnaires.length === 0) {
        return (
            <div className="home">
                <h1>Bienvenue sur le CMS NumDiag</h1>
                <p>Voici la liste des questionnaires disponibles :</p>
                <div>Ca charge (vous pouvez aller faire un cafe en attendant ^^)...</div>
            </div>
        );
    }

    return (
        <div className="home">
            <h1>Bienvenue sur le CMS NumDiag</h1>
            <p>Voici la liste des questionnaires disponibles :</p>
            {questionnaires.map(q => (
                <QuestionnaireResume key={q.id} idQuestionnaire={q.id} label={q.label} />
            ))}
        </div>
    );
}

export default Home;