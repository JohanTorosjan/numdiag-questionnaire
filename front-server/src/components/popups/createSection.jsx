async function createSection(label, helper, description)
{
    try {
        const response = await fetch('http://127.0.0.1:3008/section', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: label,
                help: helper,
                description: description
            })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Section created:', data);
    }
    catch (error) {
        console.error('Error creating section:', error);
    }
}

function PopupCreateSection({trigger, setTrigger}){
    console.log("Create section ");
    const handleCreate = () => {
        const label = document.getElementById('sectionName').value;
        const helper = document.getElementById('sectionHelper').value;
        const description = document.getElementById('sectionDescriptionInput').value;
        createSection(label, helper, description);
    };

    return (trigger) ? (
        <div className="popup">
            <div className="popup-inner">
                <h2>Créer Section</h2>
                <input type="text" placeholder="Nom" id="sectionName"/>
                <input type="text" placeholder="Aide" id="sectionHelper"/>
                {/* <input type="number" id="sectionScoreMax" placeholder='ScoreMax'step="1" min="0" onInput={(e) => {e.target.value = e.target.value.replace(/[^0-9.-]/g, ''); }}/> */}
                <label htmlFor="sectionDescriptionInput">Description - </label>
                <input type="text" id="sectionDescriptionInput"/>

                <button className="text-btn" onClick={handleCreate}>Sauvegarder</button>
                <button className="red-btn" onClick={() => setTrigger(false)}>Annuler</button>
            </div>
        </div>
    ) : "";
}

export default PopupCreateSection