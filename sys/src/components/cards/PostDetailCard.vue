<template>
<el-card shadow="hover" style="margin-top:10px;" class="postinfo">
    <div slot="header">
        投稿详情:
    </div>
    <el-table :data="postList" stripe border style="width: 100%;overflow:hidden;" height="250">
        <el-table-column prop="title" label="稿件标题" width="300">
        </el-table-column>
        <el-table-column prop="date" label="上传日期" align="center">
        </el-table-column>
        <el-table-column prop="state" label="状态" align="center">
            <template slot-scope="scope">
                <el-tag type="success" v-if="scope.row.state == 'passed'">通过审核</el-tag>
                <el-tag type="warning" v-if="scope.row.state == 'todo'">正在审核</el-tag>
                <el-tag type="danger" v-if="scope.row.state == 'unpassed'">审核未通过</el-tag>
            </template>
        </el-table-column>
        <el-table-column label="操作" align="right">
            <template slot-scope="scope">
                <el-button type="primary" @click="show(scope.row)">查看</el-button>
                <el-button v-if="scope.row.state == 'todo'" type="danger" @click="withdraw(scope.row.id)">退稿</el-button>
            </template>
        </el-table-column>
    </el-table>
    <PostDialog :postDialog="postDialog" :postInfo="postInfo" />
</el-card>
<!-- 查看稿件的dialog -->
</template>

<script>
import {
    mapState
} from 'vuex'
import PostDialog from '@/components/dialogs/PostDialog.vue'
export default {
components:{
PostDialog
},
    data() {
        return {
            postDialog: {
                value:false
            },
            postInfo:{}
        }
    },
    computed: {
        ...mapState(['postList'])
    },
    methods: {
        show(info) {
            this.postDialog.value = true
            this.$http.get(`/api/getSelfPosts/${info.id}`).then(res => {
                if (res.status === 200) {
                    this.postInfo = res.data
                    // console.log(this.postInfo)
                }
            })
        },
        withdraw(id) {
            this.$confirm('退稿后稿件将保存在草稿箱,您确定要退稿吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                .then(() => {
                    // console.log('submit')
                    this.$http.delete(`/api/filesOp/withdraw/${id}`).then(res => {
                        if (res.data.status === 200) {
                            this.$message.success('退稿成功!')
                            this.$store.dispatch('asyncGetUploadDetails', this.$store.state.userInfo.username)
                        } else {
                            this.$message.error('退稿时出现错误!')
                        }
                    })
                })
                .catch(() => {
                    // console.log('test')
                })
        }
    }
}
</script>

<style scoped>
.postinfo {
    height: 30vh;
    overflow: auto;
}
</style>
