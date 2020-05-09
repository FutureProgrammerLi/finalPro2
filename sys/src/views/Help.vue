<template>
<div id="top">
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <h2 style="padding:0;">投稿须知</h2>
        </div>
        <div>
            <p>1、登陆 </p>
            <p>投稿系统的登录地址是http://xxxx.xxxxx.com 大家可以利用现有的网站账号登录投稿系统（图1）。</p>
            <img src="../assets/login.png" alt="登录图片">
            <p> 如果还没有账号，可以点击Sign Up 按钮http://xxxx.xxxxx.com 注册一个属于自己的账号。（图2）</p>
            <img src="../assets/regis.png" alt="注册图片">
            <p>2、投稿</p>
            <p> 点击左侧菜单栏->我要投稿->根据提示填写对应信息即可完成投稿
            <img src="../assets/post.png" alt="投稿图片">
            <p>3、稿件处理</p>
            <p>在个人主页里可以查看自己的投稿情况,有查看稿件及退稿功能.</p>
            <p>如果稿件通过审核,则由审核人员进一步处理;当稿件审核不通过时,系统会将稿件返回到草稿箱中</p>
            <p>每份稿件被审核后,都会有对应的审核信息,可以在左侧导航栏的消息管理中查看</p>
            <img src="../assets/msg.png" alt="消息管理">
            <p>4、实时聊天</p>
            <p>点击好友聊天,可以与网站的其它用户进行留言操作或实时聊天.</p>
            <img src="../assets/chat.png" alt="聊天图片">
        </div>
    </el-card>
</div>
</template>

<script>
export default {
    name: "Help"
}
</script>

<style scoped>
#top{
    overflow: auto;
}

.el-card{
    overflow:auto;
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

.el-card::-webkit-scrollbar-corner {
    background: #bfbfbf;
}
</style>
