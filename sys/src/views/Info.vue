<template>
<div id="top" style="height:100%;overflow:auto;">
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
        <div>选择您的操作:
            <el-button type="text" @click="changePwd">修改密码</el-button>|<el-button type="text" style="padding-top:5px;" @click="changeInfo">修改资料 </el-button>|
            <el-upload style="display:inline;" action="/api/filesOp/avatarUpload" accept="image/*" :show-file-list="false" :limit="1" :on-change="sizeCheck" :http-request="overwriteUpload">
                <el-button type="text">上传头像</el-button>
            </el-upload>
        </div>
    </el-card>

    <!-- 投稿信息卡片 -->
    <el-card shadow="hover" style="margin-top:10px;">
        <div slot="header">
            您的投稿情况:
        </div>
        <!-- <el-button @click="test">test</el-button> -->
        <el-row :gutter="12">
            <el-col :span="6">
                <el-card class="inner total" shadow="hover">
                    总投件数<br>
                    {{postNum}}
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover" class="inner passed">
                    通过审核<br>
                    {{passNum}}
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover" class="inner todo">
                    正在审核<br>
                    {{todoNum}}
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover" class="inner unpassed">
                    未通过<br>
                    {{unpassNum}}
                </el-card>
            </el-col>
        </el-row>
    </el-card>

    <!-- 投稿详情卡片 -->
    <el-card shadow="hover" style="margin-top:10px;" class="postinfo">
        <div slot="header">
            投稿详情:
        </div>
        <el-table :data="postList" stripe border style="width: 100%;overflow:hidden;" height="250">
            <el-table-column prop="title" label="稿件标题" width="300">
            </el-table-column>
            <el-table-column prop="date" label="上传日期" align="center">
            </el-table-column>
            <el-table-column prop="state" label="状态" align="center">
                <template slot-scope="scope">
                    <el-tag type="success" v-if="scope.row.state == 'passed'">通过审核</el-tag>
                    <el-tag type="warning" v-if="scope.row.state == 'todo'">正在审核</el-tag>
                    <el-tag type="danger" v-if="scope.row.state == 'unpassed'">审核未通过</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="right">
                <template slot-scope="scope">
                    <el-button type="primary" @click="show(scope.row)">查看</el-button>
                    <el-button v-if="scope.row.state == 'todo'" type="danger" @click="withdraw(scope.row.id)">退稿</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-card>

    <!-- 公告卡片 -->
    <el-card class="announce-card">
        <el-table :data="announceList" stripe border style="width: 100%;overflow:hidden;" height="250">
            <el-table-column prop="title" label="公告标题" width="300">
            </el-table-column>
            <el-table-column prop="ptime" label="发布日期" align="center">
            </el-table-column>
            <el-table-column prop="publisher" label="发布者" align="center">
            </el-table-column>
            <el-table-column label="操作" align="right">
                <template slot-scope="scope">
                    <el-button type="primary" @click="read(scope.row)">查看</el-button>
                </template>
            </el-table-column>
        </el-table>
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

    <el-dialog :visible.sync="postDialog" width="40%" title="投稿信息">
        <el-form :model="postInfo" label-width="80px" id="postInfoForm">
            <el-form-item label="标题:">
                <el-input v-model="postInfo.title" readonly></el-input>
            </el-form-item>
            <el-form-item label="摘要:">
                <el-input readonly v-model="postInfo.summary"></el-input>
            </el-form-item>
            <el-form-item label="英文摘要:">
                <el-input readonly v-model="postInfo.summaryInEnglish"></el-input>
            </el-form-item>
            <el-form-item label="正文:">
                <el-input readonly type="textarea" :row="8" v-model="postInfo.content"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="postDialog = false">返 回</el-button>
        </span>
        <!-- <el-form :model="postInfo" label-width="80px;" >
        <el-form-item label="标题">
          <el-input :model="postInfo.title">{{postInfo.title}}</el-input>
        </el-form-item>

    </el-form> -->
    </el-dialog>
</div>
</template>

<script>
import {
    mapState,
    mapGetters
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
            fileList: [],
            fileReader: '',
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
            postInfo: {},
            username: this.$store.state.userInfo.username,
            infoDialog: false,
            pwdDialog: false,
            postDialog: false,
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
            console.log(this.announceList) //为什么是个数组? dispatch的问题吗?
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
            });
        },
        sizeCheck(file, fileList) {
            let satisfied = file.size < 2 * 1024 * 1024 ? true : false
            if (!satisfied) {
                this.$message.warning('上传图片不能大于2MB')
                this.fileList = []
            }
        },
        base64ToBlob(urlData, type) {
            let arr = urlData.split(',');
            let mime = arr[0].match(/:(.*?);/)[1] || type;
            // 去掉url的头，并转化为byte
            let bytes = window.atob(arr[1]);
            // 处理异常,将ascii码小于0的转换为大于0
            let ab = new ArrayBuffer(bytes.length);
            // 生成视图（直接针对内存）：8位无符号整数，长度1个字节
            let ia = new Uint8Array(ab);
            for (let i = 0; i < bytes.length; i++) {
                ia[i] = bytes.charCodeAt(i);
            }
            return new Blob([ab], {
                type: mime
            });
        },
        overwriteUpload(e) {
            let file = e.file
            let fileName = file.name
            if (file) {
                this.fileReader.readAsDataURL(file)
            }
            this.fileReader.onload = () => {
                let base64Str = this.fileReader.result
                let blob = this.base64ToBlob(base64Str) //base64->blob
                let blobURL = window.URL.createObjectURL(blob) //blob=>blobURL
                let data = {
                    blobURL: blobURL,
                    name: fileName,
                    username: this.$store.state.userInfo.username
                }

                this.$http.put(`/api/filesOp/avatarUpload`, data).then(res => {
                    console.log(res)
                    if (res.status === 200) {
                        this.$store.commit('getUserInfo', res.data[0])
                    }
                }).catch(err => {
                    console.log(err)
                })
            }
        },
        read(info) {
            this.$router.push({
                name: 'ShowAnnounce',
                params: info
            })
        },
        show(info) {
            this.postDialog = true
            this.$http.get(`/api/getSelfPosts/${info.id}`).then(res => {
                if (res.status === 200) {
                    this.postInfo = res.data
                    console.log(this.postInfo)
                }
            })
        },
        withdraw(id) {
            this.$confirm('退稿后稿件将保存在草稿箱,您确定要退稿吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                .then(() => {
                    // console.log('submit')
                    this.$http.delete(`/api/filesOp/withdraw/${id}`).then(res => {
                        if (res.data.status === 200) {
                            this.$message.success('退稿成功!')
                            this.$store.dispatch('asyncGetUploadDetails', this.$store.state.userInfo.username)
                        } else {
                            this.$message.error('退稿时出现错误!')
                        }
                    })
                })
                .catch(() => {
                    // console.log('test')
                })
        }
    },
    computed: {
        ...mapState(['userInfo', 'uploadInfo', 'postList', 'announceList']),
        ...mapGetters(['postNum', 'passNum', 'unpassNum', 'todoNum'])
    },

    created() {
        this.$store.dispatch('asyncGetUploadInfo', this.$store.state.userInfo.username)
        this.$store.dispatch('asyncGetUploadDetails', this.$store.state.userInfo.username)
        this.$store.dispatch('asyncGetAnnounceList');
    },
    mounted() {
        this.fileReader = new FileReader()
    },

}
</script>

<style scoped>
#top {
    height: auto;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden !important;
}

.el-card {
    overflow: auto;
}

.el-card::-webkit-scrollbar {
    width: 10px;
    height: 10px;
    /**/
}

.el-card::-webkit-scrollbar-track {
    border-radius: 2px;
}

.el-card::-webkit-scrollbar-thumb {
    background: #bfbfbf;
    border-radius: 10px;
}

.el-card::-webkit-scrollbar-corner {
    background: #bfbfbf;
}

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

.announce-card {
    margin-top: 10px;
}

.postinfo {
    height: 30vh;
    overflow: auto;
}

#postInfoForm.input {
    width: 50%;
}
</style>
