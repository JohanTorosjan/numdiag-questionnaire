import { useState } from 'react';

function QuestionnaireTitleForm ({questionnaire, onChange}) {
   return (
    <form>
      <label htmlFor="questionnaireTitle">Titre du questionnaire :</label>
      <input type="text" name="label" id="questionnaireTitle" required value={questionnaire.label} onChange={onChange}/>
      <label htmlFor="questionnaireDescription">Description :</label>
      <input type="text" name="description" id="questionnaireDescription" required value={questionnaire.description ? questionnaire.description : '' } onChange={onChange} />
      <label htmlFor="questionnaireInsight">Insight :</label>
      <input type="text" name="insight" id="questionnaireInsight" required value={questionnaire.insight ? questionnaire.insight : ''} onChange={onChange}/>
    </form>
  )
}

export default QuestionnaireTitleForm;
