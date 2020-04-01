<template>
<el-form ref="contentFormRef" :model="contentForm" label-width="100px" class="contentForm" :rules="rules">
    <el-form-item label="中文标题:" prop="title">
        <el-input id="inputfocus" type="text" v-model="contentForm.title" style="width:70%" placeholder="请输入不多于15字的中文标题" maxlength="15"></el-input>
    </el-form-item>
    <el-form-item label="中文摘要:" prop="summary">
        <el-input type="textarea" v-model="contentForm.summary" :rows="4" placeholder="请输入不多于30字的中文摘要" maxlength="30"></el-input>
    </el-form-item>
    <el-form-item label="英文摘要:" prop="summaryInEnglish">
        <el-input type="textarea" v-model="contentForm.summaryInEnglish" :rows="4" placeholder="请输入不多于50字的英文摘要"></el-input>
    </el-form-item>
    <el-form-item label="正文:" class="last" prop="content">
        <el-input id="contentfocus" type="textarea" v-model="contentForm.content" :rows="7" placeholder="请输入正文部分,建议不多于2000字或直接上传文件"></el-input>
    </el-form-item>
    <!-- <el-button @click="test">test</el-button> -->
</el-form>
</template>

<script>
export default {
    name: "ContentForm",
    data() {
        return {
            contentForm: {
                title: '',
                summary: '',
                summaryInEnglish: '',
                content: ''
            },
            rules: {
                title: [{
                    required: true,
                    message: '请输入标题',
                    trigger: 'blur'
                }]
            }
        }
    },
    methods: {
        test() {
            console.log(this.$refs['contentFormRef'])
        }
    },
    mounted(){
        this.$emit('getContentRef',this.$refs['contentFormRef'])
    }
}
</script>
