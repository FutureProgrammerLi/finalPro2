const connection = require('../db/conn')
const fs = require('fs')
const path = require('path')
exports.test = function(req,res,next){
    res.send('test service')
}

//返回左侧列表
exports.returnList = (req,res,next)=>{
    let roleid = req.params.roleid
    const sql = `select * from leftlist where permission>=${roleid};`
    function treeMenu(data){
        var parent = []
        for (let val of data){ //一级目录
            if(!val['parentID']){
                parent.push(val)//shift?
            }
        }
        // console.log(parent)
            // if(val['parentID'] == id){
            //     val['level'] = level+1 ;
            //     son.push(val)
            //     treeMenu(data,val['id'],level+1)
            // }   
            parent.forEach(item=>{
                item.children = []
                for(let child of data){
                    if(item.id == child.parentID){ //找到二级目录
                        // console.log(child)
                        item.children.push(child)
                    }
                }
                
        })   
        // console.log(parent)
        //输入parent.id,返回其对应子目录
        return parent
    }
    //传对应的id进去
    connection.query(sql,(err,data)=>{
        if(err){
            res.send(err)
        }
        data = JSON.parse(JSON.stringify(data))
        // console.log(data)
        res.send(data)
        // res.send(treeMenu(data))
    })
        // let parent = []  //所有的一级目录
        // for(let i = 0;i<data.length;i++){
        //     if(!data[i].parentID){
        //         parent.push(data[i])
        //     }
        // }
        
        // parent.forEach(item=>{  //判断children的parentID是否跟parent.id相同
        //     item.children = []
        //     item.children.push(treeMenu(data,item.id))
        // })
        // console.log(treeMenu(data,2))
        // console.log(parent) //问题,每个1级都有4个二级??
        // res.send(parent)
}

exports.returnUpload = (req,res,next)=>{
    // console.log(req.params)
    let {username} = req.params
    // console.log(username)
    const sql = `select * from uploadinfo where username='${username}';`
    connection.query(sql,(err,data)=>{
        if(err){
            res.send(err)
        }
        data = JSON.parse(JSON.stringify(data))
        res.send(data)
    })
}

exports.returnDetails = (req,res,next)=>{
// console.log(req.params)
let {username} =req.params
const sql = `select * from infopath where username='${username}' and type='post' order by state;`
connection.query(sql,(err,data)=>{
    if(err){
        throw err
    }
    let sentData = []
    let regFileName = /([^\\/]+)\.([^\\/]+)/
    for(let i of data){
        let obj = {}
        obj.id = i.id;
        obj.title = i.title;
        obj.state = i.state;
        regFileName.test(i.path)
        let date = RegExp.$1.slice(0, 4) + '-' + RegExp.$1.slice(4, 6) + '-' + RegExp.$1.slice(6, 8)
        obj.date = date
        sentData.push(obj)
    }
    res.send(sentData)
})
}

exports.returnUserList = (req,res,next)=>{
   const sql = `select id,username,avatar from userlist`
   connection.query(sql,(err,data)=>{
       if(err){
           throw err
       }
       res.send(data)
   })
}

exports.returnSessionList = (req,res,next)=>{
    console.log(req.params)
    let {username} = req.params
    const sql = `select from_user,content,senttime,state from msgtable where to_user='${username}';`
    connection.query(sql,(err,msgs)=>{
        if(err){
            throw err
        }
        res.send(msgs)
    })
}

exports.returnPosts = (req,res,next)=>{
    // console.log(req.params)
    let {id} = req.params
    const sql = `select path from infopath where id='${id}';`
    connection.query(sql,(err,data)=>{
        if(err){
            throw err
        }
        let relPath = data[0].path
        let fileContent = fs.readFileSync(path.join(__dirname,`../${relPath}`),'utf-8')
        fileContent = JSON.parse(fileContent)
        let {title,summary,summaryInEnglish,content} = fileContent
        let retObj = {title,summary,summaryInEnglish,content}
        res.send(retObj)
    })
}

exports.returnAllUsers = (req,res,next)=>{
    console.log(req.params)
    let {id} = req.params
    if(Number(id) === 0){
        const sql = `select * from userlist;`
        connection.query(sql,(err,data)=>{
            if(err){
                throw err
            }
            res.send(data.slice(1))
        })
    }else{
        res.send({status:403,msg:'权限不足!'})
    }
}

    // const sql1 = `select id,username,avatar,content,senttime,state from userlist as A inner join (select to_user,content,senttime,state from msgtable) as B on A.username = B.to_user;`
    // //找到id,username,avatar,content,senttime和state
    // // const sql1 = `select id,username,avatar from userlist`
    // connection.query(sql1,(err,userlist)=>{
    //     if(err){
    //         throw err
    //     }
        // userlist = JSON.parse(JSON.stringify(userlist))
        // userlist.forEach(i=>{     //效率低,限定了username
        //     i.message = []
        //     const sql2 = `select content,senttime,state from msgtable where to_user='${i.username}';`
        //     connection.query(sql2,(err,msgs)=>{
        //         if(err){
        //             throw err
        //         }
        //         msgs = JSON.parse(JSON.stringify(msgs))
        //         if(msgs){
        //             i.message.push(msgs[0])
        //         }
        //         console.log(i,'1')
        //         // console.log(subArr)
        //     })
        // })//可能会拿不到msgs?确实
        // console.log(userlist)
    //     res.send(userlist)
    //     // console.log(subArr)
    // })

