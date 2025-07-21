function QuestionnaireResume( { idQuestionnaire, label } ) {
    return (
        <div className="questionnaire-resume">
            <h2>{label}</h2>
            <p>{idQuestionnaire}</p>
        </div>
    );
}

function PopupCreateQuestionnaire({handelCreation, trigger, setTrigger}){
    return (trigger) ? (
        <div className="popup">
            <div className="popup-innir">
                <h2>Création questionnaire</h2>
                <input type="text" placeholder='Titre' />
                <label>Description</label>
                <input type="text" />
                <input type="text" placeholder='Code'/>
                <input type="text" placeholder='version'/>
                <input type="text" placeholder='Aide'/>
                <input type="text" placeholder='ScoreMax'/>
                <button className="text-btn" onClick={()=> handelCreation()}>Sauvegarder</button>
                <button className='text-btn' onClick={()=> setTrigger(false)}>Annuler</button> 
            </div>
        </div>
    ) : "";
}

export default QuestionnaireResume;
export { PopupCreateQuestionnaire };