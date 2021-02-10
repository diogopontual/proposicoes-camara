const express = require('express')
const router = express.Router()
const PropositionController = require('./domain/proposition/proposition.controller')
router.get('/proposition', PropositionController.getTheMostRelevant)
module.exports = router
