function QuestionnaireResume( { idQuestionnaire, label, version } ) {
    return (
        <div className="questionnaire-resume">
            <label>Edition : {lable}</label>
            <Search className = "icone" />
            <input type="text" placeholder="Rechercher" />
            <input type="text"placeholder="Nom questionnaire" />
            <input type="text" placeholder="Description"/>
            <p>Version {version} - Nombre de pages : N</p>
            <p>{idQuestionnaire}</p>
        </div>
    );
}

export default QuestionnaireResume;