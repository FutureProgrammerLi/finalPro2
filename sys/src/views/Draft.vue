<template>
<div id="box">
    <el-button type="primary" @click="createDraft">新建草稿</el-button>
<el-table :data="draftList" stripe border style="width: 100%">
    <el-table-column prop="title" label="稿件标题" width="300">
    </el-table-column>
    <el-table-column prop="date" label="上传日期" align="center">
    </el-table-column>
    <el-table-column prop="ops" label="操作" align="right">
        <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="editDraft(scope.row)">修改</el-button>
            <el-button size="mini" type="danger" @click="deleteDraft(scope.$index,scope.row)">删除</el-button>
        </template>
    </el-table-column>
</el-table>
</div>
</template>

<script>
import {
    mapState
} from 'vuex'
export default {
    name: "Draft",
    data() {
        return {
        }
    },
    methods: {
        test(){
          console.log(typeof this.$store.state.draftList)
        },
        editDraft(content) {
            // console.log(content)
            this.$router.push({
                name: 'EditDraft',  //name用params传, path用query传
                params: {
                    "info": content
                }
            })
        },
        createDraft(){
            this.$router.push('/editDraft')
        },
        deleteDraft(index,row){
            this.$confirm("删除草稿后将无法恢复,确定要删除吗?","删除确认",{
                confirmButtonText:"确认",
                cancelButtonText:"取消",
                type:"warning"
            }).then(()=>{
                this.$http.delete(`/api/draft/deleteDrafts/${row.id}`).then(res=>{
                    if(res.data.status === 200){
                        this.draftList.splice(index,1)
                        this.$message.success('成功删除草稿!')
                    }else if(res.data.status === 500){
                        this.$message.error('服务器操作失败')
                    }else{
                        this.$message.error('未知错误')
                        console.log(res)
                    }
                })
            }).catch(()=>{})
        }
    },
    computed: {
        ...mapState(['draftList'])
    },
    created() {
        this.$store.dispatch('asyncGetDraftList', this.$store.state.userInfo.username)
    }
}
</script>
<style scoped>
#box{
    margin:0;
    padding:0;
    height:100%;
    overflow:hidden;
}
.el-table{
    margin:0;
    padding:0;
    height:75vh;
    overflow:auto;
}
</style>
