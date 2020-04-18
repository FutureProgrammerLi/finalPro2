<template>
<div id="topDIV">
    <el-card class="box-card">
        <el-form :model="details" label-width="100px">
            <el-form-item label="公告标题" prop="title">
                <el-input v-model="details.title" readonly></el-input>
            </el-form-item>
            <el-form-item label="公告内容" prop="content">
                <el-input v-model="details.content" type="textarea" :rows="20" readonly></el-input>
            </el-form-item>
        </el-form>
        <el-button type="primary" @click="back">返回</el-button>
        <!-- <el-button @click="test">test</el-button> -->
    </el-card>
</div>
</template>

<script>
export default {
    name: 'ShowAnnounce',
    data() {
        return {
            details: ''
        }
    },
    methods: {
        test() {
            console.log(this.details)
        },
        back(){
            this.$router.push('/info')
        }
    },
    created() {
        this.details = this.$route.params
        console.log(this.$route.params);
    },
}
</script>

<style lang="less" scoped>
#topDIV{
    position: relative;
    width:50%;
    top:50%;
    left:50%;
    transform: translate(-50%,-50%);
}
.el-button {
    margin-left: 50%;
    text-align: center;
}
</style>
