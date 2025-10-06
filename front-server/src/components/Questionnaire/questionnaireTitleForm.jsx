import { useState } from 'react';

function QuestionnaireTitleForm ({questionnaire, onChange}) {
   return (
    <form>
      <input type="text" name="label" id="questionnaireTitle" required value={questionnaire.label} onChange={onChange}/>
      <input type="text" name="description" id="questionnaireDescription" required value={questionnaire.description ? questionnaire.description : undefined } onChange={onChange} />
      <input type="text" name="insight" id="questionnaireInsight" required value={questionnaire.insight ? questionnaire.insight : undefined} onChange={onChange}/>
    </form>
  )
}

export default QuestionnaireTitleForm;
