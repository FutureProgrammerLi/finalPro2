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
            <el-button size="mini" type="danger" @click="test(scope.row)">删除</el-button>
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
