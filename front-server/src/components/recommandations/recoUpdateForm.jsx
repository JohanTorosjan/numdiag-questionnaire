function RecoUpdateForm({ recommandation, onChange }) {

  return (
    <form className="w-full space-y-1">
      <label htmlFor="min" className="font-light block text-xl">Score minimum :</label>
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
        className="block w-30 border border-gray-300 rounded px-2 py-1"
      />
      <label htmlFor="max" className="font-light block text-xl mt-3">Score maximum :</label>
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
        className="block w-30 border border-gray-300 rounded px-2 py-1"
      />
      <label htmlFor="recommandation" className="font-light block text-xl mt-3">Recommandation :</label>
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
        className="block w-full h-30 border border-gray-300 rounded px-2 py-1 mb-4"
      ></textarea>
    </form>
  );
}

export default RecoUpdateForm;
