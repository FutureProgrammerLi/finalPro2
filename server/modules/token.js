const path = require('path')
const fs = require('fs')
const jwt = require('jsonwebtoken')

class Jwt {
 constructor(payload){
     this.payload = payload
 }
 genToken(){      //sign(payload,secretOrPrivateKey,[options,callback])
     let payload = this.payload
     let createdTime = Math.floor(Date.now()/1000)
     let certificate = fs.readFileSync(path.join(__dirname,'../key/private.key')) //私钥
     let token = jwt.sign({
         payload,
         exp: createdTime + 60 *30   //token有效时间 
     },certificate,{
         algorithm:'RS256'
     })
     return token
 }
 verifyToken(){
     let token = this.payload
     let certificate = fs.readFileSync(path.join(__dirname,'../key/public.key')) //公钥
     let res
     try {
         let result = jwt.verify(token,certificate,{algorithms:['RS256']})   //algorithms区别于签发时的algorithm,没s
         let {exp = 0} = result    //result返回的对象里面有exp属性,判定是否过期,生成时exp属性的作用
         let current = Math.floor(Date.now() / 1000)
         if(current <= exp){
             res = result.data
         }
     } catch (e) {
         res = 'err' 
     }
     return res
 }
}

module.exports = Jwt;
