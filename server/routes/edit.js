var express = require('express');
var router = express.Router();
var service = require('../services/editService')

router.post('/changePwd',service.changePwd)

router.post('/changeInfo',service.changeInfo)


module.exports = router;