const connection = require('../db/conn')
const fs = require('fs')
const path = require('path')
const formidable = require('formidable')
const sd = require('silly-datetime')

exports.upload = function(req,res,next){
    let username = req.headers.username
    let storePath = path.join(__dirname,`../uploads`) +`/${username}`;
    if(!fs.existsSync(storePath)){        //判断是否为首次上传,不是则创建目录
         fs.mkdirSync(storePath)           //创建以用户名为目录的第一级目录
    }
    let worksPath = storePath + '/works/' //创建works目录,表明是上传的稿件,区分于草稿目录
    if(!fs.existsSync(worksPath)){
      fs.mkdirSync(worksPath)
    }
    let form = new formidable.IncomingForm();
    form.uploadDir = worksPath
    form.parse(req,(err,fields,files)=>{
        if(err){
          res.send(err)
        }

        // 文件操作
      let time = sd.format(new Date(),'YYYYMMDDHHmmss')
      let random = parseInt(Math.random() * 89999 +10000)
      let extent = path.extname(files.file.name)
      let newPath = worksPath + time + random + extent
      fs.rename(files.file.path,newPath,(err)=>{
        if(err){
          throw Error('改名失败')
        }
      })
      let relativePath = `/uploads/${username}/works/` + time + random + extent
        const sql = `insert into uploadpath(username , uploadPath) values('${username}', '${relativePath}')`
        connection.query(sql,(err,data)=>{
          if(err){
            console.log(err)
            res.send({status:400,msg:'上传失败'})
          }
          if(data.affectedRows === 1){
            res.send({status:201,msg:'上传成功'})
          }else{
            res.status(500).send('未知错误')
          }
        })
      })
}

exports.fileInfo = function(req,res,next){
  console.log(req.body)
let {username,kind ,title} = req.body
let infoPath = path.join(__dirname,`../uploads`) +`/${username}` + `/info/`
// console.log(infoPath)
if(!fs.existsSync(infoPath)){
  fs.mkdirSync(infoPath)
}

let time = sd.format(new Date(),'YYYYMMDDHHmmss')  //是否可以封装?
let random = parseInt(Math.random() * 89999 +10000)
let fileName = `${time}${random}${kind}.json`
let combined = `${infoPath}/${fileName}`
let relativePath = `/uploads/${username}/info/${fileName}`
let info = JSON.stringify(req.body)
fs.writeFile(combined,info,(err)=>{
  if(err){
    res.send({status:400,msg:"信息文件写入失败"})
  }
  res.send({status:201,msg:"信息文件写入成功"})
})    
const sql = `insert into infopath(username,title, path , type) values('${username}','${title}', '${relativePath}' , '${kind}');`
connection.query(sql,(err,data)=>{       //插入失败了怎么办?
  if(err){
   throw err
  }
})
}

