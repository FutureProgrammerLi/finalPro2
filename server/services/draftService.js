const connection = require('../db/conn')
const fs = require('fs')
const path = require('path')

exports.draftList = function(req,res,next){
    // console.log(req.query)
    let {username} = req.query
    const sql = `select * from infopath where username='${username}' and type='draft';`
    connection.query(sql,(err,data)=>{
        if(err){
            throw err
        }
        let rebuildArr = []     //获取的是username,title,path,type 重组成title,time
        let regFileName = /([^\\/]+)\.([^\\/]+)/
        data.forEach(i =>{
            let obj = {}
            obj.title = i.title
            regFileName.test(i.path)
            let date = RegExp.$1.slice(0,4) + '-' + RegExp.$1.slice(4,6) + '-' + RegExp.$1.slice(6,8)
            obj.date = date
            rebuildArr.push(obj)
            // let absolutePath = path.join(__dirname,`../${i.path}`)
            // console.log(absolutePath)
            // var content = fs.readFileSync(absolutePath,'utf-8')
            // console.log(content)
        })
        res.send(rebuildArr)
    })
}