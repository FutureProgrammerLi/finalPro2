<template>
<div>

    <el-form :model="loginForm" status-icon ref="loginFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="账号" prop="username">
            <el-input type="text" v-model="loginForm.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="loginForm.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button @click="login">Login</el-button>
            <el-button @click="verify">Verify</el-button>
        </el-form-item>
    </el-form>

</div>
</template>

<script>
import code from '../services/encrypt.js'
export default {
    name: "Login",
    data() {
        return {
            loginForm: {
                username: '',
                password: ''
            }
        }
    },
    methods: {
        login() {
            this.$http.post('/api/users/login', this.loginForm).then(res => {
                //200登录成功,406密码错误,422账号不存在
                // let input = code.encryptFunc(this.loginForm.password)
                if (res.data.status === 422) {
                    this.$message.error('账号不存在!')
                } else {
                    if (code.decryptFunc(res.data.password) == this.loginForm.password) {
                        this.$message.success('登录成功!')
                        window.sessionStorage.setItem('token', res.data.token) //存储token到sessionStorage里面
                    } else {
                        this.$message.error('密码错误,请重新输入!') //清空吗? validator好还是按登录才验证好?
                    }
                }

                // if(res.data.status === 406){
                //     
                // }
                // if (res.data.status === 200) {

                // }

            })
        },
        verify() {
            this.$http.post('/api/test').then(res => {
                console.log(res)
            })
        }
    }
}
</script>

<style scoped>
/* body {
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}

.el-form {
    position:absolute;
    top:50%;
    right:50%;
    transform: translate(-50%,-50%);
    width: 30%;
    margin: 3rem 0 0;
} */

/* .panel {
    width: 30%;
    margin: 10rem 0 0;
    position: absolute;
    right: 0;
    top: 0;
    display: flex;
    justify-content: center;
} */

.el-form .el-button {
    display: inline;
    border: none;
    outline: none;
    margin: 2.5rem 0 0;
    /* width: 50%;
    height: 3rem; */
    border-radius: 3rem;
    background: linear-gradient(90deg, rgb(91, 220, 243), rgb(145, 245, 240));
    /* 181.154.254    245.189.253 */
    box-shadow: 0 0 8px rgb(140, 224, 230);
    cursor: pointer;
    color: white;
}
</style>
