<template>
<div>
    <!-- This is the info page
    {{userInfo}} -->
    <el-card shadow="hover" style="width:100%;">
        <div slot="header">
            <span>你好,用户{{userInfo.username}}!</span>
            <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
        </div>
        <div>
            <i class="el-icon-user"></i>您的账号: {{userInfo.username}}
        </div>
        <div>
            <i class="el-icon-message"></i>您的邮箱: {{userInfo.email?userInfo.email:'NULL'}}
        </div>
        <div>选择您的操作:<el-button type="text" @click="test">修改密码</el-button> | <el-button type="text" style="padding-top:5px;">修改资料</el-button>
        </div>
    </el-card>
    <el-card shadow="hover" style="margin-top:10px;" >
        <div slot="header">
            您的投稿情况:
        </div>
        <el-row :gutter="12">
            <el-col :span="6">
                <el-card class="inner total" shadow="hover" >
                    总投件数<br>
                    {{uploadInfo.total}}
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover" class="inner passed">
                    通过审核<br>
                    {{uploadInfo.passed}}
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover" class="inner todo">
                    正在审核<br>
                    {{uploadInfo.todo}}
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover" class="inner unpassed">
                    未通过<br>
                    {{uploadInfo.unpassed}}
                </el-card>
            </el-col>
        </el-row>
    </el-card>
</div>
</template>

<script>
import {
    mapState
} from 'vuex'
export default {
    name: 'Info',
    data() {
        return {
        uploadInfo:this.$store.state.uploadInfo
        }
    },
    methods: {
        test() {
            console.log(this.uploadInfo)//为什么是个数组? dispatch的问题吗?
        }
    },
    computed: {
        ...mapState(['userInfo'])
    },
    // beforeCreat(){
    //     this.$store.dispatch('asyncGetUpload',this.$store.state.userInfo.username)   //再用同步好像怪怪的
    // },
    created(){
        
    }
}
</script>

<style scoped>
.inner{
    text-align: center;
}
.total:hover{
 background-color: rgb(80, 124, 247);
}
.passed:hover{
background-color: rgb(151, 240, 151);
}
.todo:hover{
background-color: rgb(250, 217, 27);
}
.unpassed:hover{
background-color: rgb(248, 37, 37);
}
</style>
