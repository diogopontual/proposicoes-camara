require('dotenv').config()
const log4js = require('log4js')
const { PropositionService } = require('./domain/proposition')
log4js.configure('./config/log4js.json')
const CamaraClient = require('./integrations/camara.client')
const logger = require('log4js').getLogger()
;(async () => {
  logger.debug('begining')
  await CamaraClient.askForPropositions(new Date(2019, 1, 1, 0, 0, 0, 0), new Date(2019, 6, 30, 11, 59, 59, 0), null, async (obj) => {
    try {
      await PropositionService.save(obj)
    } catch (error) {
      logger.error(error)
    }
  })
  logger.debug('end')
})()
