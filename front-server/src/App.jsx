// import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './components/Home/Home.jsx'
import Questionnaire from './components/Questionnaire/Questionnaire.jsx'
import Login from './components/Login/Login.jsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/questionnaire/:id" element={<Questionnaire />} />
      </Routes>
    </Router>
  )
}

export default App
