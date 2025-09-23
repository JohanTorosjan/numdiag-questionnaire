import { useState } from 'react';
import PopUpEditQuestion from '../popups/editQuestion';

function QuestionResume({ question, sectionId, onUpdateQuestion, sectionNbPages}) {
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleEditClick = () => {
        setIsEditPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsEditPopupOpen(false);
    };

    const handleSaveQuestion = async (updatedQuestion) => {
        try {
            // Ici tu feras ton appel API plus tard
            console.log('Appel API pour sauvegarder:', {
                sectionId,
                questionId: question.id,
                updatedData: updatedQuestion
            });

            setIsUpdating(true)
            const response = await fetch(`http://localhost:3008/questions/${question.id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    // Ajoute l'auth si nécessaire
                    // 'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    section_id: sectionId,
                    ...updatedQuestion
                })
                });


            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            
            const result = await response.json();
    
            if (!result.success) {
            throw new Error(result.error || 'Erreur lors de la sauvegarde');
            }

            onUpdateQuestion(sectionId, question.id, updatedQuestion); //// Changer updatedQUestion ???

          

            
            // Ferme la popup
            setIsEditPopupOpen(false);
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
        }
        finally{
            setIsUpdating(false)
        }
    };

    return (
        
        <div className="question-resume">
            <h4>{question.label}</h4>
                      <p> {isUpdating}</p>    

            <p>{question.description}</p>
            {/* Bouton pour ouvrir la popup d'édition */}
            <button onClick={handleEditClick} className="edit-button">
                Éditer
            </button>

            {/* Popup d'édition */}
            {isEditPopupOpen && (
                <PopUpEditQuestion
                    question={question}
                    onSave={handleSaveQuestion}
                    onClose={handleClosePopup}
                    sectionNbPages={sectionNbPages}
                />
            )}
        </div>
    );
}

export default QuestionResume;