import QuestionResume from '../Question/questionResume';
import PopUpEditQuestion from '../popups/editQuestion';

import React from 'react';

async function getQuestionofSection(sectionId) {
    try {
        const response = await fetch(`http://localhost:3008/sections/${sectionId}`);
        if (!response.ok) {
            throw new Error('Erreur lors du chargement des questions');
        }
        const data = await response.json();
        return data.questions;
    } catch (error) {
        console.error('Error fetching questions:', error);
        return {};
    }
}

function Section({ sectionId, sectionTitle, sectionContent }) {
  const [questions, setQuestions] = React.useState([]);
  const [popUpEdit, setPopUpEdit] = React.useState({state:false});
  // const [selectedQuestion, setSelectedQuestion] = React.useState();


  React.useEffect(() => {
    async function fetchQuestions() {
      const data = await getQuestionofSection(sectionId);
      setQuestions(data);
    }
    fetchQuestions();
  }, [sectionId]);
    if(popUpEdit.state==false){
    return (
    <div className="section">
      
      <h2>{sectionTitle}</h2>
  
      <div> 
        {Array.isArray(questions) && questions.map(question => (
          <QuestionResume
            key={question.id}
            questionId={question.id}
            questionLabel={question.label}
            onShow = {() =>{setPopUpEdit({
              state:true,selectedQuestion:question.id
            })}}
          />
        ))}
      </div>
      <p>{sectionContent}</p>
    </div>
  );
      }
      else{
        return (
          <div className="edit-question-popup">
            <PopUpEditQuestion
            id = {popUpEdit.selectedQuestion}
            onClose = {() =>{setPopUpEdit({
              state:false
            })}}
            />
                   <h1>
            ICI COMPOSANt POPUP 
            pour cette question :{popUpEdit.selectedQuestion}
          </h1>

                      <button className="red-btn" onClick={() =>setPopUpEdit({state:false})}>
            X
        </button>

            </div>

   
   
          
        )
      }

}


export default Section;