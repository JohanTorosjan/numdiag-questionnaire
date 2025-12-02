import { useNavigate, useParams } from 'react-router-dom';

function ScoreDisplay() {
  const { session_id } = useParams();

    return (
        <div

        >
            Hello session {session_id}
        </div>
    );
}

export default ScoreDisplay;
