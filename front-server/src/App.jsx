// import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

import Home from './components/Home/Home.jsx'
import Questionnaire from './components/Questionnaire/Questionnaire.jsx'
import Session from './components/Session/Session.jsx'
import { ToastProvider } from './ToastSystem';

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/questionnaire/:id" element={<Questionnaire />} />
          <Route path="/session/:questionnaire_id" element={<Session />} />
        </Routes>
      </Router>
    </ToastProvider>

  )
}

export default App
