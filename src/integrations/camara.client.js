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
      logger.info(`Loading page ${page}`)
      const data = await fetch(`${process.env.CAMARA_API_BASE_URL}/proposicoes?dataInicio=${format(begin, 'yyyy-MM-dd')}&dataFim=${format(end, 'yyyy-MM-dd')}&codTema=${theme}&pagina=${page}&itens=${size}&ordem=ASC&ordenarPor=id`).then(r => r.json())
      if (handler) {
        for (const obj of data.dados) {
          await handler(obj)
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

async function fetchPropositionDetails (uri) {
  const details = (await askForURL(uri)).dados
  const authors = (await askForURL(details.uriAutores)).dados
  details.authors = []
  for (const author of authors) {
    details.authors.push((await askForURL(author.uri)).dados)
  }
  details.procedures = (await askForURL(`${uri}/tramitacoes`)).dados
  return details
}

async function askForURL (url) {
  let retval = null
  try {
    retval = await fetch(`${url}`).then(r => r.json())
    logger.debug(`${url} fetched`)
  } catch (error) {
    console.log(error)
  }
  return retval
}

module.exports = {
  askForPropositions,
  fetchPropositionDetails
}
