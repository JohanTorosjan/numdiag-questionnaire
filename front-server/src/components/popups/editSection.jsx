import { saveButton } from '../button/button';

function PopUpEditSection({id,handleEdit, trigger, setTrigger}) {
    // Logic to display a popup for editing a section
    console.log("Editing section with id:", id);
    return (trigger)?  (
        <div className="popup">
            <div className="popup-inner">
                <h2>Modification section</h2>
                <input type="text" placeholder="Intitulé"/>
                <input type="text" placeholder="Aide"/>
                <p>Description</p>
                <textarea className=""/>
                {saveButton(id)}
                <button className="close-btn" onClick={() => setTrigger(false)}>Annuler</button>
            </div>
        </div>
    ): "";
}

export default PopUpEditSection;

