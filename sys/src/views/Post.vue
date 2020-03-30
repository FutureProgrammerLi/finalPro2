<template>
<div id="topDiv" style="height:100%;">
    <h2 style="text-align:center;margin:0;padding-top:5px;line-height:5px;">填写投稿信息</h2>
    <el-card class="box-card">
        <div slot="header" class='title'>
            <span>稿件信息</span>
        </div>
        <el-form ref="contentFormRef" :model="contentForm" label-width="100px" class="contentForm" :rules="rules">
            <el-form-item label="中文标题:" prop="title">
                <el-input type="text" v-model="contentForm.title" style="width:70%" placeholder="请输入不多于15字的中文标题"></el-input>
            </el-form-item>
            <el-form-item label="中文摘要:" prop="summary">
                <el-input type="textarea" v-model="contentForm.summary" :rows="4" placeholder="请输入不多于30字的中文摘要"></el-input>
            </el-form-item>
            <el-form-item label="英文摘要:" prop="summaryInEnglish">
                <el-input type="textarea" v-model="contentForm.summaryInEnglish" :rows="4" placeholder="请输入不多于50字的英文摘要"></el-input>
            </el-form-item>
            <el-form-item label="正文:" class="last" prop="content">
                <el-input type="textarea" v-model="contentForm.content" :rows="7" placeholder="请输入正文部分,建议不多于2000字或直接上传文件"></el-input>
            </el-form-item>
        </el-form>
        <div class='title'>作者信息</div>
        <el-form ref="infoFormRef" :model="infoForm" label-width="100px" :inline="true" style="margin-top:15px;" :rules="rules">
            <el-form-item label="作者姓名:" prop="name">
                <el-input type="text" v-model="infoForm.name" placeholder="请输入您的姓名"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="gender">
                <el-radio-group v-model="infoForm.gender">
                    <el-radio label="男"></el-radio>
                    <el-radio label="女"></el-radio>
                </el-radio-group>
            </el-form-item><br>
            <el-form-item label="电子邮箱:" prop="email">
                <el-input v-model="infoForm.email" maxlength="11" placeholder="请输入您的电子邮箱"></el-input>
            </el-form-item>
            <el-form-item label="联系电话:" prop="phone">
                <el-input v-model="infoForm.phone" maxlength="11" placeholder="请输入您的联系电话"></el-input>
            </el-form-item><br>
            <el-form-item label="联系地址:" prop="address">
                <el-input type="textarea" v-model="infoForm.address" autosize style="width:100%;" placeholder="请输入您的联系地址"></el-input>
            </el-form-item>
        </el-form>
        <div class="first title"> 上传文件</div>
        <div id="box" style="margin-top:15px;">
            <el-upload class="upload-demo" ref="uploadRef" action="/api/posts" accept=".doc,.docx,.txt" :data="myData" :limit="1" :headers="myHeader" :on-exceed="handleExceed" :on-change="fileCheck" :file-list="fileList" :http-request="overwriteSubmit" :auto-upload="false">
                <el-button size="small" type="primary">点击上传稿件文件</el-button>
                <div slot="tip" class="el-upload__tip">上传文件不能大于5M</div>
            </el-upload>
        </div>
        <div class="btn">
            <el-button type="primary" @click="submit($event)">投稿</el-button>
        </div>
    </el-card>
</div>
</template>

<script>
export default {
    name: "Post",
    data() {
        var nameCheck = (value, callback) => {
            let nameReg = /^[\u4e00-\u9fa5]{2,6}$/
            if (nameReg.test(value)) {
                callback()
            } else {
                callback(new Error('请输入正确的姓名!'))
            }
        };
        var phoneCheck = (value, callback) => {
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
        var mailCheck = (value, callback) => {
            let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
            if (reg.test(value)) {
                callback()
            } else {
                callback(new Error('请输入正确的邮箱地址!'))
            }
        };
        return {
            contentForm: {
                title: '',
                summary: '',
                summaryInEnglish: '',
                content: ''
            },
            infoForm: {
                name: '',
                gender: '',
                email: '',
                phone: '',
                address: ''
            },
            fileList: [],
            username: this.$store.state.userInfo.username,
            rules: {
                title: [{
                    required: true,
                    message: '请输入标题',
                    trigger: 'blur'
                }],
                summary: [{
                    required: true,
                    message: '请输入中文摘要',
                    trigger: 'blur'
                }],
                summaryInEnglish: [{
                    required: true,
                    message: '请输入英文摘要',
                    trigger: 'blur'
                }],
                content: [{
                    required: true,
                    message: '请输入正文',
                    trigger: 'blur'
                }],
                name: [{
                        required: true,
                        message: '请输入姓名',
                        trigger: 'blur'
                    },
                    {
                        validator: nameCheck,
                        trigger: 'blur'
                    }
                ],

                gender: [{
                    required: true,
                    message: '请选择性别',
                    trigger: 'blur'
                }],
                email: [{
                    required: true,
                    message: '请输入电子邮箱',
                    trigger: 'blur'
                }, {
                    validator: mailCheck,
                    trigger: 'blur'
                }],
                phone: [{
                    required: true,
                    message: '请输入联系电话',
                    trigger: 'blur'
                }, {
                    validator: phoneCheck,
                    trigger: 'blur'
                }],
                address: [{
                    required: true,
                    message: '请输入联系地址',
                    trigger: 'blur'
                }]
            }
        }

    },
    methods: {
        handleExceed(files, fileList) {
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
            // this.$http.put('/api/filesOp/posts', formData,config).then(res => { //上传文件,及文件的处理接口
            //     console.log(res)
            // })
            combinedObj = null;
        },
        submit() {
            let combinedObj = Object.assign({}, this.contentForm, this.infoForm, this.fileList)
            combinedObj.username = this.username
            // if(combinedObj[0]!='undefined'){        //判断是否有上传文件
            //     this.$refs.uploadRef.submit()       //有就触发overwriteSubmit
            //     delete combinedObj[0] //为什么要删除?存储了文件信息和表单信息
            // }
            // console.log(combinedObj)
            this.$http.put('/api/filesOp/fileInfo', combinedObj).then(res => { //处理表格信息
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
