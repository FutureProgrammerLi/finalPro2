<template>
<div>
    <!-- <el-button @click="test">test</el-button> -->
    <el-card class="box-card">
        <el-table :data="filteredData" style="width: 100%">
            <!-- :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))" -->
            <el-table-column label="上传用户" prop="username">
            </el-table-column>
            <el-table-column label="稿件名称" prop="title">
            </el-table-column>
            <el-table-column label="上传日期" prop="date" sortable>
            </el-table-column>
            <el-table-column label="是否附带文件" prop="file" sortable>
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.file=='true'" type="plain">是</el-tag>
                    <el-tag v-else type="plain">否</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="状态" prop="state" sortable>
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.state=='passed'" type="success">已通过</el-tag>
                    <el-tag v-if="scope.row.state=='unpassed'" type="danger">未通过</el-tag>
                    <el-tag v-if="scope.row.state=='todo'" type="plain">待审核</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="right">
                <template slot="header" slot-scope="scope">
                    <el-input v-model="search" size="mini" placeholder="输入关键字搜索" @blur="dealWithScope(scope)" />
                </template>
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">查看</el-button>
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
            // console.log(index,row)
            this.$http.get(`/api/examine/getExamineContent`, {
                params: {
                    path: row.path,
                    id:row.id
                }
            }).then(res => {
                // console.log(res.status)
                // console.log(res)
                if (res.status === 200) {
                    this.$router.push({
                        name: 'EditExamine',
                        params: {
                            info: res.data,
                            id:row.id,
                            state:row.state
                        }
                    })
                }else{
                    console.log(res)
                }
            })
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
    },
    mounted () {
        // console.log(this.filteredData);
    },
}
</script>

<style scoped>
.el-card {
    height: 100%;
    overflow: auto;
}
</style>
