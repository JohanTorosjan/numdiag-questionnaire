import { useState } from 'react';

function QuestionnaireTitleForm ({questionnaire, onChange}) {
  const [inputForm, setInputForm] = useState('')
  const handleInputChange = (e) => {
    e.stopPropagation(); // Prevent form onChange from firing
    onChange(e);
  };
  function changeInput(e) {
    setInputForm(e.target.value);
  }
   return (
    <form>
      <input type="text" name="label" id="questionnaireTitle" required value={questionnaire.label} onChange={onChange}/>
      <input type="text" name="description" id="questionnaireDescription" required value={questionnaire.description} onChange={onChange} />
      <input type="text" name="insight" id="questionnaireInsight" required value={questionnaire.insight} onChange={onChange}/>
    </form>
  )
}

export default QuestionnaireTitleForm;
