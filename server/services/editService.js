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