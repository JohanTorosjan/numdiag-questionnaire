import express from 'express'
const app = express()
const port = 3008

import { numdiagPool, toHeroPool, connectToDatabase } from './database/client.js'

app.get('/', (req, res) => {
  res.json('Hello World !')
})

app.get('/numdiag', async (req, res) => {
  try {
    await connectToDatabase(numdiagPool)
    const result = await numdiagPool.query('SELECT 1')
    res.json(result.rows)
  } catch (error) {
    console.error('Error querying numdiag database:', error)
    res.status(500).send('Error querying numdiag database')
  }
})

app.get('/tohero', async (req, res) => {
  try {
    await connectToDatabase(toHeroPool)
    const result = await toHeroPool.query('SELECT 1')
    res.json(result.rows)
  } catch (error) {
    console.error('Error querying tohero database:', error)
    res.status(500).send('Error querying tohero database')
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})