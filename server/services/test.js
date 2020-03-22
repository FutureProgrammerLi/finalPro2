const connection = require('../db/conn')
function dealWithRoutes(id){

}
exports.test = function(req,res,next){
    res.send('test service')
}

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