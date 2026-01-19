function QuestionnaireTitle ({questionnaire, defaultQuestionType}) {
  return (
    <div className="flex justify-between">
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
        <p>
          {questionnaire.tooltip}
        </p>
      </div>
      <div className='shadow rounded-xl px-3 py-2 border border-gray-50'>
        <p className="text-lg">Questions par défaut :</p>
        <p className="mt-1 text-lg text-center">{defaultQuestionType}</p>
      </div>
    </div>
  )
}

export default QuestionnaireTitle;
