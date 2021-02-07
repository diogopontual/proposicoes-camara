const { Pool } = require('pg')
const logger = require('log4js').getLogger('camara.client')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

pool.on('connect', () => {
  logger.info('Base de Dados conectada com sucesso!')
})

module.exports = {
  query: (text, params) => pool.query(text, params)
}
