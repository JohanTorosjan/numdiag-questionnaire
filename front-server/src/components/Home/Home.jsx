import './home.css';
import React, { useState, useEffect } from 'react';
import QuestionnaireResume from "../Questionnaire/questionnaireResume";
import CreateQuestionnaire from "../Questionnaire/createQuestionnaire";
import CreateThemePublic from "../ThemePublic/createThemePublic.jsx";
import { useToast } from '../../ToastSystem';
import DocumentTitle from '../hooks/documentTitle';
import { getAllPublics, getAllThemes } from '../ThemePublic/themePublicFront.js';

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
    const [showPublished, setShowPublished] = useState(false);
    const toast = useToast();
    const [themes, setThemes] = useState(false)
    const [isThemeOpen, setIsThemeOpen] = useState(false)
    const [isPublicOpen, setIsPublicOpen] = useState(false)
    const [allPublics, setAllPublics] = useState([])
    const [allThemes, setAllThemes] = useState([])
    const [editThemes, setEditThemes] = useState(false)
    const [editPublics, setEditPublics] = useState(false)
    const [themeLabel, setThemeLabel] = useState("");
    const [publicLabel, setPublicLabel] = useState("");
    const [searchQuestions, setSearchQuestions] = useState(false)
    const [searchThemes, setSearchThemes] = useState([])
    const [searchPublics, setSearchPublics] = useState([])
    const [resultSearch, setResultSearch]= useState([])

  // Listes fixes pour les select
    const questionTypes = [
        { value: 'entier', label: 'Entier' },
        { value: 'choix_simple', label: 'Choix simple' },
        { value: 'choix_multiple', label: 'Choix multiple' },
        { value: 'libre', label: 'Libre' },
    ];

    useEffect(() => {
        const fetchQuestionnaires = async () => {
            const data = await getAllQuestionnairesResume();
            setQuestionnaires(data);
            setLoading(false);
        };

        const fetchThemes = async () => {
          const data = await getAllThemes();
          setAllThemes(data.data);
        }

        const fetchPublics = async () => {
          const data = await getAllPublics();
          setAllPublics(data.data);
        }


        fetchQuestionnaires();
        fetchThemes();
        fetchPublics();
    }, []);

    useEffect(() =>{
      console.log('Result of Search:',resultSearch)
    }, [resultSearch])


  async function updateTheme(idTheme, label) {
    if (label !="") {
    try {
      const response = await fetch(`http://localhost:3008/updateTheme/${idTheme}`, {
      method: 'PUT',
      headers: {
      'Content-Type': 'application/json',
      },
        body: JSON.stringify({label})
      });
      if (!response.ok) {
          throw new Error('Erreur lors de la modification du label du thème');
      }
      const data = await response.json();
      console.log('Response from server:', data);
      const newThemes = await getAllThemes();
      setAllThemes(newThemes.data)
      setEditThemes(false)
      return data;
    } catch (error) {
      console.error('Error updating theme label:', error);
      return null;
    }
    } else {
      setEditThemes(false)
    }
  }

  async function updatePublic(idPublic, label) {
    if (label !="") {
    try {
      const response = await fetch(`http://localhost:3008/updatePublic/${idPublic}`, {
      method: 'PUT',
      headers: {
      'Content-Type': 'application/json',
      },
        body: JSON.stringify({label})
      });
      if (!response.ok) {
          throw new Error('Erreur lors de la modification du label du public');
      }
      const data = await response.json();
      console.log('Response from server:', data);
      const newThemes = await getAllPublics();
      setAllPublics(newThemes.data)
      setEditPublics(false)
      return data;
    } catch (error) {
      console.error('Error updating public label:', error);
      return null;
    }
    } else {
      setEditPublics(false)
    }
  }

  async function deactivateTheme(idTheme,themeState) {

    try {
      const response = await fetch(`http://localhost:3008/deactivateTheme/${idTheme}`, {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
       body: JSON.stringify({themeState})
      });
      if (!response.ok) {
          throw new Error("Erreur lors du toggle d'activation du thème");
      }
      const data = await response.json();
      console.log('Response from server:', data);
      const newThemes = await getAllThemes();
      setAllThemes(newThemes.data)
      return data;
    } catch (error) {
      console.error('Error toggling theme activation:', error);
      return null;
    }
  }

  async function deactivatePublic(idPublic,publicState) {

    try {
      const response = await fetch(`http://localhost:3008/deactivatePublic/${idPublic}`, {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
       body: JSON.stringify({publicState})
      });
      if (!response.ok) {
          throw new Error("Erreur lors du toggle d'activation du public");
      }
      const data = await response.json();
      console.log('Response from server:', data);
      const newPublics = await getAllPublics();
      setAllPublics(newPublics.data)
      return data;
    } catch (error) {
      console.error('Error toggling Public activation:', error);
      return null;
    }
  }

    const toggleButtonActive = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;
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

  const handleSaveQuestionnaire = async ({formData, theme, publicSelect}) => {
    let questionnaire_id = undefined;
      try {

          setIsCreating(true)
          const response = await fetch(`http://localhost:3008/createQuestionnaire`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  ...formData
              })
              });

          if (!response.ok) {
              throw new Error(`Erreur HTTP: ${response.status}`);
          }

          const result = await response.json();
          questionnaire_id=result.questionnaire.id
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

      try {
        ("Sauvegarde des thèmes et publics associés", {theme, publicSelect})
        setIsCreating(true)

          const response = await fetch(`http://localhost:3008/themePublicQuestionnaire`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                 theme, publicSelect, questionnaire_id
              })
              });

          if (!response.ok) {
              throw new Error(`Erreur HTTP: ${response.status}`);
          }

          const result = await response.json();


          if (!result.success) {
            toast.showError('Erreur lors de la sauvegarde des thèmes et publics');
            throw new Error(result.error || 'Erreur lors de la sauvegarde des thèmes et publics');
          }
          // const data = await getAllQuestionnairesResume();
          // setQuestionnaires(data);
          // setIsCreateQuestPopupOpen(false);
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
          const data = await getAllPublics();
          setAllPublics(data.data);
          setIsPublicOpen(false);
      } catch (error) {
          console.error('Erreur lors de la sauvegard du public:', error);
      }
      finally{
          setIsCreating(false)
      }
  };

  ////////////////////////// Save Theme
////////////////////////////////////////
  const handleSaveTheme = async (newTheme) => {
      try {

          setIsCreating(true)
          const response = await fetch(`http://localhost:3008/createTheme`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  ...newTheme
              })
              });

          if (!response.ok) {
              throw new Error(`Erreur HTTP: ${response.status}`);
          }

          const result = await response.json();

          if (!result.success) {
            toast.showError('Erreur lors de la création du thème');
            throw new Error(result.error || 'Erreur lors de la sauvegarde du thème');
          } else {
            toast.showSuccess('Thème créé avec succès!');
          }
          const data = await getAllThemes();
          setAllThemes(data.data);
          setIsThemeOpen(false);
      } catch (error) {
          console.error('Erreur lors de la sauvegard du thème:', error);
      }
      finally{
          setIsCreating(false)
      }
  };



  const handleThemesClick = () => {
      themes ? setThemes(false) : setThemes(true);
    };
  const handlePopUpTheme = () => {
      setIsThemeOpen(true);
    };
  const handlePopUpPublic = () => {
      setIsPublicOpen(true);
    };
  const handleClosePopupThemePublic = () => {
      setIsPublicOpen(false);
      setIsThemeOpen(false);
    };

  const editTheme = (id, label) => {
    setEditThemes(id);
    setThemeLabel(label);
  }
  const editPublic = (id, label) => {
    setEditPublics(id);
    setPublicLabel(label);
  }

  const searchClick = () => {
    searchQuestions ? setSearchQuestions(false) : setSearchQuestions(true);
  }

  const handleSearchQuestion = async () => {

    const selectedPublics = allPublics.filter(p => searchPublics.includes(String(p.id)))
    .map(p => ({public_id: p.id, public_label: p.label }));
    const selectedThemes = allThemes.filter(t => searchThemes.includes(String(t.id)))
    .map(p => ({theme_id: p.id, theme_label: p.label }));

    try {
      const response = await fetch(`http://localhost:3008/searchQuestions`, {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
       body: JSON.stringify(selectedThemes, selectedPublics)
      });
      if (!response.ok) {
          throw new Error("Erreur lors de la recherche par public et/ou thèmes");
      }
      const data = await response.json();
      console.log('Response from server:', data);
      setResultSearch(data)
    } catch (error) {
      console.error('Error searching questions by publics or themes:', error);
      return null;
    }
  }

  const handleSearchTheme = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setSearchThemes(selectedOptions);
  };
  const handleSearchPublic = (e) => {
      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
      setSearchPublics(selectedOptions);
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
          <div className="w-full flex justify-end items-center">
            <button onClick={searchClick} className="edit-button mr-8">
               {searchQuestions ? '👓 Liste des thèmes et publics' : '🔎 Questions par thèmes et publics'}
            </button>
            <button onClick={handleThemesClick} className="edit-button">
                ✨ Revenir aux questionnaires
            </button>
          </div>
          { (searchQuestions) ?
          (<div key="searchQuestionByThemePublic">
            <div className='w-4/5 mx-auto mt-10'>
              <div className="form-row">
                <div className="form-group">
                    <label htmlFor="searchQuestionTheme" className='text-lg!'>Thème(s) :</label>
                    <select
                        id="searchQuestionTheme"
                        name="searchQuestionTheme"
                        value={searchThemes}
                        onChange={handleSearchTheme}
                        multiple
                        size="1"
                    >
                        {allThemes.map((type, index) => (
                            <option key={type.id} value={type.id} className='px-3 py-2'>
                                {type.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="searchQuestionPublic" className='text-lg!'>Public(s) :</label>
                    <select
                        id="searchQuestionPublic"
                        name="searchQuestionPublic"
                        value={searchPublics}
                        onChange={handleSearchPublic}
                        multiple
                        size="1"
                    >
                        {allPublics.map((type, index) => (
                            <option key={type.id} value={type.id} className='px-3 py-2'>
                                {type.label}
                            </option>
                        ))}
                    </select>
                </div>
              </div>
              <button onClick={handleSearchQuestion} className="bg-white shadow-lg! hover:shadow-xl! hover:-translate-y-0.5 ease-in-out duration-100">Rechercher</button>
            </div>
          </div>)
          :
          (
          <div key="listeOfThemesPublics">
          <div className="mt-20 grid grid-cols-2 border-r border-l divide-x divide-black">
            <div className="w-full mx-auto px-10 ">
              <h2 className="text-xl font-semibold">Liste des thèmes</h2>
              <div className="text-end">
                <button onClick={handlePopUpTheme} className="bg-blue-600 text-white mt-2 mb-4">
                    Créer un thème
                </button>
              </div>
               {allThemes.map(singleTheme => (
                <div key={singleTheme.id+'theme'} className="mt-2" >
                  <div className="w-full flex items-center">

                    {(editThemes === singleTheme.id) ?
                      <input type="text" className="border border-gray-300 rounded py-1"
                        value={themeLabel}
                        onChange={(e) => setThemeLabel(e.target.value)}/>
                      :
                      <p className="text-wrap w-1/2 break-all">{singleTheme.label}</p>

                      }
                      <div className="mr-0 ml-auto space-x-3">
                      {(editThemes === singleTheme.id) ?
                      <button onClick={()=>updateTheme(singleTheme.id, themeLabel)} className="bg-cyan-400/50">✓</button>
                      :
                      <button onClick={()=>editTheme(singleTheme.id, singleTheme.label)} className="bg-cyan-400/50">🖊️ </button>
                    }

                    { singleTheme.isactive ?
                      (<button onClick={()=>deactivateTheme(singleTheme.id, singleTheme.isactive)} className="bg-orange-700/50"><span className="w-6 h-6 inline-flex items-center justify-center">🗑️</span></button>)
                      :
                      (<button onClick={()=>deactivateTheme(singleTheme.id, singleTheme.isactive)} className="bg-orange-700/10 translate-y-1 -mt-1">
                        <img src="/images/ferme_yeux.svg" className="w-6 h-5.5"/>
                      </button>)
                    }
                    </div>
                  </div>
                  <hr className='w-3/4 mt-2 text-gray-300'/>
                </div>
              ))}
            </div>

            <div className="w-full mx-auto px-10 ">
              <h2 className="text-xl font-semibold">Liste des publics</h2>
              <div className="text-end">
                <button onClick={handlePopUpPublic} className="bg-blue-600 text-white mt-2 mb-4">
                    Créer un public
                </button>
              </div>
              {allPublics.map(singlePublic => (
                <div key={singlePublic.id+'Public'} className="mt-2" >
                  <div className="w-full flex items-center">

                    {(editPublics === singlePublic.id) ?
                      <input type="text" className="border border-gray-300 rounded py-1"
                        value={publicLabel}
                        onChange={(e) => setPublicLabel(e.target.value)}/>
                      :
                      <p className="text-wrap w-1/2 break-all">{singlePublic.label}</p>

                      }
                      <div className="mr-0 ml-auto space-x-3">
                      {(editPublics === singlePublic.id) ?
                      <button onClick={()=>updatePublic(singlePublic.id, publicLabel)} className="bg-cyan-400/50">✓</button>
                      :
                      <button onClick={()=>editPublic(singlePublic.id, singlePublic.label)} className="bg-cyan-400/50">🖊️ </button>
                    }

                    { singlePublic.isactive ?
                      (<button onClick={()=>deactivatePublic(singlePublic.id, singlePublic.isactive)} className="bg-orange-700/50"><span className="w-6 h-6 inline-flex items-center justify-center">🗑️</span></button>)
                      :
                      (<button onClick={()=>deactivatePublic(singlePublic.id, singlePublic.isactive)} className="bg-orange-700/10 translate-y-1 -mt-1">
                        <img src="/images/ferme_yeux.svg" className="w-6 h-5.5"/>
                      </button>)
                    }
                    </div>
                  </div>
                  <hr className='w-3/4 mt-2 text-gray-300'/>
                </div>
              ))}
            </div>
          </div>

          {(isThemeOpen) ? (
            <CreateThemePublic
                onSave={handleSaveTheme}
                onClose={handleClosePopupThemePublic}
                type={"theme"}
            />
          ) : isPublicOpen ? (
            <CreateThemePublic
                onSave={handleSavePublic}
                onClose={handleClosePopupThemePublic}
                type={"public"}
            />
          ) : <div className="hidden"></div>
        }
        </div>
        )
      }
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
                        <div className="flex space-between">
                          <QuestionnaireResume key={q.id} idQuestionnaire={q.id} label={q.label} />

                        </div>
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
                    questionTypes={questionTypes}
                />
            )}
        </div>
    );
}
