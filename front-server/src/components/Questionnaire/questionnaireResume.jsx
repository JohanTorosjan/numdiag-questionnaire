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