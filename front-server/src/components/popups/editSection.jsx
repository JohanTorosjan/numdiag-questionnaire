import { saveButton } from '../button/button';

function PopUpEditSection({idSection, trigger, setTrigger}) {
    // Logic to display a popup for editing a section
    console.log("Editing section with id:", idSection);

    const [formData, setFormData] = useState({
    label:'',
    description:'',
    position:'',
    tooltip:'',
    scoremax:''
  });

    async function fetchSectionInfo(idSection) {
    try {
      const response = await fetch(`/getSection/${idSection}`)

      const data = await response.json();
      console.log('Success:', data);
      return data;
    } catch (error) {
      console.error('Failed to retrieve section infos: ', error);
      const errData = await response.json();
      console.error('Error:', errData.message);

        // display an error popup to inform that the section infos could not be fetched

      return;
    }
  };

  function handleChange(element) {
    const { name, value } = element.target;
    const cleanValue = name === 'scoreMax' ? value.replace(/[^0-9]/g, '') : value;
    setFormData((dataset) => ({
      ...dataset,
      [name]: cleanValue,
    }));
  };

  async function postSection(idSection) {
    try {
      const response = await fetch(`/updateSection/${idSection}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('Success:', data);
      setTrigger(false);
    } catch (error) {
      console.error('Fetch failed', error);
      const errData = await response.json();
      console.error('Error:', errData.message);

        // display an error popup to inform that the section could not be updated

      return;
    }
  };

  const {label, description, position, tooltip, scoreMax} = fetchSectionInfo(idSection);

    return (trigger)?  (
        <div className="popup">
            <div className="popup-inner">
                <h2>Modification section</h2>
                <input type="text" placeholder={label}/>
                <textarea placeholder={description}></textarea>
                <input type="number" placeholder={position}/>
                <textarea placeholder={tooltip}> </textarea>
                <input type="number" placeholder={scoreMax} name="scoreMax" step="1" min="0" value={formData.scoreMax} onChange={handleChange} />
                {saveButton(id)}
                <button className="red-btn" onClick={() => setTrigger(false)}>Annuler</button>
            </div>
        </div>
    ): "";
}

export default PopUpEditSection;
