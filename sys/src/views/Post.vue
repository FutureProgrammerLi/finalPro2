<template>
<div id="topDiv" style="height:100%;">
    <h2 style="text-align:center;margin:0;padding-top:5px;line-height:5px;">填写投稿信息</h2>
    <el-card class="box-card">
        <div slot="header" class='title'>
            <span>稿件信息</span>
        </div>
        <el-form ref="contentFormRef" :model="contentForm" label-width="80px" class="contentForm">
            <el-form-item label="中文标题:">
                <el-input type="text" v-model="contentForm.title" style="width:70%"></el-input>
            </el-form-item>
            <el-form-item label="中文摘要:">
                <el-input type="textarea" v-model="contentForm.summary" :rows="4"></el-input>
            </el-form-item>
            <el-form-item label="英文摘要:">
                <el-input type="textarea" v-model="contentForm.summaryInEnglish" :rows="4"></el-input>
            </el-form-item>
            <el-form-item label="正文:" class="last">
                <el-input type="textarea" v-model="contentForm.content" :rows="7"></el-input>
            </el-form-item>
        </el-form>
        <div class='title' >作者信息</div>
        <el-form ref="infoFormRef" :model="infoForm" label-width="80px" :inline="true" style="margin-top:15px;">
                <el-form-item label="作者姓名:">
                    <el-input type="text" v-model="infoForm.name"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio-group v-model="infoForm.gender">
                        <el-radio label="男"></el-radio>
                        <el-radio label="女"></el-radio>
                    </el-radio-group>
                </el-form-item><br>
                <el-form-item label="电子邮箱:">
                    <el-input v-model="infoForm.email" maxlength="11"></el-input>
                </el-form-item>
                <el-form-item label="联系电话:">
                    <el-input v-model="infoForm.phone" maxlength="11"></el-input>
                </el-form-item><br>
                <el-form-item label="联系地址:" >
                    <el-input type="textarea" v-model="infoForm.address" autosize style="width:100%;" ></el-input>
                </el-form-item>
            </el-form>
            <div class="first title"> 上传文件</div>
            <div id="box">
               <input type="file" >
            </div>
        <!-- <el-form :inline="true" :model="infoForm" class="demo-form-inline">
            <el-form-item label="审批人">
                <el-input v-model="infoForm.phone" placeholder="审批人"></el-input>
            </el-form-item>
            <el-form-item label="活动区域">
                <el-select v-model="infoForm.address" placeholder="活动区域">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary">查询</el-button>
            </el-form-item>
        </el-form> -->
    </el-card>
</div>
</template>

<script>
export default {
    name: "Post",
    data() {
        return {
            contentForm: {
                title: '',
                summary: '',
                summaryInEnglish: '',
                content: ''
            },
            infoForm: {
                name: '',
                gender: '',
                email: '',
                phone: '',
                address: ''
            }
        }
    }
}
</script>

<style scoped>
#topDiv{
    margin:0;
    padding:0;
}
#box{
    text-align: center;
}
.el-card {
    margin: 20px;
    height: 100%;
}

.el-card::-webkit-scrollbar {
    width: 10px;
    height: 10px;
    /**/
}

.el-card::-webkit-scrollbar-track {
    border-radius: 2px;
}

.el-card::-webkit-scrollbar-thumb {
    background: #bfbfbf;
    border-radius: 10px;
}

/* .el-card::-webkit-scrollbar-thumb:hover{
  background: #bfbfbf;
} */
.el-card::-webkit-scrollbar-corner {
    background: #bfbfbf;
}

.last {
    padding-bottom: 20px;
    border-bottom: 2px solid rgba(235, 238, 245, 0.712);
}
.first{
    padding-top:20px;
    border-top:2px solid rgba(235, 238, 245, 0.712);
}
.title {
    font-weight: bold;
}

.el-textarea {
    width: 90%;
}

.el-card {
    overflow: auto;
}
</style>
