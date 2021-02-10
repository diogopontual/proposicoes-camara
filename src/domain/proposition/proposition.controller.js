const { NOT_IMPLEMENTED } = require('http-status')
const PropositionService = require('./proposition.service')

module.exports.getMostRelevant = async (req, res) => {
  if (req.query.filterType === 'MOST_RELEVANT') {
    res.json(await PropositionService.getMostRelevant(req.query.limit || process.env.DEFAULT_LIMIT))
  } else {
    res.status(NOT_IMPLEMENTED).end()
  }
}

module.exports.get = async (req, res) => {
  res.json(await PropositionService.get(req.params.id))
}
