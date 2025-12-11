import './home.css';
import React, { useState, useEffect } from 'react';
import QuestionnaireResume from "../Questionnaire/questionnaireResume";
import CreateQuestionnaire from "../Questionnaire/createQuestionnaire";
import { useToast } from '../../ToastSystem';
import DocumentTitle from '../hooks/documentTitle';

async function getAllQuestionnairesResume() {
    try {
        const response = await fetch('http://localhost:3008/questionnairesResume');
        if (response.ok) {
            const data = await response.json();
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
    DocumentTitle("Accueil – NumDiag CMS");
    const [questionnaires, setQuestionnaires] = useState([]);
    const [loading, setLoading] = useState(true);
    const [buttonAffichage, setButtonAffichage] = useState(false);
    const [isCreateQuestPopupOpen, setIsCreateQuestPopupOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [showPublished, setShowPublished] = useState(true);
    const toast = useToast();

    useEffect(() => {
        const fetchQuestionnaires = async () => {
            const data = await getAllQuestionnairesResume();
            setQuestionnaires(data);
            setLoading(false);
        };

        fetchQuestionnaires();
    }, []);

    console.log('Questionnaires:', questionnaires);

    const toggleButtonActive = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      console.log(newStatus);
      const updateQuest = await updateQuestionnaire(id, newStatus);

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
          console.log('Appel API pour sauvegarder:', {
              updatedData: newQuestionnaire
          });
          setIsCreating(true)
          const response = await fetch(`http://localhost:3008/createQuestionnaire`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
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
            toast.showError('Erreur lors de la création du questionnaire');
            throw new Error(result.error || 'Erreur lors de la sauvegarde');
          } else {
            toast.showSuccess('Questionnaire créé avec succès!');
          }
          const data = await getAllQuestionnairesResume();
          setQuestionnaires(data);
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
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p className="loading-text">Chargement des questionnaires...</p>
                    <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                        (Vous pouvez aller faire un café en attendant ^^)
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="home">
            <header>
                <h1>Bienvenue sur le CMS NumDiag</h1>
                <p>Voici la liste des questionnaires disponibles :</p>
            </header>

            <div className="home-controls">
                <button type="button" onClick={() => setButtonAffichage(!buttonAffichage)}>
                    {buttonAffichage ? "📋 Afficher les actifs" : "📊 Tout afficher"}
                </button>
                <button onClick={handleCreateQuestClick} className="edit-button">
                    ✨ Créer un questionnaire
                </button>
            </div>

            <div className="questionnaires-grid mt-15 relative w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl shadow-xl">
              <div className="absolute flex bg-transparent h-12 -top-12 left-4">
                  <div className={`cursor-pointer rounded-tl-xl  px-5 py-3 ${showPublished ? "bg-gray-50 inset-shadow z-10 border-gray-300 border-x border-t" : "bg-gray-200"}`}
                  role='button'
                  onClick={()=>setShowPublished(true)}
                  >Publiés</div>
                  <div className={`cursor-pointer rounded-tl-xl px-5 py-3 -ml-2 ${showPublished ? "bg-gray-200" : "bg-gray-50 inset-shadow z-10 border-gray-300 border-x border-t"}`}
                  role='button'
                  onClick={()=>setShowPublished(false)}
                  >En cours</div>
              </div>
                {questionnaires.map(q => (
                  (q.isactive || buttonAffichage) ? (
                    (showPublished && q.ispublished || !showPublished && !q.ispublished) ? (
                    <div key={q.id+'questionnaire'} className={`questionnaire-card ${q.isactive ? "bg-green-300" : "bg-red-300"}`}>
                        <div className={`status-badge ${q.isactive ? "active" : "inactive"}`}>
                            {q.isactive ? "Actif" : "Inactif"}
                        </div>
                        <QuestionnaireResume key={q.id} idQuestionnaire={q.id} label={q.label} />
                        <button type="button" onClick={() => toggleButtonActive(q.id, q.isactive)}>
                            {q.isactive ? "Désactiver" : "Activer"}
                        </button>
                    </div>
                  ) : (<div key={q.id+'error'} className="hidden">Flûte</div>)) : <div key={q.id+'error'} className="hidden"></div>
                ))}
            </div>

            {isCreateQuestPopupOpen && (
                <CreateQuestionnaire
                    onSave={handleSaveQuestionnaire}
                    onClose={handleClosePopupQuestionnaire}
                />
            )}
        </div>
    );
}
