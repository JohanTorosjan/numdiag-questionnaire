// import { useState } from "react";
// import { saveButton } from '../button/button';

// function PopUpEditQuestion({ id, }) {
//   const [typeQuestion, setTypeQuestion] = useState("entier");
  
//   return  (
//     <div className="popup">
//       <div className="popup-inner">
//         <h2>Créer une question</h2>
//         <input type="text" placeholder="Intitulé" />
//         <input type="number" placeholder="Coefficient" step="1" min="0" onInput={(e) => { e.target.value = e.target.value.replace(/[^0-9]/g, "");}} />
//         <input type="number" placeholder="Page" step="1" min="0" onInput={(e) => { e.target.value = e.target.value.replace(/[^0-9]/g, "");}} />
//         <input type="text" placeholder="Aide" />
//         <select value={typeQuestion} onChange={(e) => setTypeQuestion(e.target.value)}>
//           <option value="choix-simple">Choix simple</option>
//           <option value="choix-multiple">Choix multiple</option>
//           <option value="entier">Entier</option>
//         </select>

  
//         <div className="reponses">
//           <h2>Reponses</h2>
//             {typeQuestion === "choix-simple" && (
//               <>
//                 <div className="reponse">
//                   <p>°</p>
//                   <input type="text" name="reponse" placeholder="Reponse" />
//                   <input type="number" placeholder="Score"onInput={(e)=> {e.target.value = e.target.value.replace(/[^0-9.-]/g,"")}} />
//                   <input type="text" placeholder="Aide"/>
//                 </div>
              
//                 <div className="reponse">
//                 <p>°</p>
//                 <input type="text" name="reponse" placeholder="Reponse" />
//                 <input type="number" placeholder="Score"onInput={(e)=> {e.target.value = e.target.value.replace(/[^0-9.-]/g,"")}} />
//                 <input type="text" placeholder="Aide"/>
//               </div>
//               </>
//             )}
//             {typeQuestion === "choix-multiple" && (
//               <>
//                 <div className="reponse">
//                   <p>x</p>
//                   <input type="text" name="reponse" placeholder="Reponse" />
//                   <input type="number" placeholder="Score"onInput={(e)=> {e.target.value = e.target.value.replace(/[^0-9.-]/g,"")}} />
//                   <input type="text" placeholder="Aide"/>
//                 </div>
              
//                 <div className="reponse">
//                 <p>x</p>
//                 <input type="text" name="reponse" placeholder="Reponse" />
//                 <input type="number" placeholder="Score"onInput={(e)=> {e.target.value = e.target.value.replace(/[^0-9.-]/g,"")}} />
//                 <input type="text" placeholder="Aide"/>
//               </div>
//               </>
//             )}
//             {typeQuestion === "entier" && (
//               <div className="reponse">
//                 <input placeholder="Réponse attendue..." />
//               </div>  
//             )}

//             <button className="text-btn">+</button>
//         </div>

//         {saveButton(id)}
//         <button className="red-btn" onClick={() => set}>Annuler</button>
//       </div>
//     </div>
//   );
// }


// export default PopUpEditQuestion;





import { useState } from 'react';
import './PopUpEditQuestion.css'; // Pour le styling

function PopUpEditQuestion({ question, onSave, onClose }) {
    const [formData, setFormData] = useState({
        title: question.label || '',
        description: question.description || '',
        type: question.type || '',
        // Ajoute d'autres champs selon ta structure
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="popup-overlay" onClick={handleBackdropClick}>
            <div className="popup-content">
                <div className="popup-header">
                    <h3>Éditer la question</h3>
                    <button onClick={onClose} className="close-button">×</button>
                </div>
                
                <form onSubmit={handleSubmit} className="popup-form">
                    <div className="form-group">
                        <label htmlFor="title">Titre de la question :</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description :</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows="4"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="type">Type de question :</label>
                        <select
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleInputChange}
                        >
                            <option value="">Sélectionner un type</option>
                            <option value="text">Texte libre</option>
                            <option value="multiple">Choix multiple</option>
                            <option value="single">Choix unique</option>
                        </select>
                    </div>

                    <div className="popup-actions">
                        <button type="button" onClick={onClose} className="cancel-button">
                            Annuler
                        </button>
                        <button type="submit" className="save-button">
                            Sauvegarder
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default PopUpEditQuestion;