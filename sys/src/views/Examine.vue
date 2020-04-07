<template>
<div>
    <el-button @click="test">test</el-button>
    <el-card class="box-card">
        <el-table :data="filteredData" style="width: 100%">
            <!-- :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))" -->
            <el-table-column label="上传用户" prop="username">
            </el-table-column>
            <el-table-column label="稿件名称" prop="title">
            </el-table-column>
            <el-table-column label="上传日期" prop="date" sortable>
            </el-table-column>
            <el-table-column align="right">
                <template slot="header" slot-scope="scope">
                    <el-input v-model="search" size="mini" placeholder="输入关键字搜索" @blur="dealWithScope(scope)" />
                </template>
                <template slot-scope="scope">
                    <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :total="postListTotal" :current-page="1" :page-sizes="[5, 10, 20, 50]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" style="margin-top:10px;">
        </el-pagination>
    </el-card>

</div>
</template>

<script>
import {
    mapState
} from 'vuex'
export default {
    name: "Examine",
    data() {
        return {
            currentPage: 1,
            pageSize: 10, //要和元素中的：page-size保持一致，因为没有重新dispatch
            search: ''
        }
    },
    methods: {
        dealWithScope() {},
        handleEdit(index, row) {
            // console.log(row.path)
           this.$http.get(`/api/examine/getExamineContent`,{params:{
               path:row.path
           }}).then(res=>{
               console.log(res)
           })
        },
        handleDelete(index, row) {
            console.log(index, row);
        },
        handleSizeChange(newSize) {
            this.pageSize = newSize

        },
        handleCurrentChange(currentPage) {
            this.currentPage = currentPage
        },
        test() {
            console.log(this.allPostList)
        }
    },
    computed: {
        ...mapState(['allPostList', 'postListTotal', 'postListTotal']),
        filteredData() {
            let page = this.allPostList.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
            let result = page.filter(data => !this.search || data.username.toLowerCase().includes(this.search.toLowerCase()) || data.title.toLowerCase().includes(this.search.toLowerCase()))
            return result
        }
    },
    created() {
        if (this.$store.state.userInfo.roleid < 2) {
            this.$store.dispatch('asyncGetExamineList', this.$store.state.userInfo.roleid)
        }
    }
}
</script>

<style scoped>
.el-card {
    height: 100%;
    overflow: auto;
}
</style>
