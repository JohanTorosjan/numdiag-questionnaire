// import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

import Home from './components/Home/Home.jsx'
import Questionnaire from './components/Questionnaire/Questionnaire.jsx'
import { ToastProvider } from './ToastSystem';

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/questionnaire/:id" element={<Questionnaire />} />
        </Routes>
      </Router>
    </ToastProvider>

  )
}

export default App
