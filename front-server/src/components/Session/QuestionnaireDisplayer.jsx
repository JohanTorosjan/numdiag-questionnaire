import { useState, useEffect } from "react";
import QuestionDisplayer from "./QuestionDisplayer.jsx";
import { useToast } from "../../ToastSystem";
import { useNavigate, useParams } from 'react-router-dom';

function QuestionnaireDisplayer({ questionnaire, session, onSessionUpdate }) {
    const [currentSection, setCurrentSection] = useState(null);
    const [currentQuestions, setCurrentQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [messageBeforeNav, setMessageBeforeNav ] = useState(false)
    const toast = useToast();
    const { session_id } = useParams();
    const navigate = useNavigate();


    const handleClickNavigate = () => {
        areAllMandatoryQuestionsAnswered() && navigate(`/session/questionnaire/${session_id}/score`);
        setMessageBeforeNav(true)
    };

    // Calculer le nombre total de pages du questionnaire
    const totalPages = questionnaire?.sections.reduce((total, section) => {
        return total + section.nbpages;
    }, 0) || 0;

     const areAllMandatoryQuestionsAnswered = () => {
        // Récupérer les questions obligatoires de la page courante
        const mandatoryQuestions = currentQuestions.filter(q => q.mandatory);

        // Vérifier chaque question obligatoire
        for (const question of mandatoryQuestions) {
            const answer = answers[question.id];

            // Si pas de réponse du tout
            if (!answer) return false;

            // Vérifier selon le type de question
            switch (question.questiontype) {
                case "choix_simple":
                case "choix_multiple":
                    // reponseIds doit exister et ne pas être vide
                    if (!answer.reponseIds || answer.reponseIds.length === 0) {
                        return false;
                    }
                    break;
                case "entier":
                case "libre":
                    // flatReponse ne doit pas être null ou vide
                    if (!answer.flatReponse || answer.flatReponse.trim() === "") {
                        return false;
                    }
                    break;
            }
        }

        return true;
    };

    // Gérer les changements de réponse
    const handleAnswerChange = (answer) => {
        setAnswers(prev => ({
            ...prev,
            [answer.questionId]: answer
        }));
      //  debugger
        console.log(answers)
    };


// Mettre à jour la session avec les réponses
    useEffect(() => {
        if (Object.keys(answers).length > 0 && onSessionUpdate) {
            // Garder les answers existantes du session
            const existingAnswers = session.answers || [];

            // Mettre à jour uniquement les réponses modifiées
            const updatedAnswers = existingAnswers.map(existingAnswer => {
                // Si cette question a été modifiée, utiliser la nouvelle réponse
                if (answers[existingAnswer.questionId]) {
                    return answers[existingAnswer.questionId];
                }
                // Sinon garder l'ancienne réponse
                return existingAnswer;
            });

            // Ajouter les nouvelles réponses qui n'existaient pas avant
            Object.values(answers).forEach(newAnswer => {
                if (!existingAnswers.find(a => a.questionId === newAnswer.questionId)) {
                    updatedAnswers.push(newAnswer);
                }
            });

            const updatedSession = {
                ...session,
                answers: updatedAnswers
            };
        //    debugger
            onSessionUpdate(updatedSession);
        }
    }, [answers]);
    // Fonction pour passer à la page suivante
    const handleNext = () => {
        if (!currentSection) return;
        if (!areAllMandatoryQuestionsAnswered()){
            toast.showError('Veuillez remplir toutes les questions obligatoires')
            return

        }
        // Si il reste des pages dans la section courante
        if (session.page < currentSection.nbpages) {
            const updatedSession = {
                ...session,
                page: session.page + 1
            };
            if (onSessionUpdate) {
                onSessionUpdate(updatedSession);
            }
        } else {
            // Passer à la section suivante
            const currentSectionIndex = questionnaire.sections.findIndex(
                s => s.id === session.current_section_id
            );

            if (currentSectionIndex < questionnaire.sections.length - 1) {
                const nextSection = questionnaire.sections[currentSectionIndex + 1];
                const updatedSession = {
                    ...session,
                    current_section_id: nextSection.id,
                    page: 1
                };
                if (onSessionUpdate) {
                    onSessionUpdate(updatedSession);
                }
            }
        }
    };

    // Fonction pour revenir à la page précédente
    const handlePrevious = () => {
        if (!currentSection) return;

        // Si on n'est pas à la première page de la section
        if (session.page > 1) {
            const updatedSession = {
                ...session,
                page: session.page - 1
            };
            if (onSessionUpdate) {
                onSessionUpdate(updatedSession);
            }
        } else {
            // Revenir à la section précédente (dernière page)
            const currentSectionIndex = questionnaire.sections.findIndex(
                s => s.id === session.current_section_id
            );

            if (currentSectionIndex > 0) {
                const previousSection = questionnaire.sections[currentSectionIndex - 1];
                const updatedSession = {
                    ...session,
                    current_section_id: previousSection.id,
                    page: previousSection.nbpages
                };
                if (onSessionUpdate) {
                    onSessionUpdate(updatedSession);
                }
            }
        }
    };

    // Vérifier si on est à la première page
    const isFirstPage = () => {
        const currentSectionIndex = questionnaire.sections.findIndex(
            s => s.id === session.current_section_id
        );
        return currentSectionIndex === 0 && session.page === 1;
    };

    // Vérifier si on est à la dernière page
    const isLastPage = () => {
        const currentSectionIndex = questionnaire.sections.findIndex(
            s => s.id === session.current_section_id
        );
        const isLastSection = currentSectionIndex === questionnaire.sections.length - 1;
        return isLastSection && currentSection && session.page === currentSection.nbpages;
    };

    useEffect(() => {
        if (!questionnaire || !session) return;

        // Trouver la section courante basée sur current_section_id
        const section = questionnaire.sections.find(
            s => s.id === session.current_section_id
        );

        if (section) {
            setCurrentSection(section);

            // Filtrer les questions pour la page courante
            const questionsForPage = section.questions.filter(
                q => q.page === session.page
            );

            setCurrentQuestions(questionsForPage);
        }
    }, [questionnaire, session]);

    if (!currentSection) {
        return (
            <div className="text-center p-4">
                <p>Section non trouvée</p>
            </div>
        );
    }


    return (
      <div className="w-full h-full pt-8 relative">
        <div className="w-full h-full absolute top-0 bg-sky-500/40 mask-b-from-5% mask-b-to-80% -z-10"></div>
          <div className="max-w-4xl mx-auto z-10 px-3 pb-10">
              {/* En-tête de la section */}
              <div className="mb-6 shadow rounded-xl pl-5 pr-2 pt-3 pb-1 bg-white">
                  <h2 className="text-2xl font-semibold mb-2">{currentSection.label}</h2>
                  <div className="flex w-full">
                  {currentSection.description && (
                      <p className="text-gray-600 w-2/3">{currentSection.description}</p>
                  )}
                  {currentSection.tooltip && (
                      <p className="text-sm text-gray-500 italic mt-1 w-1/3">{currentSection.tooltip}</p>
                  )}
                  </div>
                  <div className="text-sm text-gray-500 mt-3 text-end">
                      Page {session.page} / {currentSection.nbpages}
                  </div>
              </div>

              {/* Liste des questions */}
              <div className="space-y-6">
                  {currentQuestions.length > 0 ? (
                      currentQuestions.map((question) => (
                          <QuestionDisplayer
                              key={question.id}
                              question={question}
                              initialAnswer={session} // Passer la réponse existante
                              onAnswerChange={handleAnswerChange}
                          />
                      ))
                  ) : (
                      <div className="text-center p-8 bg-gray-50 rounded-lg">
                          <p className="text-gray-500">Aucune question sur cette page</p>
                      </div>
                  )}
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-4 mb-10">
                  <button
                      className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isFirstPage()}
                      onClick={handlePrevious}
                  >
                      Précédent
                  </button>
                  {isLastPage() ?
                  <div className="relative">
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!isLastPage()}
                        onClick={handleClickNavigate}

                    >
                        Envoyer
                    </button>
                    {messageBeforeNav ?
                      (<p className="absolute md:min-w-80 min-w-50 right-0 mt-1 before:content-['*'] before:mr-1 before:font-bold before:text-lg/3 before:align-middle text-sm text-red-500 text-end">Vous devez répondre à toutes les questions obligatoires pour continuer</p>)
                      :
                      (<div className="hidden"></div>)
                    }
                    </div>
                    :
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLastPage()}
                        onClick={handleNext}
                    >
                        Suivant
                    </button>
                  }
              </div>
          </div>

      </div>
    );
}

export default QuestionnaireDisplayer;
