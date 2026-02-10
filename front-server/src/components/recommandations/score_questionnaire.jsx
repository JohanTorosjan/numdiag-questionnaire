import { useState } from "react";
import ScoreUpdateForm from './scoreUpdateForm.jsx'

function ScoreQuestionnaire({questionnaireId, score, onUpdateScore, onDeleteScore}) {
  const [buttonUpdateScore, setButtonUpdateScore] = useState("Modifier");
  const [isScore, setScore] = useState(score);

  async function updateScore(updates) {
    console.log("Score id test:", score)
    try {
      const response = await fetch(`http://localhost:3008/updatescore/${score.score_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates)
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour en db des infos de score');
      }
      const data = await response.json();
      console.log('Mise à jour du score :', score.id);
      onUpdateScore(score.score_id, updates);
      return data;
    } catch (error) {
      console.error('Error updating score:', error);
      return null;
    }
  }

  async function toggleButtonUpdateScore() {
    if (buttonUpdateScore === "Modifier") {
      setButtonUpdateScore("Valider");
    } else {
      try {
        const updatedScore = await updateScore(
          {
            questionnaireId: questionnaireId,
            lettre: isScore.lettre,
            scoremin: isScore.scoremin,
            scoremax: isScore.scoremax,
          }
        );
        setButtonUpdateScore("Modifier");
        console.log('Score updated:', updatedScore);
      } catch (error) {
        console.error('Error updating score:', error);
      }
    }
  }

   const handleInputScoreChange = async (e) => {
    const { name, value } = e.target;

    setScore((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  async function deleteScore() {
    try {
      const response = await fetch(`http://localhost:3008/deletescore/${score.score_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({questionnaireId: questionnaireId})
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression en db du score');
      }
      const data = await response.json();
      console.log('Suppression du score :', score.score_id);
      onDeleteScore(score.score_id);
      return data;
    } catch (error) {
      console.error('Error deleting score:', error);
      return null;
    }
  }


  return (
    <div className="section" style={{padding: 10+'px'}}>
      <div className="section-content">
        {buttonUpdateScore === "Modifier" ? (
        <div className="section-info">
          <div className="section-metadata">
            <span className="metadata-item">
              <span className="metadata-label">Score minimum:</span>{" "}
              {isScore.scoremin}
            </span>
            <span className="metadata-item">
              <span className="metadata-label">Score maximum:</span>{" "}
              {isScore.scoremax}
            </span>
          </div>
          <h3 className="section-title">{isScore.lettre}</h3>
        </div>
         ) : (
              <ScoreUpdateForm score={isScore} onChange={handleInputScoreChange} />
            )}
      </div>
      <div className="section-actions">
        <button
          type="button"
          className="btn-action btn-edit"
          onClick={toggleButtonUpdateScore}
        >
          {buttonUpdateScore}
        </button>
        <button
          type="button"
          className={`btn-action btn-edit`}
          onClick={() => deleteScore()}
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

export default ScoreQuestionnaire;
