var express = require('express');
var router = express.Router();
const fileService = require('../services/fileService')

router.put('/posts',fileService.upload)

router.post('/announce',fileService.announce)

router.get('/announceList',fileService.announceList)

router.put('/fileInfo',fileService.fileInfo)

router.get('/sendFiles/:uid',fileService.sendFiles)

router.put('/avatarUpload',fileService.avatarUpload)

module.exports = router;