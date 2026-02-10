function ScoreUpdateForm({ score, onChange }) {

  return (
    <form className="w-full space-y-1">
      <label htmlFor="scoremin" className="font-light block text-xl">Score minimum :</label>
      <input
        type="number"
        name="scoremin"
        id="scoremin"
        required
        value={score.scoremin != null ? score.scoremin : ""}
        onChange={onChange}

        onKeyDown={(e) =>
          ["e", "E", "+", "-", ".", ","].includes(e.key) && e.preventDefault()
        }
        className="block w-30 border border-gray-300 rounded px-2 py-1"
      />
      <label htmlFor="scoremax" className="font-light block text-xl mt-3">Score maximum :</label>
      <input
        type="number"
        name="scoremax"
        id="scoremax"
        required
        value={score.scoremax != null ? score.scoremax : ""}
        onChange={(e) => {
          if (Number(e.target.value) < Number(score.scoremin)) return;
          onChange(e);
        }}
        min={score.scoremin ? score.scoremin : 0}
        onKeyDown={(e) =>
          ["e", "E", "+", "-", ".", ","].includes(e.key) && e.preventDefault()
        }
        className="block w-30 border border-gray-300 rounded px-2 py-1"
      />
      <label htmlFor="lettre" className="font-light block text-xl mt-3">lettre :</label>
      <textarea
        id="lettre"
        name="lettre"
        value={
          score.lettre ? score.lettre : ""
        }
        onChange={onChange}
        placeholder={
          score.lettre ? score.lettre : ""
        }
        required
        className="block w-full h-30 border border-gray-300 rounded px-2 py-1 mb-4"
      ></textarea>
    </form>
  );
}

export default ScoreUpdateForm;
