import { saveButton } from '../button/button';

function PopupCreateQuestionnaire({id, trigger, setTrigger}){
    return (trigger) ? (
        <div className="popup">
            <div className="popup-inner">
                <h2>Création questionnaire</h2>
                <input type="text" placeholder='Titre' />
                <input type="text" placeholder='Code'/>
                <input type="text" placeholder='version'/>
                <input type="text" placeholder='Aide'/>
                <input type="number" placeholder='ScoreMax'step="1" min="0" onInput={(e) => {e.target.value = e.target.value.replace(/[^0-9.-]/g, ''); }}/>
                <label>Description</label>
                <textarea/>
                {/* ajouter tohero ou pas */}
                {saveButton(id)}
                <button className='red-btn' onClick={()=> setTrigger(false)}>Annuler</button> 
            </div>
        </div>
    ) : "";
}

export default PopupCreateQuestionnaire