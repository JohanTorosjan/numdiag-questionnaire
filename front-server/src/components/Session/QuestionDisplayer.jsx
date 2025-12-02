import { useState, useEffect } from "react";

function QuestionDisplayer({ question, onAnswerChange,initialAnswer }) {

    const [selectedMultiple, setSelectedMultiple] = useState(initialAnswer.answers.find(r=>r.questionId==question.id).reponseIds ||[]);
    const [textValue, setTextValue] = useState(
        initialAnswer.answers.find(r=>r.questionId==question.id).flatReponse||"");

    const [selectedValue, setSelectedValue] = useState(
        initialAnswer.answers.find(r=>r.questionId==question.id).reponseIds[0] || null

    );
    // Notifier le parent à chaque changement de réponse
    useEffect(() => {
        const answer = {
            questionId: question.id,
            reponseIds: [],
            flatReponse: null
        };
       // debugger
        switch (question.questiontype) {
            case "choix_simple":
                if (selectedValue !== null) {
                    answer.reponseIds = [selectedValue];
                }
                break;
            case "choix_multiple":
                answer.reponseIds = selectedMultiple;
                break;
            case "entier":
            case "libre":
                answer.flatReponse = textValue;
                break;
        }

        onAnswerChange(answer);
    }, [selectedValue, selectedMultiple, textValue, question.id, question.questiontype]);

    const renderQuestionByType = () => {
        switch (question.questiontype) {
            case "choix_simple":
                return (
                  <div className="w-full relative">
                    <div className="flex flex-wrap gap-x-4">
                        {question.reponses.map((reponse) => (
                          <label
                          key={reponse.id}
                          className="mb-3 flex items-center justify-items-center px-2 py-1 rounded hover:bg-gray-100 cursor-pointer"
                          >
                                <input
                                    type="radio"
                                    name={`question_${question.id}`}
                                    value={reponse.id}
                                    checked={selectedValue === reponse.id}
                                    onChange={() => setSelectedValue(reponse.id)}
                                    className="mr-3"
                                />
                                <span>{reponse.label}</span>
                                {reponse.tooltip && (
                                  <span className="text-sm text-gray-500 italic w-1/3">
                                        ({reponse.tooltip})
                                    </span>
                                )}
                            </label>
                        ))}
                    </div>
                  </div>
                );

                case "choix_multiple":
                  return (
                    <div className="w-full relative">
                    <div className="flex flex-wrap gap-x-4 items-center justify-items-center">
                        {question.reponses.map((reponse) => (
                          <label
                          key={reponse.id}
                          className="mb-3 flex items-center justify-items-center px-2 py-1 rounded hover:bg-gray-100 cursor-pointer"
                          >
                                <input
                                    type="checkbox"
                                    value={reponse.id}
                                    checked={selectedMultiple.includes(reponse.id)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedMultiple([...selectedMultiple, reponse.id]);
                                      } else {
                                        setSelectedMultiple(selectedMultiple.filter(id => id !== reponse.id));
                                      }
                                    }}
                                    className="mr-3"
                                />
                                <span>{reponse.label}</span>
                                {reponse.tooltip && (
                                  <span className="text-sm text-gray-500 italic w-1/3">
                                        ({reponse.tooltip})
                                    </span>
                                )}
                            </label>
                        ))}
                    </div>
                  </div>
                );

                case "entier":
                  let globalMin=0;
                  let globalMax=0;
                  const [erreurEntier, setErreurEntier] = useState(false);

                  if (question.reponsesTranches.length > 0 && textValue !== '') {
                    const allMins = question.reponsesTranches.map(t => t.min);
                    const allMaxs = question.reponsesTranches.map(t => t.max);
                    globalMin = Math.min(...allMins);
                    globalMax = Math.max(...allMaxs);
                  }

                  return (
                    <div className="flex flex-wrap gap-x-4 relative mb-3">
                        <input
                            type="number"
                            className="md:w-1/3 p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Entrez un nombre entier"
                            value={textValue}
                            onChange={(e) => {
                              const newValue = e.target.value;
                              setTextValue(newValue);
                              if (newValue !== '' && question.reponsesTranches.length > 0) {
                                const numValue = Number(newValue);
                                if (numValue < globalMin || numValue > globalMax) {
                                  console.log(`Valeur hors plage! Doit être entre ${globalMin} et ${globalMax}`);
                                  setTextValue(globalMin)
                                  setErreurEntier(true)
                                } else {
                                  setErreurEntier(false)
                                }
                              }
                            }}
                        />
                        {question.reponsesTranches.length > 0 && (
                          <div className="text-sm text-gray-500 justify-self-end self-end">
                            {erreurEntier && (
                              <p className="text-red-500 text-sm mt-1">{`Valeur hors plage — veuillez saisir un entier compris entre ${globalMin} et ${globalMax}.`}</p>
                            )}
                                {question.reponsesTranches.map((tranche, index) => (
                                  <div key={index}>
                                        Plage: {tranche.min} - {tranche.max} (valeur: {tranche.value})
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );

                case "libre":
                  return (
                    <div className="relative mb-3">
                        <textarea
                            className="w-full p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-fit min-h-32 border border-gray-300"
                            placeholder="Entrez votre réponse..."
                            value={textValue}
                            onChange={(e) => setTextValue(e.target.value)}
                        />
                    </div>
                );

                default:
                  return (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
                        <p className="text-yellow-800">
                            Type de question non supporté: {question.questiontype}
                        </p>
                    </div>
                );
              }
            };
            let image;
            switch (question.questiontype) {
              case "choix_simple":
                 image= <img src="/images/number-1.svg" className="h-9 w-9 md:h-10 md:w-10 absolute top-2 right-3" alt="" />;
                 break
              case "choix_multiple":
                 image=<img src="/images/hello.svg" className="h-9 w-9 md:h-10 md:w-10 absolute top-2 right-3" alt="" />;
                 break
              case "entier":
                 image=<img src="/images/math.svg" className="h-13 w-13 md:h-13 md:w-13 absolute top-2 right-3" alt="" />;
                 break
              case "libre":
                 image=<img src="/images/feather-pen.svg" className="h-8 w-8 md:h-10 md:w-10 absolute md:top-5 top-7 right-3" alt="" />;
                 break
            }


    return (
        <div className="bg-white px-5 py-2 rounded-lg shadow-sm relative">
          {image}
            {/* Label de la question */}
            <div className="mb-4">
                    {question.theme && (
                        <span className="inline-block -ml-3 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                            {question.theme}
                        </span>
                    )}
                <h3 className="mt-2 text-lg font-semibold flex items-center ">
                    {question.label}
                    {question.mandatory && (
                        <span className="ml-2 text-red-500">*</span>
                    )}
                </h3>
                {question.tooltip && (
                    <p className="text-sm text-gray-500 mt-1">{question.tooltip}</p>
                )}
            </div>

            {/* Rendu de la question selon son type */}
            {renderQuestionByType()}

            {/* Informations supplémentaires */}
            {/* <div className="mt-3 text-xs text-gray-400">
                <span>Position: {question.position}</span>
                {question.coeff !== 1 && (
                    <span className="ml-3">Coefficient: {question.coeff}</span>
                )}
            </div> */}
        </div>
    );
}

export default QuestionDisplayer;
