var express = require('express');
var router = express.Router();
var draftService = require('../services/draftService')

router.get('/draftlist',draftService.draftList)

router.get('/getContent/:username/:id',draftService.getContent)

router.post('/saveDrafts',draftService.saveDrafts)

router.post('/editDrafts',draftService.editDraft)

router.delete('/deleteDrafts/:id',draftService.deleteDrafts)

module.exports = router