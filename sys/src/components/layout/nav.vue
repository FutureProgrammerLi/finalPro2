<template>
<div id="header">
    <div style="padding: 0 15px;" @click="toggleClick" id="toggleButton">
        <svg :class="{'is-active':isActive}" class="hamburger" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="64" height="64">
            <path d="M408 442h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm-8 204c0 4.4 3.6 8 8 8h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56zm504-486H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 632H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM142.4 642.1L298.7 519a8.84 8.84 0 0 0 0-13.9L142.4 381.9c-5.8-4.6-14.4-.5-14.4 6.9v246.3a8.9 8.9 0 0 0 14.4 7z" />
        </svg>
    </div>
    <el-breadcrumb separator-class="el-icon-arrow-right" >
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>活动管理</el-breadcrumb-item>
        <el-breadcrumb-item>活动列表</el-breadcrumb-item>
        <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div id="info">
        <span id="icon">
            <el-badge :value="1" class="item">
                <i class="el-icon-bell"></i>
            </el-badge>
        </span>

        <el-dropdown @command="goTo">
            <el-avatar>test</el-avatar> <!-- 头像src -->
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="item in $store.state.menuList" :key="item.id" :command="item.path">
                    {{item.authName}}
                </el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        Hi,{{$store.state.userInfo.username}}!
    </div>
    <!-- breadcrumb -->

</div>
</template>

<script>
export default {
    name: 'navi',
    data() {
        return {
            isActive: false
        }
    },
    methods: {
        toggleClick() {
            this.isActive = !this.isActive
            this.$emit('toggleWidthChild')
        },
        goTo(path) {
            this.$router.push(path)
        }
    },
    created() {
        this.$store.dispatch('asyncGetList')

    }
}
</script>

<style scoped>
.hamburger {
    display: inline-block;
    vertical-align: middle;
    width: 20px;
    height: 20px;
}

.hamburger.is-active {
    transform: rotate(180deg);
}

#toggleButton {
    display: inline;
}

#info {
    position: fixed;
    right: 0;
    top: 0;
}

#icon:hover {
    cursor: pointer;
}

#icon {
    padding-right: 20px;
}

#header {
    justify-content: center;
    align-items: center;
}
.el-breadcrumb{
  padding:10px;
}
</style>
