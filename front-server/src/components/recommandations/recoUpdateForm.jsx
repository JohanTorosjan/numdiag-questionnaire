import { useState } from "react";

function RecoUpdateForm({ recommandation, onChange }) {

  return (
    <form>
      <label htmlFor="min">Score minimum :</label>
      <input
        type="number"
        name="min"
        id="min"
        required
        value={recommandation.min != null ? recommandation.min : ""}
        onChange={onChange}

        onKeyDown={(e) =>
          ["e", "E", "+", "-", ".", ","].includes(e.key) && e.preventDefault()
        }
      />
      <label htmlFor="max">Score maximum :</label>
      <input
        type="number"
        name="max"
        id="max"
        required
        value={recommandation.max != null ? recommandation.max : ""}
        onChange={(e) => {
          if (Number(e.target.value) < Number(recommandation.min)) return;
          onChange(e);
        }}
        min={recommandation.min ? recommandation.min : 0}
        onKeyDown={(e) =>
          ["e", "E", "+", "-", ".", ","].includes(e.key) && e.preventDefault()
        }
      />
      <label htmlFor="recommandation">Recommandation :</label>
      <textarea
        id="recommandation"
        name="recommandation"
        value={
          recommandation.recommandation ? recommandation.recommandation : ""
        }
        onChange={onChange}
        placeholder={
          recommandation.recommandation ? recommandation.recommandation : ""
        }
        required
      ></textarea>
    </form>
  );
}

export default RecoUpdateForm;
