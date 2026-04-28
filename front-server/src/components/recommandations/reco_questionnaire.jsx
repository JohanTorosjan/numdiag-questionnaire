import React from "react";
import RecoUpdateForm from './recoUpdateForm.jsx'

function RecoQuestionnaire({recommandation,onUpdateReco, onDeleteReco}) {
  const [buttonUpdateReco, setButtonUpdateReco] = React.useState("Modifier");
  const [isRecommandation, setRecommandation] = React.useState(recommandation);

  async function updateReco(updates) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/updatereco/${recommandation.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates)
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour en db des infos de recommandation');
      }
      const data = await response.json();
      console.log('Mise à jour de la recommandation :', recommandation.id);
      onUpdateReco(recommandation.id, updates);
      return data;
    } catch (error) {
      console.error('Error updating recommandation:', error);
      return null;
    }
  }

  async function toggleButtonUpdateReco() {
    if (buttonUpdateReco === "Modifier") {
      setButtonUpdateReco("Valider");
    } else {
      try {
        const updatereco = await updateReco(
          {
            recommandation: isRecommandation.recommandation,
            critique: isRecommandation.critique,
            min: isRecommandation.min,
            max: isRecommandation.max,
          }
        );
        setButtonUpdateReco("Modifier");
        console.log('Reco updated:', updatereco);
      } catch (error) {
        console.error('Error updating Reco:', error);
      }
    }
  }

   const handleInputRecoChange = (e) => {
    const { name, value } = e.target;

    setRecommandation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  async function deleteReco() {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/deletereco/${recommandation.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression en db de la recommandation');
      }
      const data = await response.json();
      console.log('Suppression de la recommandation :', recommandation.id);
      onDeleteReco(recommandation.id);
      return data;
    } catch (error) {
      console.error('Error deleting recommandation:', error);
      return null;
    }
  }


  return (
    <div className="section" style={{padding: 10+'px'}}>
      <div className="section-content">
    {buttonUpdateReco === "Modifier" ? (
        <div className="section-info">
          <div className="section-metadata">
            <span className="metadata-item">
              <span className="metadata-label">Score minimum:</span>{" "}
              {recommandation.min}
            </span>
            <span className="metadata-item">
              <span className="metadata-label">Score maximum:</span>{" "}
              {recommandation.max}
            </span>
            <span className="metadata-item">
              <span className="metadata-label">Criticité:</span>{" "}
              {recommandation.critique}
            </span>
          </div>
          <h3 className="section-title">{recommandation.recommandation}</h3>
        </div>
         ) : (
              <RecoUpdateForm recommandation={isRecommandation} onChange={handleInputRecoChange} />
            )}
      </div>
      <div className="section-actions">
        <button
          type="button"
          className="btn-action btn-edit"
          onClick={toggleButtonUpdateReco}
        >
          {buttonUpdateReco}
        </button>
        <button
          type="button"
          className={`btn-action btn-edit`}
          onClick={() => deleteReco()}
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

export default RecoQuestionnaire;
