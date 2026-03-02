import { useState } from "react";

function SectionUpdateForm({ section, onChange }) {
  return (
    <form className="w-full px-5 py-1">

        <label htmlFor="sectionTitle" className="block">Nom de section :</label>
        <input
          type="text"
          name="label"
          id="sectionTitle"
          required
          value={section.label}
          onChange={onChange}
          className="inline-block rounded bg-white px-2 py-1 border border-gray-300"
        />
      <div className="w-full flex flex-wrap justify-between">
        <div className="w-[45%]">
          <label htmlFor="sectionDescription" className="block">Description :</label>
          <textarea
            type="text"
            name="description"
            id="sectionDescription"
            required
            value={section.description ? section.description : ""}
            onChange={onChange}
            className="inline-block rounded bg-white px-2 py-1 border border-gray-300 w-full field-sizing-content text-break-all"
          />
        </div>
        <div className="w-[45%]">
          <label htmlFor="sectionTooltip" className="block">Tooltip :</label>
          <textarea
            type="text"
            name="tooltip"
            id="sectionTooltip"
            required
            value={section.tooltip ? section.tooltip : ""}
            onChange={onChange}
            className="inline-block rounded bg-white px-2 py-1 border border-gray-300 w-full field-sizing-content text-break-all"
          />
        </div>
      </div>
      <label htmlFor="sectionNbPages" className="block">Nombre de pages :</label>
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
        className="inline-block rounded bg-white px-2 py-1 border border-gray-300"
      />
    </form>
  );
}

export default SectionUpdateForm;
