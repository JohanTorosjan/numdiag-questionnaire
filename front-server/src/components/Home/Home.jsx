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

async function updateQuestionnaire(idQuestionnaire, isActive) {
  try {
    const response = await fetch(`http://localhost:3008/updateQuestionnaire/${idQuestionnaire}`, {
    method: 'PUT',
    headers: {
    'Content-Type': 'application/json',
  },
    body: JSON.stringify({isActive}) // Pass the updated questionnaire data
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
    // const [button, setButton] = useState("Actif")

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
            {questionnaires.map(q => (
              q.isactive === true ? (
                <div key={q.id}>
                <QuestionnaireResume key={q.id} idQuestionnaire={q.id} label={q.label} />
                <button type="button" onClick={() => toggleButton(q.id, q.isactive)}>{q.isactive ? "Désactiver" : "Activer"}</button>
                </div>
              ) : (<p>et non</p>)
              ))}

        </div>
    );
}
