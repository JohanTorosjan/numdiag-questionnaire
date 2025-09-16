import { useState, useEffect } from 'react';
import './QuestionDependencies.css';

function QuestionDependencies({ questionnaire, question,onUpdate }) {
    const [availableQuestions, setAvailableQuestions] = useState([]);
    const [selectedDependencies, setSelectedDependencies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedQuestions, setExpandedQuestions] = useState(new Set());
    // Simulation d'un appel API pour récupérer les questions et réponses
    const fetchQuestionsAndAnswers = async (questionnaireId) => {
        try {
            setLoading(true);
            
            // Simulation d'un délai d'API

            const response = await fetch(`http://localhost:3008/questions/${questionnaireId}`);
            if (!response.ok) {
                throw new Error('Erreur lors du chargement des questions');
            }
            const data = await response.json();

            const filteredQuestions = data.filter(q => q.id !== question?.id).filter(q=>q.questiontype !=='entier');
            
            setAvailableQuestions(filteredQuestions);
            setError(null);
        } catch (err) {
            setError("Erreur lors du chargement des questions");
            console.error("Erreur API:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchExistingDependencies = async () =>{
        const response = await fetch(`http://localhost:3008/questions/dependencies/${question.id}`);
        const data = await response.json()
        console.log(data)
        setSelectedDependencies(data)
    }

    useEffect(() => {
        if (questionnaire) {
            fetchQuestionsAndAnswers(questionnaire);
        }
    }, [questionnaire]);
    // Initialiser les dépendances existantes (si la question en a déjà)
    useEffect(() => {
        fetchExistingDependencies()
    }, [question]);

    const handleAnswerToggle = (questionId, answerId) => {
        const dependencyKey = `${questionId}_${answerId}`;
        
        setSelectedDependencies(prev => {    
            if (prev.includes(dependencyKey)) {
              
                // Retirer la dépendance
                return prev.filter(dep => dep !== dependencyKey);
            } else {

                // Ajouter la dépendance
                return [...prev, dependencyKey];
            }
        });
    };

    const toggleQuestionExpansion = (questionId) => {
        setExpandedQuestions(prev => {
            const newSet = new Set(prev);
            if (newSet.has(questionId)) {
                newSet.delete(questionId);
            } else {
                newSet.add(questionId);
            }
            return newSet;
        });
    };

    const isAnswerSelected = (questionId, answerId) => {
        return selectedDependencies.includes(`${questionId}_${answerId}`);
    };

    const getSelectedCount = (questionId) => {
        return selectedDependencies.filter(dep => dep.startsWith(`${questionId}_`)).length;
    };

    // Notifier le parent des changements de dépendances
    useEffect(() => {
        // Ici vous pouvez déclencher un callback vers le composant parent
        // pour mettre à jour la question avec les nouvelles dépendances
        if (question && question.id) {
            
            // Par exemple: onDependenciesChange(selectedDependencies);
            onUpdate(selectedDependencies)
            console.log("Dépendances mises à jour:", selectedDependencies);
        }
    }, [selectedDependencies]);

    if (loading) {
        return (
            <div className="dependencies-loading">
                <div className="loading-spinner"></div>
                <p>Chargement des questions...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dependencies-error">
                <p>{error}</p>
                <button onClick={() => fetchQuestionsAndAnswers(questionnaire)} className="retry-button">
                    Réessayer
                </button>
            </div>
        );
    }

    return (
        <div className="question-dependencies">
            {availableQuestions.length === 0 ? (
                <p className="no-questions">Aucune autre question disponible dans ce questionnaire.</p>
            ) : (
                <div className="questions-list">
                    {availableQuestions.map(q => (
                        <div key={q.id} className="question-item">
                            <div 
                                className="question-header"
                                onClick={() => q.answers.length > 0 && toggleQuestionExpansion(q.id)}
                            >
                                <div className="question-info">
                                    <span className="question-label">{q.label}</span>
                                    <span className="question-type">({q.questiontype})</span>
                                    {getSelectedCount(q.id) > 0 && (
                                        <span className="selected-count">
                                            {getSelectedCount(q.id)} sélectionné(s)
                                        </span>
                                    )}
                                </div>
                                {q.answers.length > 0 && (
                                    <span className={`expand-icon ${expandedQuestions.has(q.id) ? 'expanded' : ''}`}>
                                        ▼
                                    </span>
                                )}
                            </div>

                            {q.answers.length === 0 ? (
                                <p className="no-answers">
                                    Cette question n'a pas de réponses prédéfinies 
                                    (type: {q.questiontype})
                                </p>
                            ) : expandedQuestions.has(q.id) && (
                                <div className="answers-list">
                                    {q.answers.map(answer => (
                                        <label key={answer.id} className="answer-item">
                                            <input
                                                type="checkbox"
                                                checked={isAnswerSelected(q.id, answer.id)}
                                                onChange={() => handleAnswerToggle(q.id, answer.id)}
                                            />
                                            <span className="answer-text">{answer.text}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {selectedDependencies.length > 0 && (
                <div className="dependencies-summary">
                    <h4>Résumé des dépendances ({selectedDependencies.length})</h4>
                    <div className="selected-dependencies">
                        {selectedDependencies.map(dep => {
                            const [questionId, answerId] = dep.split('_');
                            const question = availableQuestions.find(q => q.id === parseInt(questionId));
                            const answer = question?.answers.find(a => a.id === parseInt(answerId));
                            
                            return (
                                <span key={dep} className="dependency-tag">
                                    {question?.label} → {answer?.text}
                                    <button 
                                        onClick={() => handleAnswerToggle(parseInt(questionId), parseInt(answerId))}
                                        className="remove-dependency"
                                    >
                                
                                    </button>
                                </span>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

export default QuestionDependencies;