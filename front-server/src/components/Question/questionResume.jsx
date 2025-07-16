import { editButton, deleteButton } from '../button/button.jsx';

function QuestionResume({ questionId, questionLabel }) {
    return (
        <div className="question-resume">
            <h2>{questionLabel}</h2>
            <div>
                {editButton(questionId, 'question')}
                {deleteButton(questionId, 'question')}
            </div>
            <p>{questionId}</p>
        </div>
    );
}
export default QuestionResume;