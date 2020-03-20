var express = require('express');
var router = express.Router();
const service = require('../services/test')
const connection = require('../db/conn');
connection.connect(()=>{
  console.log("成功连接数据库")
})

/* GET home page. */
router.post('/test', service.test);

router.get('/getList/:roleid',service.returnList)

router.get('/getUploadInfo/:username',service.returnUpload)
module.exports = router;
