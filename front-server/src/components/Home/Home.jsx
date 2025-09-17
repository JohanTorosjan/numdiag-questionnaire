import React, { useState, useEffect } from 'react';
import QuestionnaireResume from "../Questionnaire/questionnaireResume";
import './home.css';

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

async function updateQuestionnaire(idQuestionnaire, isactive) {
  try {
    const response = await fetch(`http://localhost:3008/updateQuestionnaire/${idQuestionnaire}`, {
    method: 'PUT',
    headers: {
    'Content-Type': 'application/json',
  },
    body: JSON.stringify({isactive})
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

export default function Home() {
    const [questionnaires, setQuestionnaires] = useState([]);
    const [loading, setLoading] = useState(true);
    const [buttonAffichage, setButtonAffichage] = useState(false)


    useEffect(() => {
        const fetchQuestionnaires = async () => {
            const data = await getAllQuestionnairesResume();
            setQuestionnaires(data);
            setLoading(false);
        };

        fetchQuestionnaires();
    }, []);

    console.log('Questionnaires:', questionnaires);

    const toggleButton = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      console.log(newStatus);
      const updateQuest = await updateQuestionnaire(id, newStatus);

      // Update the local state to reflect the change
      setQuestionnaires(prev =>
        prev.map(q =>
          q.id === id ? { ...q, isactive: newStatus } : q
        )
      );

      console.log('Questionnaire updated:', updateQuest);
    } catch (error) {
      console.error('Error updating questionnaire:', error);
    }
  };

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
            <button type="button" onClick={() => setButtonAffichage(!buttonAffichage)}>{buttonAffichage ? "Afficher les actifs" : "Tout afficher"}</button>
            {questionnaires.map(q => (
              (q.isactive || buttonAffichage) ? (
                <div key={q.id} className={q.isactive ? "bg-green-300" : "bg-red-300"} >
                <QuestionnaireResume key={q.id} idQuestionnaire={q.id} label={q.label}  />
                <button type="button" onClick={() => toggleButton(q.id, q.isactive)}>{q.isactive ? "Désactiver" : "Activer"}</button>
                </div>
              ) : (<div key={q.id} className="hidden"></div>)
              ))}

        </div>
    );
}
