var express = require('express');
var router = express.Router();
var draftService = require('../services/draftService')

router.get('/draftlist',draftService.draftList)

router.get('/getContent/:username/:title',draftService.getContent)

router.post('/saveDrafts',draftService.saveDrafts)
module.exports = router