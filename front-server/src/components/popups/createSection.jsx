import { saveButton } from '../button/button';

function PopupCreateSection({id, trigger, setTrigger}){
    console.log("Create section ");
    return (trigger) ? (
        <div className="popup">
            <div className="popup-inner">
                <h2>Créer Section</h2>
                <input type="text" placeholder="Nom" />
                <input type="text" placeholder="Aide"/>
                <input type="number" placeholder="scoreMax"  step="1" min="0" onInput={(e) => {e.target.value = e.target.value.replace(/[^0-9]/g, ''); }}/>
                <label for="name">Description - </label>
                <textarea/>

                {saveButton(id)}
                {/* <button className="text-btn" onClick={() => handleAdd(id)}>Sauvegarder</button> */}
                <button className="red-btn" onClick={() => setTrigger(false)}>Annuler</button>
            </div>
        </div>
    ): ""
}

export default PopupCreateSection