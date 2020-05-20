<template>
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
        <!-- 修改密码的对话框 -->
        <ChangePwd :pwdDialog="pwdDialog" />
        <!-- 修改资料的对话框 -->
        <ChangeInfo :infoDialog="infoDialog" />
    </div>
</el-card>
</template>

<script>
import {
    mapState
} from 'vuex'
import ChangePwd from '@/components/dialogs/ChangePwd.vue'
import ChangeInfo from '@/components/dialogs/ChangeInfo.vue'
export default {
    components:{
    ChangePwd,
    ChangeInfo
    },
    data() {
        return {
            pwdDialog: {
                value:false
            },
            infoDialog:{
                value:false
            },
            fileList: [],
            fileReader:null
        }
    },
    computed: {
        ...mapState(['userInfo'])
    },
    methods: {
        changePwd() {
            this.pwdDialog.value = true;
        },
        changeInfo() {
            this.infoDialog.value = true;
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
                    // console.log(res)
                    if (res.status === 200) {
                        this.$store.commit('getUserInfo', res.data[0])
                    }
                }).catch(err => {
                    console.log(err)
                })
            }
        }
    },
    mounted() {
        this.fileReader = new FileReader()
    }
}
</script>

<style lang="scss" scoped>

</style>
