require('dotenv').config()
const log4js = require('log4js')
const { PropositionService } = require('../src/domain/proposition')
const CamaraClient = require('../src/integrations/camara.client')
log4js.configure('./config/log4js.json')

PropositionService.getMostRelevant(3000).then(async ps => {
  for (const p of ps) {
    const data = await CamaraClient.askForURL(`${process.env.CAMARA_API_BASE_URL}/proposicoes/${p.id}`)
    try {
      await PropositionService.update({ keywords: data.dados.keywords.replace(/'/g, "''") }, p.id)
    } catch (error) {
      console.log(`error: ${`${process.env.CAMARA_API_BASE_URL}/proposicoes/${p.id}`}`)
    }
  }
})
