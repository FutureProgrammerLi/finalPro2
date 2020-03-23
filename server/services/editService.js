const connection = require('../db/conn')

exports.changePwd = function (req,res){
    // console.log(req.body)
    let {username,password} = req.body
    const sql = `update userlist set password='${password}' where username='${username}'`
    connection.query(sql,(err,data)=>{
     if(err){
         res.send({status:400,msg:'修改密码失败'})
     }
     if(data.affectedRows === 1){  //是依据吗?
         res.send({status:200,msg:'修改密码成功'})
     }
     res.end()
    //  console.log(res.fieldCount)
    })
}

exports.changeInfo = function (req,res){
    let {username , email , phone} = req.body
    const sql =`update userlist set email='${email}' ,phone='${phone}' where username='${username}'`
    connection.query(sql,(err,data)=>{
        if(err){
            // console.log(err)
            res.send(err) //执行语句失败
        }
        // console.log(data)
        if(data.affectedRows === 1){
            res.send({status:200,msg:'修改信息成功!'})
        }else{
            res.send({status:400,msg:'修改信息失败'}) //情况不明
        }
    })
}