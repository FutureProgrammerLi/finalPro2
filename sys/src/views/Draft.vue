<template>
<el-table :data="draftList" stripe border style="width: 100%">
    <el-table-column prop="title" label="稿件标题" width="300">
        <template>
            <!-- <el-button type="text">这里必须小于等于15个字这里够15个字了吗</el-button> -->
        </template>
    </el-table-column>
    <el-table-column prop="date" label="上传日期" align="center">
    </el-table-column>
    <el-table-column prop="ops" label="操作" align="right">
        <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="editDraft(scope.row)">修改</el-button>
            <el-button size="mini" type="danger" @click="test(scope.row)">删除</el-button>
            <!-- <el-button type="text" @click="test(scope.row)">修改</el-button>
      <el-button type="text">删除</el-button> -->
        </template>
    </el-table-column>
</el-table>
</template>

<script>
import {
    mapState
} from 'vuex'
export default {
    name: "Draft",
    data() {
        return {
            tableData: [{
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-04',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1517 弄'
            }, {
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1519 弄'
            }, {
                date: '2016-05-03',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1516 弄'
            }]
        }
    },
    methods: {
        editDraft(content) {
            // console.log(content)
            this.$router.push({
                name: 'EditDraft',  //name用params传, path用query传
                params: {
                    "info": content
                }
            })
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
