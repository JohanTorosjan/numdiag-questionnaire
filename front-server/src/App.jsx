// import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

import Home from './components/Home/Home.jsx'
import Questionnaire from './components/Questionnaire/Questionnaire.jsx'
import Session from './components/Session/Session.jsx'
import QuestionnaireDisplay from './components/Session/QuestionnaireDisplay.jsx'
import ScoreDisplay from './components/Session/ScoreDisplay.jsx'

import { ToastProvider } from './ToastSystem';

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/questionnaire/:id" element={<Questionnaire />} />
          <Route path="/session/:questionnaire_id" element={<Session />} />
          <Route path="/session/questionnaire/:session_id" element={<QuestionnaireDisplay />} />
          <Route path="/session/questionnaire/:session_id/score" element={<ScoreDisplay />} />

        </Routes>
      </Router>
    </ToastProvider>

  )
}

export default App
