var express = require('express');
var router = express.Router();
var examineService = require('../services/examineService')

router.get('/getExamineList/:roleid',examineService.returnList)

router.get('/getExamineContent',examineService.returnContent)

module.exports = router