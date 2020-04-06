const connection = require('../db/conn')

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