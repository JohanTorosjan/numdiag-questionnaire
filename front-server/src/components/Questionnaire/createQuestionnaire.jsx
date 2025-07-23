import { saveButton } from '../button/button';

function PopupCreateQuestionnaire({id,handelCreation, trigger, setTrigger}){
    return (trigger) ? (
        <div className="popup">
            <div className="popup-inner">
                <h2>Création questionnaire</h2>
                <input type="text" placeholder='Titre' />
                <input type="text" placeholder='Code'/>
                <input type="text" placeholder='version'/>
                <input type="text" placeholder='Aide'/>
                <input type="text" placeholder='ScoreMax'/>
                <label>Description</label>
                <textarea/>
                {/* ajouter tohero ou pas */}
                {saveButton(id)}
                <button className='text-btn' onClick={()=> setTrigger(false)}>Annuler</button> 
            </div>
        </div>
    ) : "";
}

export default PopupCreateQuestionnaire