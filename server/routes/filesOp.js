var express = require('express');
var router = express.Router();
const fileService = require('../services/fileService')

router.put('/posts',fileService.upload)

router.put('/fileInfo',fileService.fileInfo)

router.get('/sendFiles/:uid',fileService.sendFiles)
module.exports = router;