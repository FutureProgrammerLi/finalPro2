<template>
<div>
    <!-- 信息卡片 -->
    <el-card shadow="hover" style="width:100%;">
        <div slot="header">
            <span>你好,用户{{userInfo.username}}!</span>
        </div>
        <div>
            <i class="el-icon-user"></i>您的账号: {{userInfo.username}}
        </div>
        <div>
            <i class="el-icon-message"></i>您的邮箱: {{userInfo.email?userInfo.email:'NULL'}}
        </div>
        <div>
            <i class="el-icon-phone"></i>手机号码: {{userInfo.phone?userInfo.phone:'NULL'}}
        </div>
        <div>选择您的操作:<el-button type="text" @click="changePwd">修改密码</el-button> | <el-button type="text" style="padding-top:5px;" @click="changeInfo">修改资料</el-button>
        </div>
    </el-card>

    <!-- 投稿信息卡片 -->
    <el-card shadow="hover" style="margin-top:10px;">
        <div slot="header">
            您的投稿情况:
        </div>
        <el-row :gutter="12">
            <el-col :span="6">
                <el-card class="inner total" shadow="hover">
                    总投件数<br>
                    {{uploadInfo.total}}
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover" class="inner passed">
                    通过审核<br>
                    {{uploadInfo.passed}}
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover" class="inner todo">
                    正在审核<br>
                    {{uploadInfo.todo}}
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover" class="inner unpassed">
                    未通过<br>
                    {{uploadInfo.unpassed}}
                </el-card>
            </el-col>
        </el-row>
    </el-card>

    <!-- 修改密码的弹窗 -->
    <el-dialog title="修改密码" :visible.sync="pwdDialog" width="30%">
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
            <el-button @click="pwdDialog = false">取 消</el-button>
            <el-button type="primary" @click="submitPwdForm('pwdFormRef')">确 定</el-button>
        </span>
    </el-dialog>

    <!-- 修改资料的dialog -->
    <el-dialog title="修改个人资料" :visible.sync="infoDialog" width="30%" @close='handleClose'>
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
            <el-button @click="infoDialog = false">取 消</el-button>
            <el-button type="primary" @click="submitInfoForm('infoFormRef')">确 定</el-button>
        </span>
    </el-dialog>

</div>
</template>

<script>
import {
    mapState
} from 'vuex'
import code from '../services/encrypt'
export default {
    name: 'Info',
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
        var checkEmail = (rule, value, callback) => {
            let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
            if (reg.test(value)) {
                callback()
            } else {
                callback(new Error('请输入正确的邮箱地址!'))
            }
        };
        return {
            // userInfo: this.$store.state.userInfo,
            // uploadInfo:this.$store.state.uploadInfo,
            pwdForm: {
                oldPass: '',
                phone: '',
                newPass: '',
                checkPass: ''
            },
            infoForm: {
                username: this.$store.state.userInfo.username,
                email: '',
                phone: ''
            },
            username: this.$store.state.userInfo.username,
            infoDialog: false,
            pwdDialog: false,
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
        test() {
            console.log(this.uploadInfo) //为什么是个数组? dispatch的问题吗?
        },
        changePwd() {
            this.pwdDialog = true;
        },
        changeInfo() {
            this.infoDialog = true;
        },
        submitPwdForm(formNameRef) {
            this.$refs[formNameRef].validate(valid => {
                if (valid) {
                    let encryptedSent = code.encryptFunc(this.pwdForm.newPass)
                    let obj = {
                        "username": this.$store.state.userInfo.username,
                        "password": encryptedSent
                    }
                    this.$http.post('/api/edit/changePwd', obj).then(res => {
                        // console.log(res)
                        if (res.data.status === 200) { //修改密码成功
                            this.$store.state.userInfo.password = encryptedSent //覆盖原有密码
                            this.$message.success('修改密码成功')
                            this.pwdDialog = false;
                        } else {
                            this.$message.error('修改密码失败')
                        }
                    })
                } else { //有什么方法走这里?
                    this.$message.error('更改密码失败!')
                    return false
                }
            })
            // this.pwdDialog = false;
        },
        submitInfoForm(formNameRef) {
            this.$refs[formNameRef].validate(valid => {
                if (valid) {
                    this.$http.post('/api/edit/changeInfo', this.infoForm).then(res => {
                        if (res.data.status === 200) {
                            this.$message.success('修改信息成功')
                            this.$store.dispatch('asyncGetUserInfo', this.username)
                            this.infoDialog = false
                        } else {
                            this.$message.error('修改信息失败')
                        }
                    })
                } else {
                    this.$message.error('修改资料失败')
                    return false
                }
            })
        },
        handleClose() {
            Object.keys(this.infoForm).forEach(key => {
                    if (key != 'username') {
                        this.infoForm[key] = ''
                    }
                }
            );
        }
    },
    computed: {
        ...mapState(['userInfo', 'uploadInfo'])
    },
    created() {
        this.$store.dispatch('asyncGetUpload', this.$store.state.userInfo.username)
    }

}
</script>

<style scoped>
.inner {
    text-align: center;
}

.total:hover {
    background-color: rgb(80, 124, 247);
}

.passed:hover {
    background-color: rgb(151, 240, 151);
}

.todo:hover {
    background-color: rgb(250, 217, 27);
}

.unpassed:hover {
    background-color: rgb(248, 37, 37);
}
</style>
