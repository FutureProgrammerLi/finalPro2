<template>
<div>
    <el-container>
        <!-- <el-row>
            <el-col :span="5"> -->
        <!--sidebar要设置自适应,全展示=>仅剩图标=>全消失  -->

        <el-aside :width="isCollapse?'64px':'200px'">
            <el-scrollbar wrap-class="scrollbar-wrapper">
                <el-menu :unique-opened="false" :collapse-transition="false" mode="vertical" router >
                    <!-- <el-submenu v-for="item in $store.state.menuList" :key="item.id" :index="item.path" >
               <template slot="title">
                   <span> {{item.authName}}</span>
               </template>
           </el-submenu> -->
                    <el-menu-item v-for="item in $store.state.menuList" :key="item.id" :index="item.path" >
                        <template slot="title">
                            <span>{{item.authName}}</span>
                        </template>
                    </el-menu-item>
                </el-menu>

            </el-scrollbar>
        </el-aside>
        <!-- </el-col>
            <el-col :span="19"> -->
        <!-- <navbar />
            <app-main /> -->
        <el-container>
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

        <!-- </el-col>
        </el-row> -->
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
            isCollapse: false
        }
    },
    methods: {
        toggleWidthParent() {
            this.isCollapse = !this.isCollapse
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

.scrollbar-wrapper {
    overflow-x: hidden !important;
}

.el-scrollbar {
    height: 100%;
}
</style>
