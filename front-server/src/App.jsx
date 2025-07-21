import { useState } from 'react'
import './App.css'
// import { editButton, deleteButton } from './components/button/button.jsx'
// import QuestionResume from './components/Question/questionResume.jsx'
import QuestionnaireResume from './components/Questionnaire/questionnaireResume.jsx'
import Section from './components/Section/section.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}
      <div>
        <QuestionnaireResume idQuestionnaire={1} label="Questionnaire 1" />
        <Section sectionId={1} sectionTitle="Section 1" sectionContent="Content for Section 1" />
      </div>
    </>
  )
}

export default App
