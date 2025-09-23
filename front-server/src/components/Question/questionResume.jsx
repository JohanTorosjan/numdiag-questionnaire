import { useState } from 'react';
import PopUpEditQuestion from '../popups/editQuestion';
import { useToast } from '../../ToastSystem';

function QuestionResume({ question, sectionId, onUpdateQuestion, sectionNbPages,setQuestionnaire,questionnaireId}) {
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const toast = useToast();

    const handleEditClick = () => {
        setIsEditPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsEditPopupOpen(false);
    };

    const handleSaveQuestion = async (updatedQuestion) => {
        try {
            setIsUpdating(true)
            if((question.position!==updatedQuestion.position) || (question.page!==updatedQuestion.page)){
                const updatePositionResponse = await fetch(`http://localhost:3008/questions/${question.id}/position`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    // Ajoute l'auth si nécessaire
                    // 'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    position:updatedQuestion.position,
                    page:updatedQuestion.page
                })
                });

                if (!updatePositionResponse.ok) {
                    toast.showError('Erreur lors de la mise a jour de la position')
                    throw new Error(`Erreur HTTP: ${updatePositionResponse.status}`);
                }
            
            }

        ////// ICI ON AJOUTERA PAREIL SI IL MODIFIE LE TYPE DE QUESTION ON SUPPRIME TOUTES LES RÉPONSES 

        
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
                toast.showError('Erreur lors de la mise a jour de la question')
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            
            const result = await response.json();
    
            if (!result.success) {
            toast.showError('Erreur')
            throw new Error(result.error || 'Erreur lors de la sauvegarde');
            }
          
            try {
                const response = await fetch(`http://localhost:3008/questionnaire/${questionnaireId}`);
                if (!response.ok) {
                        throw new Error('Erreur lors du chargement des sections');
                    }
                const data = await response.json();
                console.log('XXXXXXXXXXXXXXXXXXXX:', data);

                setQuestionnaire(data)
                setIsEditPopupOpen(false);
                toast.showSuccess("Question mise à jour")

                } catch (error) {
                toast.showError('Erreur fetching questionnaire')
                console.error('Error fetching questionnaire:', error);
                 return null;
            }
            // Ferme la popup
        } catch (error) {
            toast.showError('Erreur lors de la sauvegarde')
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