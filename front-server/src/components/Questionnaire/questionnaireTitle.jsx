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
      <div className='mt-6'>
      <div className="flex space-x-4 w-fit mx-auto mb-3">
       <p className={`px-2 py-1 rounded-lg text-sm ${questionnaire.isactive ? "bg-green-400/60 text-green-700" : "bg-red-400/40 text-red-700"}`}>{questionnaire.isactive ? "Actif\u00A0 ✔️" : "Inactif\u00A0\u00A0╳"}</p>
        <p className={`px-2 py-1 rounded-lg text-sm ${questionnaire.ispublished ? "bg-green-400/60 text-green-700" : "bg-red-400/40 text-red-700"}`}>{questionnaire.ispublished ? "Publié\u00A0 ✔️" : "Non publié\u00A0\u00A0╳"}</p>
      </div>
      <div className='bg-[#f5dafa]/90 text-[#af38ca] shadow rounded-xl px-2 py-2 border border-[#f5dafa]'>
        <p className="text-sm text-center">Question par défaut :</p>
        <p className="mt-1 text-sm text-center">{defaultQuestionType}</p>
      </div>
      </div>
    </div>
  )
}

export default QuestionnaireTitle;
