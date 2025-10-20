import { useState } from 'react';

function QuestionnaireTitleForm ({questionnaire, onChange}) {
   return (
    <form className='popup-form no-padding-top'>
      <h2 className='questionnaire-header-content'>Modifier le questionnaire</h2>
      <div className='form-group'>
        <label htmlFor="questionnaireTitle">Titre du questionnaire :</label>
        <input type="text" name="label" id="questionnaireTitle" required value={questionnaire.label} onChange={onChange}/>
      </div>
      <div className='form-group'>
        <label htmlFor="questionnaireDescription">Description :</label>
        <input type="text" name="description" id="questionnaireDescription" required value={questionnaire.description ? questionnaire.description : '' } onChange={onChange} />
      </div>
      <div className='form-group'>
        <label htmlFor="questionnaireInsight">Insight :</label>
        <input type="text" name="insight" id="questionnaireInsight" required value={questionnaire.insight ? questionnaire.insight : ''} onChange={onChange}/>
      </div>
      <div className='form-group'>
        <label htmlFor="questionnaireInsight">Tooltip :</label>
        <input type="text" name="tooltip" id="questionnaireTooltip" required value={questionnaire.tooltip ? questionnaire.tooltip : ''} onChange={onChange}/>
      </div>
    </form>
  )
}

export default QuestionnaireTitleForm;
