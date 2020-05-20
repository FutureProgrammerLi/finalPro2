<template>
<el-card class="announce-card">
    <el-table :data="announceList" stripe border style="width: 100%;overflow:hidden;" height="250">
        <el-table-column prop="title" label="公告标题" width="300">
        </el-table-column>
        <el-table-column prop="ptime" label="发布日期" align="center">
        </el-table-column>
        <el-table-column prop="publisher" label="发布者" align="center">
        </el-table-column>
        <el-table-column label="操作" align="right">
            <template slot-scope="scope">
                <el-button type="primary" @click="read(scope.row)">查看</el-button>
            </template>
        </el-table-column>
    </el-table>
</el-card>
</template>

<script>
import {
    mapState
} from 'vuex'
export default {
    // props:{
    //     annouceList:{
    //         type:Object
    //     }
    // },
    computed: {
        ...mapState(['announceList'])
    },
    methods: {
        read(info) {
            this.$router.push({
                name: 'ShowAnnounce',
                params: info
            })
        }
    }
}
</script>

<style scoped>

</style>
