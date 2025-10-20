import { useState } from "react";

function SectionUpdateForm({ section, onChange }) {
  return (
     <form className='popup-form no-padding-top'>
      <div className="form-group">
        <label htmlFor="sectionTitle">Nom de section :</label>
        <input
          type="text"
          name="label"
          id="sectionTitle"
          required
          value={section.label}
          onChange={onChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="sectionDescription">Description :</label>
        <input
          type="text"
          name="description"
          id="sectionDescription"
          required
          value={section.description ? section.description : ""}
          onChange={onChange}
        />
      </div>
      <div className='form-row'>
        <div className="form-group">
          <label htmlFor="sectionTooltip">Tooltip :</label>
          <input
            type="text"
            name="tooltip"
            id="sectionTooltip"
            required
            value={section.tooltip ? section.tooltip : ""}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="sectionNbPages">Nombre de pages :</label>
          <input
            type="number"
            name="nbpages"
            id="sectionNbPages"
            required
            value={section.nbpages ? section.nbpages : ""}
            onChange={onChange}
            min="0"
            onKeyDown={(e) =>
              ["e", "E", "+", "-", ".", ","].includes(e.key) && e.preventDefault()
            }
          />
        </div>
      </div>
    </form>
  );
}

export default SectionUpdateForm;
