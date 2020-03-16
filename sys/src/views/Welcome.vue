<template>
<div>
    <el-container>
        <!-- <el-row>
            <el-col :span="5"> -->
        <!--sidebar要设置自适应,全展示=>仅剩图标=>全消失  -->

        <el-aside :width="isCollapse?'64px':'200px'">
            <el-scrollbar wrap-class="scrollbar-wrapper">
                <div id="topic"> 在线投稿系统</div>
                <el-menu class="el-menu-vertical-demo" default-active="/home" :collapse="isCollapse" :unique-opened="true" :collapse-transition="false" router>
                    <el-menu-item :index="item.path" v-for="item in $store.state.menuList" :key="item.id">
                        <i :class="iconObj[item.id]"></i>
                        <span slot="title"> {{item.authName}}</span>
                    </el-menu-item>
                    <!-- <el-menu-item index="2">       //Thanks demo
                        <i class="el-icon-menu"></i>
                        <span slot="title">导航二</span>
                    </el-menu-item> -->
                </el-menu>
            </el-scrollbar>
        </el-aside>
        <!-- </el-col>
            <el-col :span="19"> -->
        <!-- <navbar />
            <app-main /> -->
        <el-container style="height:500%;">
            <el-header>
                <navi @toggleWidthChild="toggleWidthParent" />
            </el-header>
            <el-main>
                <router-view />
            </el-main>
            <el-footer>
                <myFooter />
            </el-footer>
        </el-container>
    </el-container>
</div>
</template>

<script>
import navi from '../components/layout/nav'
import myFooter from '../components/layout/myFooter'
export default {
    components: {
        navi,
        myFooter
    },
    data() {
        return {
            isCollapse: false,
            iconObj: {
                '1': 'el-icon-user',
                '2': 'el-icon-edit-outline',
                '3': 'el-icon-notebook-2',
                '4': 'el-icon-help',
                '5': 'el-icon-back'
            }
        }
    },
    methods: {
        toggleWidthParent() {
            this.isCollapse = !this.isCollapse
            let topic = document.getElementById('topic')
            this.isCollapse?topic.style.display = "none":topic.style.display ='block'
        }
    },
    created() {
        this.$store.dispatch('asyncGetList')
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

/deep/.el-scrollbar__wrap {
    overflow: hidden;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
}
#topic{
    margin:40px 0;
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    color:rgb(76, 243, 187)
}
</style>
