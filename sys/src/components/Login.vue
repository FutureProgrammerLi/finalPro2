<template>
<div>
    <el-form :model="loginForm" status-icon ref="loginFormRef" :rules="loginFormRules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="账号" prop="username">
            <el-input type="text" placeholder="请输入账号" prefix-icon="el-icon-user" v-model="loginForm.username" auto-complete="off" @keydown.enter.native="login"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" ref="passRef">
            <el-input type="password"  placeholder="请输入密码" prefix-icon="el-icon-lock" v-model="loginForm.password" auto-complete="off" @keydown.enter.native="login"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button @click="login">Login</el-button>
        </el-form-item>
    </el-form>

</div>
</template>

<script>
import code from '../services/encrypt.js'
export default {
    name: "Login",
    data() {
        var userCheck = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入账号!'))
            } else {
                callback()
            }
        }
        var passCheck = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码!'))
            } else {
                callback()
            }
        }
        return {
            loginForm: {
                username: '',  
                password: ''   
            },
            loginFormRules: { //避免输入框开头有*
                username: [{
                    validator: userCheck,
                    trigger: 'blur'
                }],
                password: [{
                    validator: passCheck,
                    trigger: 'blur'
                }]
            }
        }
    },
    methods: {
        login() {
            // this.$store.dispatch('asyncGetUserInfo',this.loginForm)
            this.$refs.loginFormRef.validate(valid => {
                if (valid) {
                    this.$http.post('/api/users/login', this.loginForm).then(res => {
                        //200登录成功,406密码错误,422账号不存在
                        // let input = code.encryptFunc(this.loginForm.password)
                        if (res.data.status === 422) {
                            this.$message.error('账号不存在!')
                            // console.log(this.$store.state.userInfo)
                        } else if (res.data.status === 401){
                            this.$message.error('账号已被禁用,请联系管理员!')
                        }else {   
                            if (code.decryptFunc(res.data.password) == this.loginForm.password) {
                                // console.log(res.data)
                                this.$message.success('登录成功!')
                                this.$store.commit('getUserInfo', res.data)
                                this.$store.dispatch('asyncGetUploadInfo',res.data.username)
                                window.sessionStorage.setItem('token', res.data.token) //存储token到sessionStorage里面
                                window.sessionStorage.setItem('roleid',res.data.roleid)
                                // console.log(this.$store.state.userInfo)
                                this.$router.push('/info')
                            } else {
                                this.$message.error('密码错误,请重新输入!') //清空吗? validator好还是按登录才验证好?
                                // console.log(this.$store.state.userInfo)
                                this.$refs['passRef'].resetField()
                            }
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
    /* margin: 2.5rem 0 0; */
    /*height: 3rem; */
    border-radius: 3rem;
    background: linear-gradient(90deg, rgb(91, 220, 243), rgb(145, 245, 240));
    /* 181.154.254    245.189.253 */
    box-shadow: 0 0 8px rgb(140, 224, 230);
    cursor: pointer;
    color: white;
}

/deep/ .el-form-item__label{
    color:white;
}

</style>
