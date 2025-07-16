import { Pool } from 'pg'

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

export { numdiagPool, toHeroPool, connectToDatabase, executeQuery }
