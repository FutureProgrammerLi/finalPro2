<template>
<div id="try" style="height:100%">
    <!-- <el-button @click="test">test</el-button> -->
    <el-card class="box-card">
        <el-form :model="rebuildObj" label-width="180px">
            <el-form-item label="标题:" prop="title">
                <el-input v-model="rebuildObj.title" readonly></el-input>
            </el-form-item>
            <el-form-item label="摘要:" prop="summary">
                <el-input v-model="rebuildObj.summary" readonly></el-input>
            </el-form-item>
            <el-form-item label="英文摘要:" prop="summaryInEnglish">
                <el-input v-model="rebuildObj.summaryInEnglish" readonly></el-input>
            </el-form-item>
            <el-form-item label="正文:" prop="content">
                <el-input type="textarea" :rows="7" v-model="rebuildObj.content" readonly></el-input>
            </el-form-item>
            <el-form-item label="文件内容:" v-if="rebuildObj[0]" prop="content">
                <!-- 当有上传文件时显示这两行 -->
                <el-input type="textarea" :rows="7" v-model="rebuildObj.fileContent" readonly></el-input>
            </el-form-item>
            <el-form-item v-if="rebuildObj[0]">
                <el-button type="text" @click="download(rebuildObj[0].uid)">下载稿件文件</el-button>
            </el-form-item>
            <el-form-item label="作者姓名:" prop="name">
                <el-input v-model="rebuildObj.name" readonly></el-input>
            </el-form-item>
            <el-form-item label="作者性别:" prop="gender">
                <el-input v-model="rebuildObj.gender" readonly></el-input>
            </el-form-item>
            <el-form-item label="作者邮箱:" prop="email">
                <el-input v-model="rebuildObj.email" readonly></el-input>
            </el-form-item>
            <el-form-item label="作者手机号码:" prop="phone">
                <el-input v-model="rebuildObj.phone" readonly></el-input>
            </el-form-item>
            <el-form-item label="作者联系地址:" prop="address">
                <el-input v-model="rebuildObj.address" readonly></el-input>
            </el-form-item>
        </el-form>
        <el-form :model="commentForm" label-width="180px" :rules="rules">
            <el-form-item label="审核评论:" prop="comment">
            <el-input type="textarea" :row="7" v-model="commentForm.comment"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="check('passed')">通过</el-button>
                <el-button type="danger" @click="check('unpassed')">不通过</el-button>
                <el-button @click="goBack">返回</el-button>
            </el-form-item>
            
        </el-form>
    </el-card>
    
    <div v-show="false">{{this.filterObj}}</div>
</div>
</template>

<script>
export default {
    name: 'EditExamine',
    data() {
        return {
            id:'',
            content: '',
            rebuildObj: {},
            commentForm:{
                comment:''
            },
            state:'',
            rules:{
               comment: [{
                    required:true,
                    message:'请填写审核意见',
                    trigger:'blur'
                },{
                    max:300,
                    message:'请输入300字以下的审核意见',
                    trigger:'blur'
                }]
            }
        }
    },
    computed: {
        filterObj() {
            return this.rebuildObj
        }
    },
    methods: {
        test() {
            console.log(this.content)
        },
        download(uid) {
            this.$http.get(`/api/filesOp/sendFiles/${uid}`).then(res => {
                if(res.status == 200){
                    let url = window.URL.createObjectURL(new Blob([res.data])) //创建下载链接
                let link = document.createElement('a') //创建a标签
                link.style.display = 'none' //将a标签隐藏
                link.href = url //给a标签添加下载链接
                link.setAttribute('download', this.rebuildObj[0].name) // 此处注意，要给a标签添加一个download属性，属性值就是文件名称 否则下载出来的文件是没有属性的，空白白
                document.body.appendChild(link)
                // console.log(link)
                link.click() //执行a标签 怎么指定
                }else{
                    this.$message.error('下载失败')
                }
            })
        },
        check(state){
            // console.log(state,typeof state)
        this.state = state
        let paramsObj = {
            commentator:this.$store.state.userInfo.username,  //审核人员?有无必要?
            username:this.$route.params.info.username, //作者名称
            comment:this.commentForm.comment,
            infoid:this.id,
            title:this.content.title    //用来指示答复标题
        }
        // this.$store.dispatch('commentsInsert',paramsObj)
        this.$http.get(`/api/examine/changeState/${this.id}/${this.state}`).then(res=>{
            if(res.data.status === 200){
                this.$store.dispatch('commentsInsert',paramsObj)
                this.$router.push('/examine')
            }else {
                this.$message.error('修改稿件状态失败')
            }
        })
        },
        goBack(){
            this.$router.push('/examine')
        }
    },
    created() {
        this.content = this.$route.params.info;
        // console.log(this.$route.params)
        this.id = this.$route.params.id
    },
    beforeMount() {
        Object.keys(this.content).forEach(i => {
            if (i != 'username' && i != 'kind' && i != 'draftToPost') {
                this.rebuildObj[i] = this.content[i] //用来隐藏信息
            }
        })
        // console.log(this.rebuildObj)
    }
}
</script>

<style scoped>
#try{
    overflow:auto;
}
.el-input {
    width: 40%;
}

.el-textarea {
    width: 80%;
}
.el-card{
    overflow:auto;
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
</style>
