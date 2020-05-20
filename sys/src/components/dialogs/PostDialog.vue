<template>
<el-dialog :visible.sync="postDialog.value" width="40%" title="投稿信息">
        <el-form :model="postInfo" label-width="80px" id="postInfoForm">
            <el-form-item label="标题:">
                <el-input v-model="postInfo.title" readonly></el-input>
            </el-form-item>
            <el-form-item label="摘要:">
                <el-input readonly v-model="postInfo.summary"></el-input>
            </el-form-item>
            <el-form-item label="英文摘要:">
                <el-input readonly v-model="postInfo.summaryInEnglish"></el-input>
            </el-form-item>
            <el-form-item label="正文:">
                <el-input readonly type="textarea" :row="8" v-model="postInfo.content"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="postDialog.value = false">返 回</el-button>
            <!-- postDialog.value = false -->
        </span>
    </el-dialog>
</template>

<script>
    export default {
        props:{
            postDialog:{
                type:Object,
                required:true
            },
            postInfo:{
                type:Object
            }
        },
        methods: {
            test() {
                console.log(this.postInfo)
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>