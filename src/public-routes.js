const express = require('express')
const router = express.Router()
const PropositionController = require('./domain/proposition/proposition.controller')
router.get('/propositions/:id', PropositionController.get)
router.get('/propositions', PropositionController.getMostRelevant)
module.exports = router
