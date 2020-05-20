<template>
<el-dialog title="修改个人资料" :visible.sync="infoDialog.value" width="30%" @close='handleClose'>
    <el-form :model="infoForm" ref="infoFormRef" label-width="100px" :rules="infoRules">
        <el-form-item label="您的账号:" prop="username">
            <el-input type="text" v-model="infoForm.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱:" prop="email">
            <el-input type="text" v-model="infoForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码:" prop="phone">
            <el-input type="text" v-model="infoForm.phone"></el-input>
        </el-form-item>
    </el-form>
    <span slot="footer">
        <el-button @click="infoDialog.value = false">取 消</el-button>
        <el-button type="primary" @click="submitInfoForm('infoFormRef')">确 定</el-button>
    </span>
</el-dialog>
</template>

<script>
import {mapState} from 'vuex'
export default {
    props:{
    infoDialog:{
        type:Object,
        required:true
    }
    },
    data() {
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
        var checkEmail = (rule, value, callback) => {
            let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
            if (reg.test(value)) {
                callback()
            } else {
                callback(new Error('请输入正确的邮箱地址!'))
            }
        };
        return {
            username: this.$store.state.userInfo.username,
            infoForm: {
                username: this.$store.state.userInfo.username,
                email: '',
                phone: ''
            },
            infoRules: {
                email: [{
                    validator: checkEmail,
                    trigger: 'blur'
                }],
                phone: [{
                    validator: phoneCheck,
                    trigger: 'blur'
                }]
            }
        }
    },
    methods: {
        handleClose() {
            Object.keys(this.infoForm).forEach(key => {
                if (key != 'username') {
                    this.infoForm[key] = ''
                }
            });
        },
        submitInfoForm(formNameRef) {
            this.$refs[formNameRef].validate(valid => {
                if (valid) {
                    this.$http.post('/api/edit/changeInfo', this.infoForm).then(res => {
                        if (res.data.status === 200) {
                            this.$message.success('修改信息成功')
                            this.$store.dispatch('asyncGetUserInfo', this.username)
                            this.infoDialog.value = false
                        } else {
                            this.$message.error('修改信息失败')
                        }
                    })
                } else {
                    this.$message.error('修改资料失败')
                    return false
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
