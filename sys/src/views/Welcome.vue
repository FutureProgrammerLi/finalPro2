<template>
<div>
    <el-container>
        <!-- <el-row>
            <el-col :span="5"> -->
        <!--sidebar要设置自适应,全展示=>仅剩图标=>全消失  -->

        <el-aside width="200px">
            <sidebar />
        </el-aside>
        <!-- </el-col>
            <el-col :span="19"> -->
        <!-- <navbar />
            <app-main /> -->
        <el-container>
            <el-header>
                <navi />
            </el-header>
            <el-main>
                <router-view />
            </el-main>
        </el-container>

        <!-- </el-col>
        </el-row> -->
    </el-container>
</div>
</template>

<script>
import sidebar from '../components/layout/sidebar'
import navi from '../components/layout/nav'
export default {
    components: {
        sidebar,
        navi
    }
}
</script>

<style scoped>
div,
.el-container {
    height: 100%;
}
/* 
.el-header {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
} */

/* .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
} */

.el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
}

body>.el-container {
    margin-bottom: 40px;
}
</style>
