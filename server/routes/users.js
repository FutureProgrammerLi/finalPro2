var express = require('express');
var router = express.Router();
const userService = require('../services/users')

/* GET users listing. */
router.post('/login', userService.login);

router.post('/regis',userService.signup)

router.post('/checkIfExist',userService.check)

router.get('/query',userService.query)

module.exports = router;
