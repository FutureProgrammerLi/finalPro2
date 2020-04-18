<template>
<div class="parentDIV">
    <el-card class="box-card">
        <el-form :model="aForm" :rules="rules" ref="aFormRef" label-width="100px">
            <el-form-item label="公告标题" prop="title">
                <el-input v-model="aForm.title" maxlength="20" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="公告内容" prop="content">
                <el-input type="textarea"  v-model="aForm.content" :rows="20" maxlength="300" show-word-limit></el-input>
            </el-form-item>
        </el-form>
        <el-button type="primary" @click="submit('aFormRef')">发布</el-button>
    </el-card>
</div>
</template>

<script>

export default {
    name: "Announce",
    data() {
        return {
            aForm: {
                title: '',
                content: ''
            },
            rules:{
                title:[{
                    required:true,
                    message:'请输入公告标题',
                    trigger:'blur'
                }],
                content:[{
                    required:true,
                    message:'请输入公告内容',
                    trigger:'blur'
                }]
            }
        }
    },
    methods: {
        submit(ref) {
            // console.log(this.$refs[ref].validate)
          this.$refs[ref].validate(valid=>{
              if(valid){
                  let date = new Date()
                  let ymd = date.toLocaleDateString()
                  let now = date.toLocaleTimeString().toLocaleString()
                  let full = `${now} ${ymd}`
                  let paramsObj = Object.assign({},this.aForm)
                  paramsObj.ptime = full
                  paramsObj.publisher = this.$store.state.userInfo.username
                  this.$http.post(`/api/filesOp/announce`,paramsObj).then(res=>{
                      if(res.data.status === 200){
                          this.$message.success('发布成功')
                          this.$refs[ref].resetFields()
                      }else{
                          this.$message.error('发布失败')
                      }
                  })
              }
          })
        }
    }
}
</script>

<style lang="less" scoped>
.parentDIV {
    display: relative;
    margin:0;
    padding:0;
    .box-card {
        width: 50%;
        height: 70%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        overflow: auto;
    }

    
}
.el-button {
       margin-left:50%;
       text-align: center;
    }
</style>
