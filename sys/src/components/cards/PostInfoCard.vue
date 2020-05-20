<template>
<el-card shadow="hover" style="margin-top:10px;">
    <div slot="header">
        您的投稿情况:
    </div>
    <!-- <el-button @click="test">test</el-button> -->
    <el-row :gutter="12">
        <el-col :span="6">
            <el-card class="inner total" shadow="hover">
                总投件数<br>
                {{postNum}}
            </el-card>
        </el-col>
        <el-col :span="6">
            <el-card shadow="hover" class="inner passed">
                通过审核<br>
                {{passNum}}
            </el-card>
        </el-col>
        <el-col :span="6">
            <el-card shadow="hover" class="inner todo">
                正在审核<br>
                {{todoNum}}
            </el-card>
        </el-col>
        <el-col :span="6">
            <el-card shadow="hover" class="inner unpassed">
                未通过<br>
                {{unpassNum}}
            </el-card>
        </el-col>
    </el-row>
</el-card>
</template>

<script>
import {
    mapState,
    mapGetters
} from 'vuex'

export default {
computed: {
    ...mapGetters(['postNum', 'passNum', 'unpassNum', 'todoNum'])
},
}
</script>

<style  scoped>
.inner {
    text-align: center;
}

.total:hover {
    background-color: rgb(80, 124, 247);
}

.passed:hover {
    background-color: rgb(151, 240, 151);
}

.todo:hover {
    background-color: rgb(250, 217, 27);
}

.unpassed:hover {
    background-color: rgb(248, 37, 37);
}
</style>
