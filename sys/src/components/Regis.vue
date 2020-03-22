<template>
<div>
    <el-form :model="regisForm" ref="regisFormRef" :rules="checkRules" label-width="100px" class="demo-ruleForm">
        <!-- -->
        <el-form-item label="账号:" prop="username">
            <el-input type="text" v-model="regisForm.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码:" prop="password">
            <el-input type="password" v-model="regisForm.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码:" prop="ensure">
            <el-input type="password" v-model="regisForm.ensure" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱:" prop="email">
            <el-input type="text" v-model="regisForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码:" prop="phone">
            <el-input type="text" v-model="regisForm.phone"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button @click="signup">Signup</el-button>
        </el-form-item>
    </el-form>
</div>
</template>

<script>
import code from '../services/encrypt.js'

export default {
    name: "Regis",
    data() {
        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
                if (this.regisForm.ensure !== '') {
                    this.$refs.regisFormRef.validateField('ensure');
                }
                callback();
            }
        };
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.regisForm.password) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        var checkIfExist = (rule, value, callback) => {
            this.$http.post('/api/users/checkIfExist', value).then(res => {
                if (res.data.status === 201) { //有必要吗?
                    callback()
                } else if (res.data.status === 422) {
                    callback(new Error('账号已存在!'))
                }
            })
        };
        var checkEmail = (rule, value, callback) => {
            let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
            if (reg.test(value)) {
                callback()
            } else {
                callback(new Error('请输入正确的邮箱地址!'))
            }
        };
        var checkPhone = (rule,value,callback)=>{
            if( value === ''){
                callback(new Error('请输入手机号码'))
            }else{
                const regPhone = /^1[3456789]\d{9}$/
                if(regPhone.test(value)){
                    callback()
                }else{
                    callback(new Error('请输入正确的手机号码!'))
                }
            }
        }

        return {
            regisForm: {
                username: '',
                password: '',
                ensure: '', //表格校验时用
                email: '',
                phone:''
            },
            checkRules: {
                username: [{
                        required: true,
                        message: '请输入账号',
                        trigger: 'blur'
                    },
                    {
                        validator: checkIfExist,
                        trigger: 'blur'
                    }
                ],
                password: [

                    {
                        validator: validatePass,
                        trigger: 'blur'
                    }
                ],
                ensure: [

                    {
                        validator: validatePass2,
                        trigger: 'blur'
                    }
                ],
                email: [{
                        required: true,
                        message: '请输入邮箱地址',
                        trigger: 'blur'
                    },
                    {
                        validator: checkEmail,
                        trigger: 'blur'
                    }
                ],
                phone:[{
                    validator:checkPhone,
                    trigger:'blur'
                }]
            }
        }
    },
    methods: {
        signup() {
            // console.log(this.regisForm.password)
            // console.log(encrypted)
            // let decrypted = code.decryptFunc(encrypted)
            // console.log(decrypted)
            // this.regisForm.password = encrypted //怪怪的
            this.$refs.regisFormRef.validate((valid) => {
                if (valid) {
                    let encrypted = code.encryptFunc(this.regisForm.password)
                    this.$http.post('/api/users/regis', {
                        "username": this.regisForm.username,
                        "password": encrypted,
                        "email": this.regisForm.email,
                        "phone": this.regisForm.phone
                    }).then(res => {
                        // console.log(res)
                        if (res.data.affectedRows === 1) { //判断依据好吗?
                            this.$message.success('注册成功')
                            this.$emit('toggleChild')
                            //怎么改变isActive?
                        } else { //前端校验了数据后有什么原因注册失败?
                            this.$message.error('注册失败')
                        }
                    })
                }
            })

        }
    }
}
</script>

<style scoped>
.el-form .el-button {
    display: inline;
    border: none;
    outline: none;
    margin: 2.5rem 0 0;
    /*height: 3rem; */
    border-radius: 3rem;
    background: linear-gradient(90deg, rgb(91, 220, 243), rgb(145, 245, 240));
    /* 181.154.254    245.189.253 */
    box-shadow: 0 0 8px rgb(140, 224, 230);
    cursor: pointer;
    color: white;
}

.el-input__inner {
    border: 2px solid rgb(91, 220, 243);
    border-radius: 0px;
}

/deep/.el-form-item__label {
    color: white;
}

/* .el-input{
    margin:1rem 0;
    position: relative;
}
.el-input{
    content:'text';
    position: absolute;
    left:0;
    top:-20%;
    font-size: 1.4rem;
    color:aqua;
    transition: .3s;
}
.el-form-item::after{
    top:-70%;
    font-size: 1rem;
} */
</style>
