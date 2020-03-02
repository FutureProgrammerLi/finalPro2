<template>
<div class="decorate">
    <el-scrollbar wrap-class="scrollbar-wrapper">
        <el-menu :unique-opened="false" :collapse-transition="false" mode="vertical">
            <el-menu-item>1</el-menu-item>
            <el-menu-item>2</el-menu-item>
            <el-menu-item>3</el-menu-item>
            <el-menu-item>4</el-menu-item>
            <el-menu-item>5</el-menu-item>
            <el-menu-item>6</el-menu-item>
            <el-menu-item>7</el-menu-item>
            <el-menu-item>8</el-menu-item>
            <el-menu-item>9</el-menu-item>
            <el-menu-item>0</el-menu-item>
            <el-menu-item>99</el-menu-item>
            <el-menu-item>88</el-menu-item>
            <el-menu-item>66</el-menu-item>
            <el-menu-item>11</el-menu-item>
        </el-menu>
    </el-scrollbar>
</div>
</template>

<script>
export default {
name:'sidebar'
}
</script>

<style >
.scrollbar-wrapper {
    overflow-x: hidden !important;
}

.el-scrollbar {
    height: 100%;
}
</style>
