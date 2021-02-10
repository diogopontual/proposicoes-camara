const PropositionService = require('./proposition.service')

module.exports.getTheMostRelevant = async (req, res) => {
  res.json(await PropositionService.getMostRelevant())
}
