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
        <uploadFile ref='uploadFileRef' class="center" />
        <div class="btns">
            <el-button round type="primary" @click="post">投稿</el-button>
            <el-button round type="primary" @click="save">保存</el-button><!--应覆盖原有内容 -->
             <!-- 提示退出后不保存,退出确认 -->
        </div>
    </el-card>
    <div v-show="false">{{getDraftList}}</div>  <!-- 没有这行填充不了内容? computed的问题? -->

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
            console.log(this.$store.state.draftContentList)
        },
        post(){
        
        },
        save(){
          let mixedObj = Object.assign({},this.$refs.contentFormRef.contentForm,this.$refs.infoFormRef.infoForm,this.$refs.uploadFileRef.fileList)
          mixedObj.id = this.$route.params.info.id
          this.$http.post(`/api/draft/saveDrafts`,mixedObj).then(res=>{
              console.log(res)
              if(res.data.status === 201){
                  this.$message.success('保存成功')
                  this.$router.push('/draft')
              }else if(res.data.status === 400){
                  this.$message.error('保存失败,数据库修改失败')
              }else{
                  this.$message.error('保存失败,未知错误')
              }
          })
        },
        backward(){
           this.$confirm('返回将放弃所有的更改,是否确定要后退?','确认返回',{
               confirmButtonText:'保存并返回',
               cancelButtonText:'不保存,直接返回'
           }).then(()=>{
                 this.save()      //保存并返回
                 this.$router.push('/draft')
           }).catch(()=>{
                this.$router.push('/draft')   //不保存,直接返回
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
        let paramasObj = {
            title: this.$route.params.info.title,
            username: this.$store.state.userInfo.username
        }
        this.$store.dispatch('asyncGetContentByTitle', paramasObj)
        // console.log(this.$store.state.draftContentList)
    },
    beforeUpdate() { //之前的每个周期,draftContentList都没有改变
        // console.log(this.$store.state.draftContentList)
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
