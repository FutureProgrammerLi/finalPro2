<template>
<div>
    <el-card class="content-card">
        <div slot="header" class="clearfix">
            <span>稿件内容</span>
            <el-button @click="backward" style="float: right; padding: 3px 0;font-size:15px;" type="text">返回草稿箱</el-button>
        </div>
        <ContentForm ref='contentFormRef' />
    </el-card>

    <el-card class="info-card">
        <div slot="header" class="clearfix">
            <span>作者信息</span>
        </div>
        <InfoForm ref='infoFormRef' />
    </el-card>

    <el-card class="file-card">
        <div slot="header" class="clearfix">
            <span>上传文件</span>
        </div>
        <uploadFile ref='fileupload' class="center" />
        <div class="btns">
            <el-button round type="primary" @click="post">投稿</el-button>
            <el-button round type="primary" @click="toDraft">保存</el-button>
            <!-- <el-button round type="primary" @click="test">保存</el-button> -->
            <!--应覆盖原有内容 -->
            <!-- 提示退出后不保存,退出确认 -->
        </div>
    </el-card>
    <div v-show="false">{{getDraftList?getDraftList:''}}</div> <!-- 没有这行填充不了内容? computed的问题? -->

</div>
</template>

<script>
import ContentForm from '../components/forms/ContentForm'
import InfoForm from '../components/forms/InfoForm'
import uploadFile from '../components/upload/fileUpload'
export default {
    name: "EditDraft",
    components: {
        ContentForm,
        InfoForm,
        uploadFile
    },
    data() {
        return {
          
        }
    },
    methods: {
        test() {
            console.log(JSON.stringify(this.$route.params) == '{}')
        },
        post() {
            // console.log(this.$refs.fileupload.$refs.uploadRef.submit)
            // console.log(this.$refs.contentFormRef.contentForm)
            const p1 = new Promise(resolve => {
                this.$refs.contentFormRef.$refs['contentFormRef'].validate(valid => {
                    if (valid) {
                        resolve()
                    }
                })
            })
            const p2 = new Promise(resolve => {
                this.$refs.infoFormRef.$refs['infoFormRef'].validate(valid => {
                    if (valid) {
                        resolve()
                    }
                })
            })
            const p3 = new Promise(resolve => {
                if (this.$refs.contentFormRef.contentForm.content == '' && this.$refs.fileupload.fileList.length == 0) { //相当于ContentForm里面的this.contentForm.content
                    this.$message.warning('请输入稿件正文信息或上传稿件文件')
                    let contentfocus = document.getElementById('contentfocus') //能用吗?
                    contentfocus.focus()
                } else {
                    resolve()
                }
            })
            Promise.all([p1, p2, p3]).then(() => {
                let combinedObj = Object.assign({}, this.$refs.contentFormRef.contentForm, this.$refs.infoFormRef.infoForm, this.$refs.fileupload.fileList)
                combinedObj.username = this.$store.state.userInfo.username
                combinedObj.kind = 'post'
                combinedObj.draftToPost = true
                combinedObj.withFile = false
                if (JSON.stringify(this.$route.params) != '{}') {
                    combinedObj.id = this.$route.params.info.id
                }
                if (combinedObj[0] != 'undefined') { //判断是否有上传文件
                    this.$refs.fileupload.$refs.uploadRef.submit() //有就触发overwriteSubmit
                    // delete combinedObj[0] //为什么要删除?存储了文件信息和表单信息
                    combinedObj.withFile = true
                }
                // console.log(combinedObj)
                this.$http.put('/api/filesOp/fileInfo', combinedObj).then(res => { //处理表格信息
                    if (res.data.status === 400) {
                        this.$message.error('投稿失败')
                    } else if (res.data.status === 201) {
                        this.$message.success('投稿成功')
                        this.$refs.contentFormRef.$refs['contentFormRef'].resetFields()
                        this.$refs.infoFormRef.$refs['infoFormRef'].resetFields()
                        this.$refs.fileupload.fileList = []
                    } else {
                        this.$message.error('未知错误')
                    }
                })
                combinedObj = null;
            })
        },
        save() {
            let mixedObj = Object.assign({}, this.$refs.contentFormRef.contentForm, this.$refs.infoFormRef.infoForm)
            if (JSON.stringify(this.$route.params) != '{}') {
                mixedObj.id = this.$route.params.info.id
            }
            this.$http.post(`/api/draft/saveDrafts`, mixedObj).then(res => {
                console.log(res)
                if (res.data.status === 201) {
                    this.$message.success('保存成功')
                    this.$router.push('/draft')
                } else if (res.data.status === 400) {
                    this.$message.error('保存失败,数据库修改失败')
                } else {
                    this.$message.error('保存失败,未知错误')
                }
            })
        },
        toDraft() {
            // console.log(this.$refs.infoFormRef.$refs['infoFormRef'].model)
            this.$refs.contentFormRef.$refs['contentFormRef'].validate(valid => {
                if (!valid) {
                    this.$message.warning('请至少输入中文标题!')
                    let input = document.getElementById('inputfocus')
                    input.focus()
                } else {
                    let draftObj = Object.assign({}, this.$refs.contentFormRef.$refs['contentFormRef'].model, this.$refs.infoFormRef.$refs['infoFormRef'].model)
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
                                this.$refs.contentFormRef.$refs['contentFormRef'].resetFields()
                                this.$refs.infoFormRef.$refs['infoFormRef'].resetFields()
                            } else {
                                this.$message.error('未知错误')
                            }
                        })
                    }
                }
            })
        },
        backward() {
            this.$confirm('返回将放弃所有的更改,是否确定要后退?', '确认返回', {
                confirmButtonText: '保存并返回',
                cancelButtonText: '不保存,直接返回'
            }).then(() => {
                this.save() //保存并返回
                this.$router.push('/draft')
            }).catch(() => {
                this.$router.push('/draft') //不保存,直接返回
            })
        }
    },
    computed: {
        getDraftList() {
            return this.$store.state.draftContentList
        }
    },
    created() {
        // console.log(this.$route.params.info.id)  //获取文章的id
        // console.log(this.$route.params)
        if (JSON.stringify(this.$route.params) != '{}') {
            let paramsObj = {
                username: this.$store.state.userInfo.username
            }
            paramsObj.id = this.$route.params.info.id
            this.$store.dispatch('asyncGetContentByTitle', paramsObj)
        }else{
            this.$store.state.draftContentList=[]
        }
        // console.log(this.$store.state.draftContentList)
    },
    beforeUpdate() { //之前的每个周期,draftContentList都没有改变
        Object.keys(this.$refs.contentFormRef.contentForm).forEach(i => {
            this.$refs.contentFormRef.contentForm[i] = this.getDraftList[i]
        })
        Object.keys(this.$refs.infoFormRef.infoForm).forEach(i => {
            this.$refs.infoFormRef.infoForm[i] = this.getDraftList[i]
        })
    }
    // this.$refs['contentFormRef'].model.title = this.draftContentList.title
}
</script>

<style scoped>
* {
    overflow: auto;
}

.info-card {
    margin-top: 10px;
}

.file-card {
    margin-top: 10px;
}

.btns {
    text-align: center;
    margin: 30px;
    padding: 20px;
}

.clearfix {
    font-size: 20px;
    font-weight: bold;
}

.center {
    text-align: center;
}
</style>
