const fetch = require('node-fetch')
const logger = require('log4js').getLogger('camara.client')
const { format } = require('date-fns')

async function askForPropositions (begin, end, theme, handler) {
  if (!begin) {
    begin = new Date()
    begin.setMonth(begin.getMonth() - 1)
  }
  if (!end) {
    end = new Date()
  }
  if (!theme) {
    theme = process.env.DEFAULT_THEME
  }
  const size = process.env.FETCH_SIZE
  let page = 1
  let received = size
  let total = 0
  try {
    while (received >= size) {
      const data = await fetch(`${process.env.CAMARA_API_BASE_URL}/proposicoes?dataInicio=${format(begin, 'yyyy-MM-dd')}&dataFim=${format(end, 'yyyy-MM-dd')}&codTema=${theme}&pagina=${page}&itens=${size}&ordem=ASC&ordenarPor=id`).then(r => r.json())
      if (handler) {
        for (const obj of data.dados) {
          const details = (await askForURL(obj.uri)).dados
          details.authors = (await askForURL(details.uriAutores)).dados
          handler(details)
        }
      }
      received = data.dados.length
      total += received
      page++
    }
    logger.info(`${total} propositions fetched`)
  } catch (error) {
    console.log(error)
  }
}

async function askForURL (url) {
  let retval = null
  try {
    retval = await fetch(`${url}`).then(r => r.json())
    logger.info(`${url} fetched`)
  } catch (error) {
    console.log(error)
  }
  return retval
}

module.exports = {
  askForPropositions
}
