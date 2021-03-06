var express = require('express');
var router = express.Router();
const service = require('../services/info')
const connection = require('../db/conn');
connection.connect(()=>{
  console.log("成功连接数据库")
})

/* GET home page. */
router.post('/test', service.test);

router.get('/getList/:roleid',service.returnList)

router.get('/userlist',service.returnUserList)

router.get('/sessionlist/:username',service.returnSessionList)

router.get('/getUploadInfo/:username',service.returnUpload)

router.get('/getUploadDetails/:username',service.returnDetails)

router.get('/getSelfPosts/:id',service.returnPosts)

router.get('/getAllUsers/:id',service.returnAllUsers)


module.exports = router;
