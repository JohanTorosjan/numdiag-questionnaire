function QuestionnaireTitle ({questionnaire}) {
  return (
    <div>
      <h1>
        {questionnaire.label}
      </h1>
      <h2>
        {questionnaire.description}
      </h2>
      <p>
        {questionnaire.insight}
      </p>
    </div>
  )
}

export default QuestionnaireTitle;
