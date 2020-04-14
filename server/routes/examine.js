var express = require('express');
var router = express.Router();
var examineService = require('../services/examineService')

router.get('/getExamineList/:roleid',examineService.returnList)

router.get('/getExamineContent',examineService.returnContent)

router.get('/changeState/:id/:state',examineService.changeState)

router.get('/getComment/:username',examineService.returnComment)

router.get('/changeMsgState/:id/:type',examineService.changeMsgState)

router.post('/commentsInsert',examineService.commentsInsert)

module.exports = router