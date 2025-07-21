function popUpEditSection() {
    // Logic to display a popup for editing a section
    console.log("Editing section with id:", id);
    return (
        <div className="popup">
            <h2>Modification section</h2>
            <input type="text" placeholder="Intitulé"/>
            <input type="text" placeholder="Aide"/>
            <p>Description</p>
            <input type="text"/>
        </div>
    );
}

function PopupCreateSection({handelCreate, trigger, setTrigger}){
    console.log("Create section ");
    return (trigger) ? (
        <div className="popup">
            <h2>Créer Section</h2>
            <input type="text" placeholder="Nom" />
            <label for="name">Description - </label>
            <input type="text" placeholder="Description"/>
            <input type="text" placeholder="Aide"/>
            <input type="number" placeholder="scoreMax" />
        </div>
    ): ""
}

export default {popUpEditSection, PopupCreateSection};