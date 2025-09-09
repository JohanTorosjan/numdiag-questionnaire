import { editButton, deleteButton } from '../button/button.jsx';

function QuestionResume({ questionId, questionLabel ,onShow}) {
    return (
        <div className="question-resume">
            <h2>{questionLabel}</h2>
            <div>
            <button className="green-btn" onClick={() => onShow()}>
            Edit
        </button>
                {/* {editButton(questionId, 'question')}
                {deleteButton(questionId, 'question')} */}
            </div>
            <p>{questionId}</p>
        </div>
    );
}
export default QuestionResume;