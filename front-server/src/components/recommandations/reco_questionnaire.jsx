import React from "react";
import RecoUpdateForm from './recoUpdateForm.jsx'

function RecoQuestionnaire({recommandation,onUpdateReco,setRecommandations}) {
  const [buttonUpdateReco, setButtonUpdateReco] = React.useState("Modifier");
  const [isRecommandation, setRecommandation] = React.useState(recommandation);

  async function updateReco(updates) {
    try {
      const response = await fetch(`http://localhost:3008/updatereco/${recommandation.id}`, {
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
        const updateReco = await updateReco(
          {
            recommandation: isRecommandation.recommandation,
            min: isRecommandation.min,
            max: isRecommandation.max,
          }
        );
        setButtonUpdateReco("Modifier");
        console.log('Reco updated:', updateReco);
      } catch (error) {
        console.error('Error updating Reco:', error);
      }
    }
  }

   const handleInputRecoChange = (e) => {
    const { name, value } = e.target;

    setRecommandations((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


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
          </div>
          <h3 className="section-title">{recommandation.recommandation}</h3>
        </div>
         ) : (
              <RecoUpdateForm recommandation={recommandation} onChange={handleInputRecoChange} />
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
      </div>
    </div>
  );
}

export default RecoQuestionnaire;
