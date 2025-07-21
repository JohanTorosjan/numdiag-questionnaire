
function PopUpEditQuestion({id,handleEdit,trigger,setTrigger}) {
    // Logic to display a popup for editing a question
    console.log("Editing question with id:", id);
    return (trigger) ? (
        <div className="popup">
            <div className="popup-inner">
                <h2>Modifier la question</h2>
                <input type="text" placeholder="Intitulé" />
                <input type="number" placeholder="Coefficient"/>
                <input type="number" placeholder="Page" />
                <input type="text" placeholder="Aide" />
                <button className="text-btn" onClick={() => handleEdit(id)}>Sauvegarder</button>
                <button className="close-btn" onClick={() => setTrigger(false)}>Annuler</button>
            </div>
        </div>
    ) : "";
}

// function reponseChoixMultiple() {
//     return (
//         <div>
//             <h3> </h3>
//         </div>
//     );
// }

export default PopUpEditQuestion;