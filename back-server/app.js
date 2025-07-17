import express from 'express'
const app = express()
const port = 3008

import { numdiagPool, toHeroPool, connectToDatabase, executeQuery } from './database/client.js'
import { getQuestionnaireById, createQuestionnaire, getAllQuestionnaires, getAllInfosQuestionnaire } from './questionnaire/questionnaire.js'

app.get('/', (req, res) => {
  res.json('Hello World !')
})

app.get('/numdiag', async (req, res) => {
  try {
    await connectToDatabase(numdiagPool)
    const result = await executeQuery(numdiagPool, 'SELECT 1', [])
    res.json(result)
  } catch (error) {
    console.error('Error querying numdiag database:', error)
    res.status(500).send('Error querying numdiag database')
  }
})

app.get('/tohero', async (req, res) => {
  try {
    await connectToDatabase(toHeroPool)
    const result = await executeQuery(toHeroPool, 'SELECT 1')
    res.json(result)
  } catch (error) {
    console.error('Error querying tohero database:', error)
    res.status(500).send('Error querying tohero database')
  }
})

app.get('/questionnaire/:questionnaireId', async (req, res) => {
  const { questionnaireId } = req.params
  try {
    const questionnaire = await getAllInfosQuestionnaire(questionnaireId)
    res.json(questionnaire)
  } catch (error) {
    console.error('Error fetching questionnaire:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.get('/question/:questionId', async (req, res) => {
  const { questionId } = req.params
  try {
    const question = await getAllInfosQuestionnaire(questionId)
    res.json(question)
  } catch (error) {
    console.error('Error fetching question:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})