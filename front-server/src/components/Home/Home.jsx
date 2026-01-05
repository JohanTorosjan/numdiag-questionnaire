import './home.css';
import React, { useState, useEffect } from 'react';
import QuestionnaireResume from "../Questionnaire/questionnaireResume";
import CreateQuestionnaire from "../Questionnaire/createQuestionnaire";
import CreateThemePublic from "../ThemePublic/createThemePublic.jsx";
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

async function getAllPublic() {
    try {
        const response = await fetch('http://localhost:3008/publics');
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
    const [showPublished, setShowPublished] = useState(false);
    const toast = useToast();
    const [themes, setThemes] = useState(false)
    const [isThemeOpen, setIsThemeOpen] = useState(false)
    const [isPublicOpen, setIsPublicOpen] = useState(false)
    const [allPublic, setAllPublic] = useState([])

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


////////////////////////// Save Public
////////////////////////////////////////
  const handleSavePublic = async (newPublic) => {
      try {
          console.log('Appel API pour sauvegarder un public:', {
              updatedData: newPublic
          });
          setIsCreating(true)
          const response = await fetch(`http://localhost:3008/createPublic`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  ...newPublic
              })
              });

          if (!response.ok) {
              throw new Error(`Erreur HTTP: ${response.status}`);
          }

          const result = await response.json();

          if (!result.success) {
            toast.showError('Erreur lors de la création du public');
            throw new Error(result.error || 'Erreur lors de la sauvegarde du public');
          } else {
            toast.showSuccess('Public créé avec succès!');
          }
          const data = await getAllPublic();
          console.log(data.data)
          setAllPublic(data.data);
          setIsPublicOpen(false);
      } catch (error) {
          console.error('Erreur lors de la sauvegard du public:', error);
      }
      finally{
          setIsCreating(false)
      }
  };

  const handleThemesClick = () => {
      themes ? setThemes(false) : setThemes(true) ;
    };
  const handlePopUpTheme = () => {
      setIsThemeOpen(true);
    };
  const handlePopUpPublic = () => {
      setIsPublicOpen(true);
    };
  const handleClosePopupTheme = () => {
      setIsPublicOpen(false);
      setIsThemeOpen(false);
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

    if (themes) {
      return (
        <div className="home">
          <header>
              <h1>Bienvenue sur le CMS NumDiag</h1>
              <p>Voici la liste des thèmes et publics cibles :</p>
          </header>
          <div className="w-full text-end">
            <button onClick={handleThemesClick} className="edit-button">
                ✨ Revenir aux questionnaires
            </button>
          </div>

          <div className="mt-20 grid grid-cols-2 border-r border-l divide-x divide-black">
            <div className="w-full mx-auto px-10 ">
              <h2 className="text-xl font-semibold">Liste des thèmes</h2>
              <div className="text-end">
                <button onClick={handlePopUpTheme} className="bg-blue-600 text-white mt-2">
                    Créer un thème
                </button>
              </div>
            </div>
            <div className="w-full mx-auto px-10 ">
              <h2 className="text-xl font-semibold">Liste des publics</h2>
              <div className="text-end">
                <button onClick={handlePopUpPublic} className="bg-blue-600 text-white mt-2">
                    Créer un public
                </button>
              </div>
              {allPublic.map(singlePublic => (
                <div key={singlePublic.id+'public'}>{singlePublic.label}</div>
              ))}
            </div>
          </div>

          {isThemeOpen ? (
            <CreateThemePublic
                onSave={handleSaveTheme}
                onClose={handleClosePopupTheme}
                type={"theme"}
            />
          ) : isPublicOpen ? (
            <CreateThemePublic
                onSave={handleSavePublic}
                onClose={handleClosePopupTheme}
                type={"public"}
            />
          ) : <div className="hidden"></div>}
        </div>
      )
    }

    return (
        <div className="home">
            <header>
                <h1>Bienvenue sur le CMS NumDiag</h1>
                <p>Voici la liste des questionnaires disponibles :</p>
            </header>

            <div className="home-controls">
                <button type="button" className='mt-[2rem]' onClick={() => setButtonAffichage(!buttonAffichage)}>
                    {buttonAffichage ? "📋 Afficher les actifs" : "📊 Tout afficher"}
                </button>
                <button onClick={handleCreateQuestClick} className="edit-button">
                    ✨ Créer un questionnaire
                </button>
                <button onClick={handleThemesClick} className="edit-button">
                    👓 &nbsp;&nbsp;Gérer les thèmes et publics cibles
                </button>
            </div>

            <div className="questionnaires-grid mt-20 relative w-full bg-gray-50 border-x border-t border-gray-300 px-4 py-3 rounded-xl shadow-xl">
              <div className="absolute flex bg-transparent h-12 -top-12 left-4">
                  <div className={`cursor-pointer rounded-tl-xl  px-5 py-3 ${showPublished ? "bg-gray-50 inset-shadow border-gray-300 border-x border-t z-10" : "bg-gray-100 border-b border-gray-300"}`}
                  role='button'
                  onClick={()=>setShowPublished(true)}
                  >Publiés</div>
                  <div className={`cursor-pointer rounded-tl-xl px-5 py-3 -ml-2 ${showPublished ? "bg-gray-100 border-b border-gray-300" : "bg-gray-50 inset-shadow border-gray-300 border-x border-t"}`}
                  role='button'
                  onClick={()=>setShowPublished(false)}
                  >En cours</div>
              </div>
                {questionnaires.map(q => (
                  (q.isactive || buttonAffichage) ? (
                    ((showPublished && q.ispublished) || (!showPublished && !q.ispublished)) ? (
                    <div key={q.id+'questionnaire'} className={`questionnaire-card ${(q.isactive && q.ispublished) ? "bg-green-300" : (q.isactive && !q.ispublished) ? "bg-orange-300": "bg-red-300"}`}>
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
