require('dotenv').config()
const log4js = require('log4js')
log4js.configure('./config/log4js.json')
const CamaraClient = require('./integrations/camara.client')
const logger = require('log4js').getLogger()
;(async () => {
  logger.debug('begining')
  await CamaraClient.askForPropositions(null, null, null, (obj) => {
    // console.log(obj.authors)
  })
  logger.debug('end')
})()
