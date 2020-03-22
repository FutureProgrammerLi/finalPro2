var express = require('express');
var router = express.Router();
var service = require('../services/editService')

router.post('/changePwd',service.changePwd)

module.exports = router;