const connection = require('../db/conn')
const fs = require('fs')
const path = require('path')

exports.returnList = function(req,res,next){
let {roleid} = req.params
if(roleid < 2){     //判断身份
     const sql1 = `select * from infopath where type='post' and state='todo';`
     const sql2 = `select count(*) as total from infopath where type='post' and state='todo';`
     var sentObj = {}
     sentObj.tableData = []
     connection.query(sql1,(err,data1)=>{ //返回投稿,todo的信息
         if(err){
            throw err
         }
         data1 = JSON.parse(JSON.stringify(data1))
         let regFileName = /([^\\/]+)\.([^\\/]+)/
         for (let i of data1){
            regFileName.test(i.path)
            let date = RegExp.$1.slice(0, 4) + '-' + RegExp.$1.slice(4, 6) + '-' + RegExp.$1.slice(6, 8)
            i.date = date
            sentObj.tableData.push(i)
         }
        //  console.log(sentObj)
     })
     connection.query(sql2,(err,data2)=>{  //统计total,用于pagination
     if(err){
        throw err
     }
     data2 = JSON.parse(JSON.stringify(data2))
     sentObj.total = data2[0].total
    //  console.log(data2)
    // console.log(sentObj)
    res.send(sentObj)
    })
    // res.send(sentObj)     //拿不到data1和data2.作用域问题
    // console.log(sentObj)  
}else{
    res.send({status:403,msg:'没有权限!'})
}
}

exports.returnContent = function(req,res,next){
   // console.log(req.params,req.query,req.body) //params传过来的在req.query
   let getPath = req.query.path   //infopath里面的path
   // console.log(getPath)
   let absPath = path.join(__dirname,`../${getPath}`)
   // console.log(absPath)
   let infoContent = fs.readFileSync(absPath,'utf-8')  //信息内容
   infoContent = JSON.parse(infoContent)
   // console.log(content)
   if(infoContent[0]){       //有上传文件
      const uid =infoContent[0].uid
      const query = `select uploadPath from uploadpath where uid='${uid}'` //获取上传的文件在服务器的路径
      connection.query(query,(err,data)=>{
         if(err){
            res.send({status:500,msg:'数据库操作失败'})
            throw err         
         }
         data = JSON.parse(JSON.stringify(data))
         let relPath = data[0].uploadPath
         let combined = path.join(__dirname,`../${relPath}`)
         let fileContent = fs.readFileSync(combined,'utf-8')
         let contentObj = Object.assign({},infoContent)  
         contentObj.fileContent = fileContent
         res.status(200).send(contentObj)    //信息和文件内容整合在一个对象
      })
   }else{
   res.send(infoContent)  //只有信息内容
   }    
}

exports.changeState = function(req,res,next){
   // console.log(req.params)
   let {id,state} = req.params
   const sql = `update infopath set state='${state}' where id='${id}';`
   connection.query(sql,(err,data)=>{
      if(err){
         throw err
      }
      if(data.affectedRows === 1){
         res.send({status:200,msg:'修改稿件状态成功'})
      }else{
         res.send({status:500,msg:'修改状态失败'})
      }
   })
}

exports.commentsInsert = function(req,res,next){
   // console.log(req.body)
   let {commentator,username,comment,infoid,title} = req.body
   const sql = `insert into commenttable(commentator, username,comment,infoid,title) values('${commentator}' , '${username}', '${comment}' , '${infoid}','${title}');`
   connection.query(sql , (err,data)=>{
      if(err){
         throw err
      }
      if(data.affectedRows === 1){
         res.send({status:200,msg:'评论成功!'})
      }else{
         res.send({status:500,msg:'评论失败!'})
      }
   })
}

exports.returnComment = function(req,res,next){
   // console.log(req.params)
   let {username} =req.params
   // const checkTotal = `select count(*) as total from commenttable where username='${username}';`
   const all = `select * from commenttable where username='${username}';`
   connection.query(all,(err,data)=>{
      if(err){
         throw err
      }
      res.send(data)
   })
   // connection.query()
}

exports.changeMsgState = function(req,res,next){
   // console.log(req.params)
   let {id,type} = req.params
   if(type == 'read'){
    const sql1 = `update commenttable set done='1' where id='${id}';`
    connection.query(sql1,(err,data)=>{
       if(err){
          throw err
       }
       if(data.affectedRows === 1){
          res.send({status:200,msg:'已设置为已读'})
       }else{
          res.send({status:500,msg:'未知错误1'})
       }
    })
   }else if(type == 'delete'){
   const sql2 = `delete from commenttable where id='${id}';`
   connection.query(sql2,(err,data)=>{
      if(err){
         throw err
      }
      if(data.affectedRows === 1){
         res.send({status:200,msg:'已删除信息'})
      }else{
         res.send({status:500,msg:'未知错误2'})
      }
   })
   }
}