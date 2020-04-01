<template>
<div id="topDiv" style="height:100%;">
    <h2 style="text-align:center;margin:0;padding-top:5px;line-height:5px;">填写投稿信息</h2>
    <el-card class="box-card">
        <div slot="header" class='title'>
            <span>稿件信息</span>
        </div>
        <ContentForm @getContentRef="pushContentRef"/>
        <div class='title'>作者信息</div>
        <InfoForm @getInfoRef="pushInfoRef"/>
        <div class="first title"> 上传文件</div>
        <div id="box" style="margin-top:15px;">
            <el-upload class="upload-demo" ref="uploadRef" action="/api/posts" accept=".doc,.docx,.txt" :data="myData" :limit="1" :headers="myHeader" :on-exceed="handleExceed" :on-change="fileCheck" :file-list="fileList" :http-request="overwriteSubmit" :auto-upload="false">
                <el-button size="small" type="primary">点击上传稿件文件</el-button>
                <div slot="tip" class="el-upload__tip">上传文件不能大于5M</div>
            </el-upload>
        </div>
        <div class="btn">
            <el-button type="primary" round @click="submit($event)">投稿</el-button>
            <el-button type="info" round @click="toDraft">设为草稿</el-button>
        </div>
    </el-card>
</div>
</template>

<script>
import ContentForm from '../components/forms/ContentForm'
import InfoForm from '../components/forms/InfoForm'
export default {
    name: "Post",
    components: {
        ContentForm,
        InfoForm
    },
    data() {
        return {
            fileList: [],
            username: this.$store.state.userInfo.username,
            content:''
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
            let combinedObj = Object.assign({}, this.contentForm, this.infoForm, this.fileList)
            let formData = new FormData()
            formData.append("file", e.file)
            // formData.append("info",JSON.stringify(combinedObj))     //必须上传了文件才能触发
            let config = { //设置了header所以不能放置其它参数?
                headers: {
                    "Content-Type": "multipart/form-data",
                    "username": this.username //用于操作数据库
                }
            }
            this.$http.put('/api/filesOp/posts', formData,config).then(res => { //上传文件,及文件的处理接口
                console.log(res)
            })
            combinedObj = null;
        },
        submit() {
            // console.log(this.$refs['contentFormRef'])
            const p1 = new Promise(resolve => {
                this.$refs['contentFormRef'].validate(valid => {
                    if (valid) {
                        resolve()
                    }
                })
            })
            const p2 = new Promise(resolve => {
                this.$refs['infoFormRef'].validate(valid => {
                    if (valid) {
                        resolve()
                    }
                })
            })
            const p3 = new Promise(resolve => {
                if (this.$refs['contentFormRef'].content == '' || this.fileList == []) { //相当于ContentForm里面的this.contentForm.content
                    this.$message.warning('请输入稿件正文信息或上传稿件文件')
                    let contentfocus = document.getElementById('contentfocus')
                    contentfocus.focus()
                } else {
                    resolve()
                }
            })
            Promise.all([p1, p2, p3]).then(() => {
                // console.log('表单验证测试')
                let combinedObj = Object.assign({}, this.contentForm, this.infoForm, this.fileList)
                combinedObj.username = this.username
                combinedObj.kind = 'post'
                if (combinedObj[0] != 'undefined') { //判断是否有上传文件
                    this.$refs.uploadRef.submit() //有就触发overwriteSubmit
                    delete combinedObj[0] //为什么要删除?存储了文件信息和表单信息
                }
                // console.log(combinedObj)
                this.$http.put('/api/filesOp/fileInfo', combinedObj).then(res => { //处理表格信息
                    if (res.data.status === 400) {
                        this.$message.error('投稿失败')
                    } else if (res.data.status === 201) {
                        this.$message.success('投稿成功')
                        this.$refs['contentFormRef'].resetFields()
                        this.$refs['infoFormRef'].resetFields()
                        this.fileList = []
                    } else {
                        this.$message.error('未知错误')
                    }
                })
                combinedObj = null;
            })
        },
        toDraft() {
            this.$refs['contentFormRef'].validate(valid => {
                if (!valid) {
                    this.$message.warning('请至少输入中文标题!')
                    let input = document.getElementById('inputfocus')
                    input.focus()
                } else {
                    let draftObj = Object.assign({}, this.contentForm, this.infoForm)
                    draftObj.username = this.username
                    draftObj.kind = 'draft'
                    if (draftObj.title === '') {
                        this.$message.warning('请至少输入标题!')
                    } else {
                        this.$http.put('/api/filesOp/fileInfo', draftObj).then(res => {
                            if (res.data.status === 400) {
                                this.$message.error('操作失败')
                            } else if (res.data.status === 201) {
                                this.$message.success('已放入草稿箱')
                                this.$refs['contentFormRef'].resetFields()
                                this.$refs['infoFormRef'].resetFields()
                                this.fileList = []
                            } else {
                                this.$message.error('未知错误')
                            }
                        })
                    }
                }
            })
        },
        pushContentRef(ref){
        this.$refs['contentFormRef'] = ref
        // this.content = content
        },
        pushInfoRef(ref){
            this.$refs['infoFormRef'] = ref
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

<style scoped>
#topDiv {
    margin: 0;
    padding: 0;
}

#box {
    text-align: center;
}

.el-card {
    margin: 20px;
    height: 100%;
}

.btn {
    text-align: center;
    margin: 30px;
    padding: 20px;
    /* justify-content: center;
    align-items: center; */
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

/* .el-card::-webkit-scrollbar-thumb:hover{
  background: #bfbfbf;
} */
.el-card::-webkit-scrollbar-corner {
    background: #bfbfbf;
}

.last {
    padding-bottom: 20px;
    border-bottom: 2px solid rgba(235, 238, 245, 0.712);
}

.first {
    padding-top: 20px;
    border-top: 2px solid rgba(235, 238, 245, 0.712);
}

.title {
    font-weight: bold;
}

.el-textarea {
    width: 90%;
}

.el-card {
    overflow: auto;
}
</style>
