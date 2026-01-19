import { useState } from 'react';

function QuestionnaireTitleForm ({questionnaire, questionTypes, onChange}) {
   return (
    <form className="w-full space-y-1">
      <label htmlFor="questionnaireTitle" className="font-semibold block text-xl">Titre du questionnaire :</label>
      <input type="text" name="label" id="questionnaireTitle" className="block w-2/3 border border-gray-300 rounded px-3 py-2" required value={questionnaire.label} onChange={onChange}/>
      <label htmlFor="questionnaireDescription" className="font-semibold block text-lg mt-3">Description :</label>
      <textarea name="description" id="questionnaireDescription" className="field-sizing-content block w-full text-wrap border border-gray-300 rounded px-2 py-1" required value={questionnaire.description ? questionnaire.description : '' } onChange={onChange} />
      <div className="flex space-x-2 mt-3">
        <div className="w-1/2">
          <label htmlFor="questionnaireTooltip" className="block text-lg">Tooltip :</label>
          <textarea name="tooltip" id="questionnaireTooltip" className="field-sizing-content block w-full border border-gray-300 rounded px-3 py-2" required value={questionnaire.tooltip ? questionnaire.tooltip : ''} onChange={onChange}/>
        </div>
        <div className="w-1/2">
          <label htmlFor="questionnaireInsight" className="block text-lg">Insight :</label>
          <textarea name="insight" id="questionnaireInsight" className="field-sizing-content block w-full border border-gray-300 rounded px-3 py-2" required value={questionnaire.insight ? questionnaire.insight : ''} onChange={onChange}/>
        </div>
      </div>
      <div className="flex space-x-2 mt-3">
        <div className="w-1/2">
          <label htmlFor="questionnaireCode" className="block text-lg mt-3">Code (optionnel) :</label>
          <input type="number" name="code" id="questionnaireCode" className="block w-20 border border-gray-300 rounded px-2 py-1" required value={questionnaire.code || '' ? questionnaire.code : null} onChange={onChange} onKeyDown={(e) =>
              ["e", "E", "+", "-", ".", ","].includes(e.key) && e.preventDefault()
            }/>
        </div>
        <div className="w-fit">
          <label htmlFor="questiontype" className="block text-lg mt-3 text-[#af38ca]">Type de question par défaut:</label>
          <select
              id="default_question_type"
              name="default_question_type"
              value={questionnaire.default_question_type || '' ? questionnaire.default_question_type : "Non défini"} onChange={onChange}
              size="1"
              className="border border-gray-200 rounded-lg px-2 py-1 text-lg text-[#af38ca]"
          >
              <option value="Non défini" id="default_question_type"
              name="default_question_type">Non défini</option>
              {questionTypes.map(type => (
                  <option key={type.value} value={type.value}>
                      {type.label}
                  </option>
              ))}
          </select>
        </div>
      </div>
    </form>
  )
}

export default QuestionnaireTitleForm;
