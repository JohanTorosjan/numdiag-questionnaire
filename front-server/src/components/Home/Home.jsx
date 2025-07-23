import React, { useState, useEffect } from 'react';
import QuestionnaireResume from "../Questionnaire/questionnaireResume";

async function getAllQuestionnairesResume() {
    try {
        const response = await fetch('http://localhost:3008/questionnairesResume');
        // if (!response.ok) {
        //     throw new Error('Erreur lors du chargement des questionnaires');
        // }
        if (response.ok) {
            const data = await response.json();
            // console.log('Response from server:', data);
            return data;
        }
    } catch (error) {
        console.error('Error fetching questionnaires:', error);
        return [];
    }
}

function Home() {
    const [questionnaires, setQuestionnaires] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuestionnaires = async () => {
            const data = await getAllQuestionnairesResume();
            setQuestionnaires(data);
            setLoading(false);
        };
        
        fetchQuestionnaires();
    }, []);

    console.log('Questionnaires:', questionnaires);

    if (loading) {
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