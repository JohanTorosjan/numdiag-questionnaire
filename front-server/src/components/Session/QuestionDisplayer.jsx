import { useState, useEffect } from "react";

function QuestionDisplayer({ question, onAnswerChange,initialAnswer }) {
    const [selectedMultiple, setSelectedMultiple] = useState(initialAnswer?.reponseIds ||[]);
    const [textValue, setTextValue] = useState(
        initialAnswer?.flatReponse||"");
        const [selectedValue, setSelectedValue] = useState(
        initialAnswer?.reponseIds?.[0] || null
    );
    // Notifier le parent à chaque changement de réponse
    useEffect(() => {
        const answer = {
            questionId: question.id,
            reponseIds: [],
            flatReponse: null
        };

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
                    <div className="space-y-2">
                        {question.reponses.map((reponse) => (
                            <label 
                                key={reponse.id}
                                className="flex items-center p-3 border rounded hover:bg-gray-50 cursor-pointer"
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
                                    <span className="ml-2 text-sm text-gray-500 italic">
                                        ({reponse.tooltip})
                                    </span>
                                )}
                            </label>
                        ))}
                    </div>
                );

            case "choix_multiple":
                return (
                    <div className="space-y-2">
                        {question.reponses.map((reponse) => (
                            <label 
                                key={reponse.id}
                                className="flex items-center p-3 border rounded hover:bg-gray-50 cursor-pointer"
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
                                    <span className="ml-2 text-sm text-gray-500 italic">
                                        ({reponse.tooltip})
                                    </span>
                                )}
                            </label>
                        ))}
                    </div>
                );

            case "entier":
                return (
                    <div>
                        <input
                            type="number"
                            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Entrez un nombre entier"
                            value={textValue}
                            onChange={(e) => setTextValue(e.target.value)}
                        />
                        {question.reponsesTranches.length > 0 && (
                            <div className="mt-2 text-sm text-gray-500">
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
                    <div>
                        <textarea
                            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-32"
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

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
            {/* Label de la question */}
            <div className="mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                    {question.label}
                    {question.mandatory && (
                        <span className="ml-2 text-red-500">*</span>
                    )}
                </h3>
                {question.tooltip && (
                    <p className="text-sm text-gray-500 mt-1">{question.tooltip}</p>
                )}
                {question.theme && (
                    <span className="inline-block mt-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                        {question.theme}
                    </span>
                )}
            </div>

            {/* Rendu de la question selon son type */}
            {renderQuestionByType()}

            {/* Informations supplémentaires */}
            <div className="mt-3 text-xs text-gray-400">
                <span>Position: {question.position}</span>
                {question.coeff !== 1 && (
                    <span className="ml-3">Coefficient: {question.coeff}</span>
                )}
            </div>
        </div>
    );
}

export default QuestionDisplayer;