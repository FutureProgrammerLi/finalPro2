const connection = require('../db/conn')
const fs = require('fs')
const path = require('path')
const sd = require('silly-datetime')

exports.draftList = function (req, res, next) {
    // console.log(req.query)
    let {
        username
    } = req.query
    const sql = `select * from infopath where username='${username}' and type='draft';`
    connection.query(sql, (err, data) => {
        if (err) {
            throw err
        }
        let rebuildArr = [] //获取的是username,title,path,type 重组成title,time
        let regFileName = /([^\\/]+)\.([^\\/]+)/
        data.forEach(i => {
            let obj = {}
            obj.id = i.id
            obj.title = i.title
            regFileName.test(i.path)
            let date = RegExp.$1.slice(0, 4) + '-' + RegExp.$1.slice(4, 6) + '-' + RegExp.$1.slice(6, 8)
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

exports.getContent = function (req, res, next) {
    console.log(req.params)
    let {
        id,
        username
    } = req.params
    if(!id){
        
    }else{
    const sql = `select path from infopath where username='${username}' and type='draft' and id='${id}'`
    connection.query(sql, (err,data) => {
        if (err) {
            throw err
        }
        // console.log(data[0].path,typeof data)  //获得相对路径
        let absolutePath = path.join(__dirname, `../${data[0].path}`) //拼成绝对路径
        let content = fs.readFileSync(absolutePath, 'utf-8')
        res.send(content)
    })
}
}

//并没用到,莫名奇妙的接口
exports.saveDrafts = function (req, res, next) {
    // console.log(req.body)

    let {
        id
    } = req.body
    const sql = `select * from infopath where id='${id}'`
    connection.query(sql, (err, data) => {
        if (err) {
            throw err
        }
        //     // console.log(data[0])

        //替换文件内容
        let absolutePath = path.join(__dirname, `../${data[0].path}`)
        let content = JSON.parse(fs.readFileSync(absolutePath, 'utf-8'))
        // console.log(content)
        let result = JSON.stringify(Object.assign(content, req.body))
        fs.writeFileSync(absolutePath, result)
        //  console.log(fs.readFileSync(absolutePath,'utf-8'))

        //替换文件名称
        let regFileName = /([^\\/]+)\.([^\\/]+)/
        regFileName.test(data[0].path)
        let fileName = RegExp.$1
        let oldPath = path.join(__dirname, `../${data[0].path}`)
        let time = sd.format(new Date(), 'YYYYMMDDHHmmss')
        // console.log(fileName, time.length, time)
        fileName = fileName.replace(/^\d{14}/, time)
        let index = data[0].path.lastIndexOf('\/')
        let str = data[0].path.substring(0, index + 1)
        let updatedRelativePath = `${str}${fileName}.json`

        let updatedAbsolutePath = path.join(__dirname, `../${updatedRelativePath}`)
        // console.log(oldPath)
        // console.log(updatedAbsolutePath)
        fs.renameSync(oldPath, updatedAbsolutePath)
        const sql2 = `update infopath set path='${updatedRelativePath}' where id='${id}'`
        connection.query(sql2,(err,data2)=>{
            if(err){
                throw err
            }
            if(data2.affectedRows === 1){
                res.send({status:201,msg:"保存成功"})
            }else{
                res.send({status:400,msg:"保存失败"})
            }
        })
    })
}

exports.deleteDrafts = function(req,res,next){
    // console.log(req.params)
    let {id} = req.params
    
    //用id取路径,删除储存信息的文件
    const sql1 = `select path from infopath where id='${id}'`
    connection.query(sql1,(err1,data1)=>{
        if(err1){
            throw err1
        }
        data1 = JSON.parse(JSON.stringify(data1))
        let relPath = data1[0].path
        let absoPath = path.join(__dirname,`../${relPath}`)
        console.log(absoPath)
        fs.unlink(absoPath,err=>{
            if(err){
                res.send({status:500,msg:"删除相关文件操作失败"})
            }
        })
    })
    //删除这个id的记录
    const sql2 = `delete from infopath where id='${id}'`
    connection.query(sql2,(err,data)=>{
        if(err){
            throw err
        }
        console.log(data,typeof data)
        if(data.affectedRows === 1){
            res.send({status:200,msg:'删除成功'})
        }else{
            res.send({status:500,msg:"删除对应记录失败"})
        }
    })
}