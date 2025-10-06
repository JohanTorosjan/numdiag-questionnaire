import React, { useState, useEffect } from 'react';
import QuestionnaireResume from "../Questionnaire/questionnaireResume";
import CreateQuestionnaire from "../Questionnaire/createQuestionnaire";
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
    const [buttonAffichage, setButtonAffichage] = useState(false);
    const [isCreateQuestPopupOpen, setIsCreateQuestPopupOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);


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

  const handleCreateQuestClick = () => {
        setIsCreateQuestPopupOpen(true);
    };

  const handleClosePopupQuestionnaire = () => {
      setIsCreateQuestPopupOpen(false);
  };

  const handleSaveQuestionnaire = async (newQuestionnaire) => {
      try {
          // Ici tu feras ton appel API plus tard
          console.log('Appel API pour sauvegarder:', {
              updatedData: newQuestionnaire
          });
          setIsCreating(true)
          const response = await fetch(`http://localhost:3008/createQuestionnaire`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  // Ajoute l'auth si nécessaire
                  // 'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                  ...newQuestionnaire
              })
              });


          if (!response.ok) {
              throw new Error(`Erreur HTTP: ${response.status}`);
          }

          const result = await response.json();

          if (!result.success) {
          throw new Error(result.error || 'Erreur lors de la sauvegarde');
          }
          const data = await getAllQuestionnairesResume();
          setQuestionnaires(data);
          // Ferme la popup
          setIsCreateQuestPopupOpen(false);
      } catch (error) {
          console.error('Erreur lors de la sauvegarde:', error);
      }
      finally{
          setIsCreating(false)
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
                <div key={q.id+'questionnaire'} className={q.isactive ? "bg-green-300" : "bg-red-300"} >
                <QuestionnaireResume key={q.id} idQuestionnaire={q.id} label={q.label}  />
                <button type="button" onClick={() => toggleButton(q.id, q.isactive)}>{q.isactive ? "Désactiver" : "Activer"}</button>
                </div>
              ) : (<div key={q.id+'error'} className="hidden"></div>)
            ))}
            <button onClick={handleCreateQuestClick} className="edit-button">
                Créer un questionnaire
            </button>

            {/* Popup de création de questionnaire */}
            {isCreateQuestPopupOpen && (
                <CreateQuestionnaire
                    onSave={handleSaveQuestionnaire}
                    onClose={handleClosePopupQuestionnaire}
                />
            )}

        </div>
    );
}
