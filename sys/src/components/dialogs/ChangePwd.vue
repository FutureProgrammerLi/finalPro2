<template>
<el-dialog title="修改密码" :visible.sync="pwdDialog.value" width="30%">
    <el-form :model="pwdForm" ref="pwdFormRef" label-width="100px" :rules="checkRules">
        <el-form-item label="旧密码" prop="oldPass">
            <el-input type="password" v-model="pwdForm.oldPass"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
            <el-input type="text" v-model="pwdForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPass">
            <el-input type="password" v-model="pwdForm.newPass"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="pwdForm.checkPass"></el-input>
        </el-form-item>
    </el-form>
    <span slot="footer">
        <el-button @click="pwdDialog.value = false">取 消</el-button>
        <el-button type="primary" @click="submitPwdForm('pwdFormRef')">确 定</el-button>
    </span>
</el-dialog>
</template>

<script>
import code from '@/services/encrypt.js'
export default {
    props:{
        pwdDialog:{
            type:Object,
            required:true,
        }
    },
    data() {
        var oldPwdCheck = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入现在的密码'))
            } else {
                let encrypted = code.encryptFunc(value)
                if (encrypted == this.$store.state.userInfo.password) {
                    // console.log(value, this.$store.state.userInfo.password)
                    callback()
                } else {
                    // console.log(encrypted, this.$store.state.userInfo.password)
                    callback(new Error('密码错误'))
                }
            }
        };
        var phoneCheck = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入手机号码'))
            } else {
                const regPhone = /^1[3456789]\d{9}$/
                if (regPhone.test(value)) {
                    callback()
                } else {
                    callback(new Error('请输入正确的手机号码!'))
                }
            }
        };
        var newPwdCheck = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入新密码'))
            } else if (value === this.pwdForm.oldPass) {
                callback(new Error('新密码不能与旧密码一样!'))
            } else {
                let regExp = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{7,13}$/
                if (regExp.test(value)) {
                    callback()
                } else {
                    callback(new Error('密码需为7-13位数字和字母组合!'))
                }
            }
        };
        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.pwdForm.newPass) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return {
            pwdForm: {
                oldPass: '',
                phone: '',
                newPass: '',
                checkPass: ''
            },
            checkRules: {
                oldPass: [{
                    validator: oldPwdCheck,
                    trigger: 'blur'
                }],
                phone: [{
                    validator: phoneCheck,
                    trigger: 'blur'
                }],
                newPass: [{
                    validator: newPwdCheck,
                    trigger: 'blur'
                }],
                checkPass: [{
                    validator: validatePass,
                    trigger: 'blur'
                }]
            },
        }
    },
    methods: {
        submitPwdForm(formNameRef) {
            this.$refs[formNameRef].validate(valid => {
                if (valid) {
                    let encryptedSent = code.encryptFunc(this.pwdForm.newPass)
                    let obj = {
                        "username": this.$store.state.userInfo.username,
                        "password": encryptedSent
                    }
                    this.$http.post('/api/edit/changePwd', obj).then(res => {
                        if (res.data.status === 200) { //修改密码成功
                            this.$store.state.userInfo.password = encryptedSent //覆盖原有密码
                            this.$message.success('修改密码成功')
                            this.pwdDialog.value = false;
                        } else {
                            this.$message.error('修改密码失败')
                        }
                    })
                } else { //有什么方法走这里?
                    this.$message.error('更改密码失败!')
                    return false
                }
            })
        },
    },
}
</script>

<style lang="scss" scoped>

</style>
