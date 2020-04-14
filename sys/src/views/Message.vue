<template>
<el-row :gutter="0">
    <el-col :span="16">
        <el-card class="msg-card">
            <div slot="header" class="clearfix">
                <span>消息内容</span>
            </div>
            <div class="text item" style="height:500px;overflow:auto;">
            {{showMessage}}
            </div>
            <div class="footer" v-if="this.showMessage">
                <el-button type="danger" @click="delMsg">删除消息</el-button>
                <el-button type="primary" @click="readMsg">已读消息</el-button>
            </div>
        </el-card>
    </el-col>
    <el-col :span="8">
        <el-card class="list-card" style="padding:0;">
            <div v-for="(item,index) in this.$store.state.comments" :key="index" class="text item" @click="passIndex(index,item.id)">
                消息{{index+1}}:关于稿件标题为:{{item.title}}<el-tag v-if="item.done == 0" type="warning">未读</el-tag>
                <el-tag v-if="item.done == 1" >已读</el-tag>
                <br>
                <br>
                &nbsp;&nbsp;{{item.comment}} 
           
                
            </div>
        </el-card>
    </el-col>
<!-- <el-button @click="test">test</el-button> -->
</el-row>
</template>

<script>
import {
    mapState,
    mapMutations
} from 'vuex'
export default {
    name: 'Message',
    data() {
        return {
            showMessage: '',
            commentid:''
        }
    },
    computed: {
        ...mapState(['comments'])
    },
    methods: {
        passIndex(index,commentid){
            this.showMessage = '',
            this.showMessage = this.comments[index].comment
            this.commentid = commentid
        },
        delMsg(){
         let type="delete"
         this.$http.get(`/api/examine/changeMsgState/${this.commentid}/${type}`).then(res=>{
             if(res.data.status === 200){
                 this.$message.success('信息已经删除')
                 this.$store.dispatch('getComment',this.$store.state.userInfo.username)
             }
         })
        // console.log(this.$store.state.comments)
        },
        readMsg(){
         let type="read"
         this.$http.get(`/api/examine/changeMsgState/${this.commentid}/${type}`).then(res=>{
             if(res.data.status === 200){
                this.$store.dispatch('getComment',this.$store.state.userInfo.username)
                console.log('Set successfully')
             }
         })
        },
        test() {
            console.log(this.comments)
        }
    }
}
</script>

<style scoped>
.el-card {
    height: 600px;
    overflow: auto;
}

/deep/ .el-card__body {
    padding: 0;
}

.msg-box {
    position: relative;
    float: left;
    width: 40%;
}

/* .list-card{
    position: relative;
} */

.list-card div {
    position: relative;
    height: 100px;
    padding: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.list-card div:hover {
    background-color: bisque;
}

.el-row {
    width: 60%;
    margin: 5% 0 0 10%;
}
.footer{
    margin-left:50%;
}
.el-tag{
    position: absolute;
    top:0;
    right:0;
}
</style>
