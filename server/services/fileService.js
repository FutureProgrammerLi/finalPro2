const connection = require('../db/conn')
const fs = require('fs')
const path = require('path')
const formidable = require('formidable')
const sd = require('silly-datetime')
const iconv= require('iconv-lite')
const BufferHelper = require('bufferhelper')

exports.upload = function(req,res,next){
    let {username,uid} = req.headers
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
    form.keepExtensions = true
    form.encoding = 'utf-8'
    form.parse(req,(err,fields,files)=>{
        if(err){
          res.send(err)
        }
        
      // console.log(files)
      //   // 文件操作
      
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
      // let content = fs.readFileSync(path.join(__dirname,`../${relativePath}`))
      // console.log(path.join(__dirname,`../${relativePath}`))
      const sql = `insert into uploadpath(username , uploadPath,uid) values('${username}', '${relativePath}','${uid}')`
        connection.query(sql,(err,data)=>{
          if(err){
            console.log(err)
            res.send({status:400,msg:'上传失败'})
          }
          // console.log(data)
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
let {username,kind,title,draftToPost,id} = req.body
if(draftToPost && id){                 //在草稿箱里面投稿,有id才找,无则创建信息文件,用于区分新建的和已有的草稿
  //将文本信息的kind设置为post
  const sql = `select path from infopath where id='${id}'`
  connection.query(sql,(err,data)=>{
    if(err){
      throw err
    }
    let result = JSON.parse(JSON.stringify(data))[0]
    let content = fs.readFileSync(path.join(__dirname,`../${result.path}`))
    let overwrite = JSON.parse(content)
    overwrite.kind = 'post'
    // console.log(overwrite,typeof overwrite) //object
    fs.writeFileSync(path.join(__dirname,`../${result.path}`),JSON.stringify(overwrite))
  })
  const query = `update infopath set type='post' where id='${id}'` //数据库的type改为post
  connection.query(query,err=>{
    if(err){
      res.send(err)
    }
    res.send({status:201,msg:"投稿成功"})
  })
}else{
  // console.log(`${username}`)
let infoPath = path.join(__dirname,`../uploads`) +`/${username}` + `/info/`
// console.log(infoPath)
// console.log(fs.existsSync(infoPath))
// console.log(infoPath)
if(fs.existsSync(infoPath) == false){
  fs.mkdirSync(`./uploads/${username}/`)         //要一层一层创建,不能直接创建两个目录
  fs.mkdirSync(`./uploads/${username}/info/`)
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
  const sql = `insert into infopath(username,title, path , type) values('${username}','${title}', '${relativePath}' , '${kind}');`
  connection.query(sql,err2=>{if(err2)throw err2})
  res.send({status:201,msg:"信息文件写入成功"})
})  
}  
}

exports.sendFiles = function(req,res,next){
  console.log(req.params)
  let {uid} = req.params
  const search = `select uploadPath from uploadpath where uid='${uid}';`
  connection.query(search,(err,data)=>{
    if(err){
      throw err
    }
    data = JSON.parse(JSON.stringify(data))
    let relPath = data[0].uploadPath
    let absPath = path.join(__dirname,`../${relPath}`)
    console.log(absPath)
    res.sendFile(absPath,{
      headers:{
        "content-type":"blob"
      }
    }
  )
  })
}

exports.avatarUpload = function(req,res,next){      //上传头像
  // console.log(req.body)
  let {blobURL,username} = req.body
  // console.log(blobURL,username)
  const sql = `update userlist set avatar='${blobURL}' where username='${username}';`
  const sql2 = `select * from userlist where username='${username}';`
  connection.query(sql,(err)=>{
    if(err){
      throw err
    }
    connection.query(sql2,(err2,data)=>{
      if(err2){
        throw err2
      }
      res.send(data)
    })
  })
  // console.log(path.join(__dirname,'../uploads/avatar'))
  //   let form = new formidable.IncomingForm();
  //   form.uploadDir = path.join(__dirname,'../uploads/avatar')
  //   form.parse(req,(err,fields,files)=>{
      
  //   })
}

exports.announce = function(req,res,next){
  // console.log(req.body)
  let {title,content,ptime,publisher} = req.body
  const sql = `insert into announcetable(title,content,ptime,publisher) values('${title}','${content}','${ptime}','${publisher}');`
  connection.query(sql,(err,data)=>{
    if(err){
      throw err
    }
    if(data.affectedRows === 1){
      res.send({status:200,msg:'发布成功'})
    }else{
      res.send({status:500,msg:'服务器发生错误'})
    }
  })
}

exports.announceList = function(req,res,next){
  const sql = `select * from announcetable`
  connection.query(sql,(err,data)=>{
    if(err){
      throw err
    }
    data = JSON.parse(JSON.stringify(data))
    res.send(data)
  })
}

exports.withdraw = function(req,res,next){
  let { id } = req.params
  const sql = `update infopath set type='draft' where id='${id}';`
  connection.query(sql,(err,data)=>{
    if(err){
      throw err
    }
    if(data.affectedRows === 1){
      res.send({status:200,msg:'退稿成功'})
    }
  })
  // const delInfo = `delete from infopath where id='${id}'`
  // const getuid = `select path from infopath where id='${id}'`
  // connection.query(getuid,(err,infopath)=>{
  //   if(err){
  //     throw err
  //   }
  //   let absPath = path.join(__dirname,`../${infopath[0].path}`)
  //   let content = JSON.parse(fs.readFileSync(absPath,'GB2312'))
  //   if(content['0']){
  //     let uid = content['0'][uid]
  //     const delFile = `delete from uploadpath where uid='${uid}';`
  //     connection.query(delFile, (err)=>{ //删除uploadpath的记录
  //       if(err){
  //         throw err
  //       }
  //       fs.unlink(absPath,()=>{      
  //         console.log('deleted')
  //       })
  //     })
  //   }
  // })
  // connection.query(delInfo,(err,data)=>{  //删除infopath的记录
  //   if(err){
  //     throw err
  //   }
  //   if(data.affectedRows === 1){
  //     res.send({status:200,msg:'退稿成功'})
  //   }
  // })
}
