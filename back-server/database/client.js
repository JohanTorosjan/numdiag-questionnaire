import { Pool } from 'pg'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const numdiagPool = new Pool({
  user: 'postgres',
  host: 'numdiagcmsdb',
  database: 'numdiagcmsdb',
  password: 'admin',
  port: 5432,
})

const toHeroPool = new Pool({
    user: 'postgres',
    host: 'toherodb-cms-container',
    database: 'toherocmsdb',
    password: 'admin',
    port: 5432,
})

const connectToDatabase = async (pool) => {
    try {
        await pool.connect()
        console.log('Connected to the database')
    } catch (error) {
        console.error('Error connecting to the database:', error)
    }
}

function executeQuery(pool, query, params = []) {
    return pool.query(query, params)
        .then(res => res.rows)
        .catch(err => {
            console.error('Error executing query:', err)
            throw err
        })
}

function initNumdiagDatabase() {
    connectToDatabase(numdiagPool)
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    const sqlFilePath = path.resolve(__dirname, './cms-database.sql')
    const sql = fs.readFileSync(sqlFilePath, 'utf8')

    numdiagPool.query(sql)
        .then(() => console.log('SQL file executed successfully'))
        .catch(err => console.error('Error executing SQL file:', err))
}

function populateNumdiagDatabase() {
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    const sqlFilePath = path.resolve(__dirname, './cms-database-dataset.sql')
    const sql = fs.readFileSync(sqlFilePath, 'utf8')

    return numdiagPool.query(sql)
        .then(() => console.log('Database populated successfully'))
        .catch(err => console.error('Error populating database:', err))
}

export { numdiagPool, toHeroPool, connectToDatabase, executeQuery, initNumdiagDatabase, populateNumdiagDatabase }