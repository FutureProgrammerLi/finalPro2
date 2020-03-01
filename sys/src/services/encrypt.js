const crypto = require('crypto')
const key = "AA349B710F20CC17"     //MD


function encryptFunc(msg) {
    // if(typeof msg =='object'){
    //     msg = crypto.enc.Utf8.parse(msg);    //转换成字符串 crypto-js才有
    // }
    // let encrypted = crypto.AES.encrypt(msg,key,{
    //     mode:crypto.mode.CBC
    // })
    // return encrypted
    if(typeof msg =='object'){
        msg = JSON.stringify(msg)
    }
    const cipher = crypto.createCipher('aes-256-cbc', key);
    var crypted = cipher.update(msg, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

function decryptFunc(encrypted){
    // let decrypted = crypto.AES.decrypt(encrypted,key)
    // return decrypted
    const decipher = crypto.createDecipher('aes-256-cbc', key);
    var decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
    }

export default{
    encryptFunc,
    decryptFunc
}

