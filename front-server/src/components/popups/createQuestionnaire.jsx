import { saveButton } from '../button/button';
import { useNavigate } from 'react-router-dom';

function PopupCreateQuestionnaire({trigger, setTrigger}){
  const [formData, setFormData] = useState({
    titre: '',
    code: '',
    version: '',
    aide: '',
    scoreMax: '',
    description: '',
  });

  function handleChange(element) {
    const { name, value } = element.target;
    const cleanValue = name === 'scoreMax' ? value.replace(/[^0-9]/g, '') : value;
    setFormData((dataset) => ({
      ...dataset,
      [name]: cleanValue,
    }));
  };

  async function postQuestionnaire() {
    try {
      const response = await fetch('http://127.0.0.1:3008/createQuestionnaire', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('Success:', data);
      navigate('/');
    } catch (error) {
      console.error('Failed to create questionnaire: ', error);
      const errData = await response.json();
        console.error('Error:', errData.message);

        // display an error popup to inform that the questionnaire could not be created

        return;
    }
  };


  return (trigger) ? (
      <div className="popup">
          <div className="popup-inner">
            <form>
              <h2>Création questionnaire</h2>
              <input type="text" placeholder='Titre' name="titre" value="formData.titre" onChange={handleChange} />
              <input type="text" placeholder='Code' name="code" value="formData.code" onChange={handleChange} />
              <input type="text" placeholder='version' name="version" value={formData.version} onChange={handleChange} />
              <input type="text" placeholder='Aide' name="aide" value={formData.aide} onChange={handleChange} />
              <input type="number" placeholder='ScoreMax' name="scoreMax" step="1" min="0" value={formData.scoreMax} onChange={handleChange} />
              <textarea placeholder='Description' name="description" value={formData.description} onChange={handleChange}></textarea>

              {/* ajouter tohero ou pas */}
              <button class='green-btn' onClick={()=> postQuestionnaire()}>Sauvegarder</button>
              <button class='red-btn' onClick={()=> setTrigger(false)}>Annuler</button>
            </form>
          </div>
      </div>
  ) : "";
}

export default PopupCreateQuestionnaire
