// Censé aller dans l'éditeur de questionnaire (composant questionnaire)
// function QuestionnaireResume( { idQuestionnaire, label, version } ) {
//    return (
//        <div className="questionnaire-resume">
//            <label>Edition : {lable}</label>
//            <Search className = "icone" />
//            <input type="text" placeholder="Rechercher" />
//            <input type="text"placeholder="Nom questionnaire" />
//            <input type="text" placeholder="Description"/>
//            <p>Version {version} - Nombre de pages : N</p>

import { useNavigate } from 'react-router-dom';

function QuestionnaireResume({ idQuestionnaire, label }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/questionnaire/${idQuestionnaire}`);
    };

    return (
        <div 
            className="questionnaire-resume" 
            onClick={handleClick}
            style={{ cursor: 'pointer' }}
        >
            <h2>{label}</h2>
            <p>{idQuestionnaire}</p>
        </div>
    );
}

export default QuestionnaireResume;