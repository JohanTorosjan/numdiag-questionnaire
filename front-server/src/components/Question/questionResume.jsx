import { useState } from 'react';
import PopUpEditQuestion from '../popups/editQuestion';

function QuestionResume({ question, sectionId, onUpdateQuestion }) {
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);

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

            // Simule un appel API réussi
            // const response = await fetch(`http://localhost:3008/questions/${question.id}`, {
            //     method: 'PUT',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(updatedQuestion)
            // });

            // Met à jour le state local via le callback du parent
            onUpdateQuestion(sectionId, question.id, updatedQuestion);

            
            
            // Ferme la popup
            setIsEditPopupOpen(false);
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
        }
    };

    return (
        <div className="question-resume">
            <h4>{question.label}</h4>
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
                />
            )}
        </div>
    );
}

export default QuestionResume;