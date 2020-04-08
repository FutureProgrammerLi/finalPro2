<template>
<div id="topDiv" style="height:100%;">
    <h2 style="text-align:center;margin:0;padding-top:5px;line-height:5px;">填写投稿信息</h2>
    <el-card class="box-card">
        <div slot="header" class='title'>
            <span>稿件信息</span>
        </div>
        <ContentForm ref='contentForm' />
        <div class='title'>作者信息</div>
        <InfoForm ref='infoForm' />
        <div class="first title"> 上传文件</div>
        <fileUpload ref='fileupload' />
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
import fileUpload from '../components/upload/fileUpload'
export default {
    name: "Post",
    components: {
        ContentForm,
        InfoForm,
        fileUpload
    },
    data() {
        return {
            username: this.$store.state.userInfo.username,
        }
    },
    methods: {
        submit() {
            // console.log(this.$refs.fileupload.$refs.uploadRef.submit)
            const p1 = new Promise(resolve => {
                this.$refs.contentForm.$refs['contentFormRef'].validate(valid => {
                    if (valid) {
                        resolve()
                    }
                })
            })
            const p2 = new Promise(resolve => {
                this.$refs.infoForm.$refs['infoFormRef'].validate(valid => {
                    if (valid) {
                        resolve()
                    }
                })
            })
            const p3 = new Promise(resolve => {
                if (this.$refs.contentForm.$refs['contentFormRef'].model.content == '' && this.$refs.fileupload.fileList.length == 0) { //相当于ContentForm里面的this.contentForm.content
                    this.$message.warning('请输入稿件正文信息或上传稿件文件')
                    let contentfocus = document.getElementById('contentfocus') //能用吗?
                    contentfocus.focus()
                } else {
                    // console.log(this.$refs['contentFormRef'].model.content ,this.fileList) //fileList是个observer对象,非空
                    resolve()
                }
            })
            Promise.all([p1, p2, p3]).then(() => {
                // console.log('表单验证测试')
                let combinedObj = Object.assign({}, this.$refs.contentForm.$refs['contentFormRef'].model, this.$refs.infoForm.$refs['infoFormRef'].model, this.$refs.fileupload.fileList)
                combinedObj.username = this.username
                combinedObj.kind = 'post'
                combinedObj.draftToPost = false
                // console.log(combinedObj)
                if (combinedObj[0]) { //判断是否有上传文件
                    this.$refs.fileupload.$refs.uploadRef.submit() //有就触发overwriteSubmit
                    // delete combinedObj[0] //为什么要删除?存储了文件信息和表单信息
                }
                // console.log(combinedObj)
                this.$http.put('/api/filesOp/fileInfo', combinedObj).then(res => { //处理表格信息
                    if (res.data.status === 400) {
                        this.$message.error('投稿失败')
                    } else if (res.data.status === 201) {
                        this.$message.success('投稿成功')
                        this.$refs.contentForm.$refs['contentFormRef'].resetFields()
                        this.$refs.infoForm.$refs['infoFormRef'].resetFields()
                        this.$refs.fileupload.fileList = []
                        this.$router.push('/info')
                    } else {
                        this.$message.error('未知错误')
                    }
                })
                combinedObj = null;
            })
        },
        toDraft() {
            this.$refs.contentForm.$refs['contentFormRef'].validate(valid => {
                if (!valid) {
                    this.$message.warning('请至少输入中文标题!')
                    let input = document.getElementById('inputfocus')
                    input.focus()
                } else {
                    let draftObj = Object.assign({}, this.$refs.contentForm.$refs['contentFormRef'].model, this.$refs.infoForm.$refs['infoFormRef'].model)
                    draftObj.username = this.$store.state.userInfo.username
                    draftObj.kind = 'draft'
                    if (draftObj.title === '') {
                        this.$message.warning('请至少输入标题!')
                    } else {
                        // console.log(draftObj)
                        this.$http.put('/api/filesOp/fileInfo', draftObj).then(res => {
                            if (res.data.status === 400) {
                                this.$message.error('操作失败')
                            } else if (res.data.status === 201) {
                                this.$message.success('已放入草稿箱')
                                this.$refs.contentForm.$refs['contentFormRef'].resetFields()
                                this.$refs.infoForm.$refs['infoFormRef'].resetFields()
                                this.$refs.fileupload.fileList = []
                            } else {
                                this.$message.error('未知错误')
                            }
                        })
                    }
                }
            })
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
