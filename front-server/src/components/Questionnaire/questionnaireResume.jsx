function QuestionnaireResume( { idQuestionnaire, label } ) {
    return (
        <div className="questionnaire-resume">
            <h2>{label}</h2>
            <p>{idQuestionnaire}</p>
        </div>
    );
}



export default QuestionnaireResume;