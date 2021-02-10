require('dotenv').config()
const log4js = require('log4js')
const { PropositionService } = require('../domain/proposition')
log4js.configure('./config/log4js.json')

PropositionService.all().then(async ps => {
  for (const p of ps) {
    const tags = []
    if (!p.keywords) { continue }
    const k = p.keywords.toLowerCase()
    if (k.indexOf('ambiental') >= 0 || k.indexOf('ambientais') >= 0) {
      tags.push(11)
    }
    if (k.indexOf('maioridade') >= 0) {
      tags.push(3)
    }
    if (k.indexOf('sexual') >= 0) {
      tags.push(7)
    }
    if (k.indexOf('criminaliza') >= 0 || k.indexOf('aumenta') >= 0 || k.indexOf('aumento') >= 0 || k.indexOf('tipicidade') >= 0) {
      tags.push(1)
    }
    if (k.indexOf('hediondo') >= 0) {
      tags.push(8)
    }
    if (tags.length > 0) {
      await PropositionService.addTags(p.id, tags, false)
    }
  }
})
