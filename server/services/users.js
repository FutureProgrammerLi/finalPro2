const jwtUtil = require('../modules/token')
const connection = require('../db/conn')
//登录逻辑
exports.login = function(req,res){       //登录接口
    //生成token,校验数据库,跳转
    // console.log(req.body.username)
//   let _username = req.body.username     //暂时先根据username生成token,(未涉及数据库id)
                                        //密码加密传过来?还是只存加密就行?
//   console.log(username,password)
  //区分密码错误和没有注册
 //有则返回[ RowDataPacket { id: 1, roleid: 2, username: 'zhanghao', password: 'mima' } ]
//   const checksql =`select * from userlist where username='${username}' and password='${password};'`  //存在,返回什么东西?直接在上一条结果校验密码是否正确?返回对象吗?
var {username,password} = req.body
const querysql = `select * from userlist where username='${username}'` //查找是否有该账号,无则返回一个空数组

connection.query(querysql,(err,querydata)=>{
      if(err){
          res.send(err)
      }
      let result = JSON.parse(JSON.stringify(querydata))
         if(result[0].state === 'banned'){
             res.send({status:401,msg:'用户已被禁用,请联系管理员!'})
         } else if(result.length != 0 && result[0].state == 'active'){          
         //登录成功,根据id生成token并返回
            let jwt = new jwtUtil(result[0].id)
            let token = jwt.genToken()
            let resObj = {}
            let statusObj = {"status":200,"msg":"登录成功"}
            Object.assign(resObj,result[0],statusObj)    //信息+状态+token
            resObj.token = token
            res.send(resObj)
      }else{           //找不到对应的的账号
       res.send({"status":422,"msg":"账号不存在!"})
      }
  })

}

//注册功能
exports.signup = function(req,res){
let {username,password,email,phone,identity=2} = req.body
const sql1 = `insert into userlist(roleid , username , password , email , phone  ) values('${identity}' ,'${username}', '${password}' , '${email}' ,'${phone}');`
connection.query(sql1,(err,data)=>{
    if(err){
        res.send(err) //res.send({"status":"403","msg":"登录已过期,请重新登录"})
    }
    res.send(data)
})
}

//检查注册用户名是否已经存在
exports.check = function(req,res){
    // console.log(Object.keys(req.body))    //返回个数组
    let username = Object.keys(req.body)[0]
    const sql = `select count(*) from userlist where username ='${username}'`
    connection.query(sql,(err,data)=>{
        if(err){
            res.sen(err)
        }
        let result = JSON.parse(JSON.stringify(data)) //去除RowDataPacket
        // console.log(result[0]['count(*)'])    //{'count(*)':0}
        let flag = result[0]['count(*)'] 
        if(flag <= 0){
            res.send({"status":201,"msg":"注册成功"})
        }else{
            res.send({"status":422,"msg":"用户名已存在"})
        }
    })
}

//修改信息后更新视图,获取最新的资料
exports.query = function(req,res){
    // console.log(req.query)
    let {username} = req.query
    const sql = `select * from userlist where username='${username}'`
    connection.query(sql,(err,data)=>{
        if(err){
            res.send(err)
        }
        res.send(data)
    })
}

exports.updateRoleList = function(req,res){
    const sql = `update rolelist as A INNER JOIN (select roleid,count(*) as total from userlist group by roleid) as B on A.roleid = B.roleid set A.numbers = B.total;`
    connection.query(sql,(err,data)=>{
        if(err){
            res.send('更新统计数据失败')
        }
        res.send({status:200,msg:'更新数据成功'})
    })
}

exports.changeUserState = function(req,res){
    let {id,op} = req.params
    const sql = `update userlist set state='${op}' where id=${id};`
    connection.query(sql,(err,result)=>{
        if(err){
            throw err
        }
        if(result.affectedRows === 1){
            res.send({status:200,msg:'操作成功!'})
        }else{
            res.send({status:500,msg:'未知错误'})
        }
    })
}

exports.changeIdentity = function(req,res){
    // console.log(req.params)
    let {id,roleid} = req.params
    const sql = `update userlist set roleid = '${roleid}' where id='${id}';`
    connection.query(sql,(err,data)=>{
        if(err){
            throw err
        }
        if(data.affectedRows === 1){
            res.send({status:200,msg:'身份修改成功'})
        }else{
            res.send({status:500,msg:'身份修改失败'})
        }
    })
}
