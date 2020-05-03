<template>
<div id="box" style="margin-top:15px;">
    <el-upload class="upload-demo" ref="uploadRef" action="/api/posts" accept=".doc,.docx,.txt" :data="myData"  :limit="1" :headers="myHeader" :on-exceed="handleExceed" :on-change="fileCheck" :file-list="fileList" :http-request="overwriteSubmit" >
        <el-button size="small" type="primary">点击上传稿件文件</el-button>
        <div slot="tip" class="el-upload__tip">上传文件不能大于5M</div>
    </el-upload>
</div>
</template>

<script>
export default {
    name: 'fileUpload',
    data() {
        return {
            fileList: [],
            username: this.$store.state.userInfo.username,
            content: ''
        }
    },
    methods: {
        handleExceed(files, fileList) {
            fileList[0].name = files[0].name //覆盖第一次上传的文件
            this.$message.warning(`每次仅限上传一个文件!`);
        },
        fileCheck(file, fileList) {
            // console.log(fileList)
            this.fileList = fileList
            let satisfied = file.size < 5 * 1024 * 1024 ? true : false;
            let suffix = file.name.substring(file.name.lastIndexOf('.') + 1)
            if (!satisfied) {
                this.$message.warning('上传的文件不能超过5MB')
                this.fileList = []
            }
            if (suffix != 'doc' && suffix != 'docx' && suffix != 'txt') {
                this.$message.warning('仅支持.doc,.docx,.txt文件!')
                this.fileList = []
            }
            return satisfied && suffix //?
        },
        overwriteSubmit(e) {
            let combinedObj = Object.assign({}, this.$refs.contentForm, this.$refs.infoForm, this.fileList)
            let formData = new FormData()
            // console.log(e.file)
            formData.append("file", e.file)
            // formData.append("info",JSON.stringify(combinedObj))     //必须上传了文件才能触发
            let config = { //设置了header所以不能放置其它参数?
                headers: {
                    "Content-Type": 'multipart/form-data;charset="utf-8"',
                    "username": this.username, //用于操作数据库
                    "uid":JSON.stringify(this.fileList[0].uid)
                }
            }
            // console.log(this.fileList[0].uid)
            // console.log(formData)
            this.$http.put('/api/filesOp/posts', formData, config).then(res => { //上传文件,及文件的处理接口
                console.log(res)
            })
            combinedObj = null;
        }
    },
    computed: {
        myData() {
            return {
                'username': this.$store.state.userInfo.username
            }
        },
        myHeader() {
            return {
                "token": window.sessionStorage.getItem('token'),
                "Content-Type": 'multipart/form-data'
            }
        }
    }
}
</script>
