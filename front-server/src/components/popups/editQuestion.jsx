import { useState } from "react";

// function PopUpEditQuestion({id,handleEdit,trigger,setTrigger}) {
//     // Logic to display a popup for editing a question
//     console.log("Editing question with id:", id);
//     const [typeQuestion, setTypeQuestion] = useState("choix-simple")
//     return (trigger) ? (
//         <div className="popup">
//             <div className="popup-inner">
//                 <h2>Modifier la question</h2>
//                 <input type="text" placeholder="Intitulé" />
//                 <input type="number" placeholder="Coefficient"  step="1" min="0" onInput={(e) => {e.target.value = e.target.value.replace(/[^0-9]/g, ''); }}/>
//                 <input type="number" placeholder="Page" />
//                 <input type="text" placeholder="Aide" />
//                 <button className="text-btn" onClick={() => handleEdit(id)}>Sauvegarder</button>
//                 <button className="close-btn" onClick={() => setTrigger(false)}>Annuler</button>
//             </div>
//         </div>
//     ) : "";
// }

// function TypeQuestion(props) {
//     return (
//         <div className="dropDownMenu">
//             <ul>
//                 <li>choix</li>
//             </ul>
//         </div>
//     );
// }

function PopUpEditQuestion({ id, handleEdit, trigger, setTrigger }) {
  const [typeQuestion, setTypeQuestion] = useState("entier");

  return trigger ? (
    <div className="popup">
      <div className="popup-inner">
        <h2>Créer une question</h2>
        <input type="text" placeholder="Intitulé" />
        <input type="number" placeholder="Coefficient" step="1" min="0" onInput={(e) => { e.target.value = e.target.value.replace(/[^0-9]/g, "");}} />
        <input type="number" placeholder="Page" step="1" min="0" onInput={(e) => { e.target.value = e.target.value.replace(/[^0-9]/g, "");}} />
        <input type="text" placeholder="Aide" />
        <select value={typeQuestion} onChange={(e) => setTypeQuestion(e.target.value)}>
          <option value="choix-simple">Choix simple</option>
          <option value="choix-multiple">Choix multiple</option>
          <option value="entier">Entier</option>
        </select>

  
        <div className="reponses">
          <h2>Reponses</h2>
            {typeQuestion === "choix-simple" && (
              <>
                <div className="reponse">
                  <p>°</p>
                  <input type="text" name="reponse" placeholder="Reponse" />
                  <input type="number" placeholder="Score"onInput={(e)=> {e.target.value = e.target.value.replace(/[^0-9.-]/g,"")}} />
                  <input type="text" placeholder="Aide"/>
                </div>
              
                <div className="reponse">
                <p>°</p>
                <input type="text" name="reponse" placeholder="Reponse" />
                <input type="number" placeholder="Score"onInput={(e)=> {e.target.value = e.target.value.replace(/[^0-9.-]/g,"")}} />
                <input type="text" placeholder="Aide"/>
              </div>
              </>

            )}
            {typeQuestion === "choix-multiple" && (
              <>
                <div className="reponse">
                  <p>x</p>
                  <input type="text" name="reponse" placeholder="Reponse" />
                  <input type="number" placeholder="Score"onInput={(e)=> {e.target.value = e.target.value.replace(/[^0-9.-]/g,"")}} />
                  <input type="text" placeholder="Aide"/>
                </div>
              
                <div className="reponse">
                <p>x</p>
                <input type="text" name="reponse" placeholder="Reponse" />
                <input type="number" placeholder="Score"onInput={(e)=> {e.target.value = e.target.value.replace(/[^0-9.-]/g,"")}} />
                <input type="text" placeholder="Aide"/>
              </div>
              </>
            )}
            {typeQuestion === "entier" && (
              <div className="reponse">
                <input placeholder="Réponse attendue..." />
              </div>  
            )}

            <button className="text-btn">+</button>
        </div>

        <button className="text-btn" onClick={() => handleEdit(id)}>Sauvegarder</button>
        <button className="close-btn" onClick={() => setTrigger(false)}>Annuler</button>
      </div>
    </div>
  ) : "";
}


export default PopUpEditQuestion;