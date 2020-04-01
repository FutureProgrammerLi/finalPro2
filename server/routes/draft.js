var express = require('express');
var router = express.Router();
var draftService = require('../services/draftService')

router.get('/draftlist',draftService.draftList)

module.exports = router