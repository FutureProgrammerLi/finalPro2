<template>
<div class="text">
    <textarea placeholder="按 Ctrl + Enter 发送" v-model="content" @keyup="onKeyup"></textarea>
</div>
</template>
<script>
export default {
    props:['username'],
    data() {
        return {
            content: ''
        }
    },
    methods: {
        onKeyup (e) {
            if (e.ctrlKey && e.keyCode === 13 && this.content.length) {
                // this.sendMessage(this.content);
                this.$emit('sendMessage',this.content)
                this.$store.commit('SEND_MESSAGE',{
                    content:this.content,
                    from_user:this.$store.state.userInfo.username,  //自己的用户名
                    to_user:this.username,      //要发送到的用户名
                    senttime:new Date(),
                    avatar:this.$store.state.userInfo.avatar
                })
                this.content = '';
                // console.log(this.$store.state.sessions)
            }
            // console.log(this.username)
        },
        
    },
}
</script>
<style lang="less" scoped>
.text {
    height: 160px;
    border-top: solid 1px #ddd;
    textarea {
        padding: 10px;
        height: 100%;
        width: 100%;
        border: none;
        outline: none;
        font-family: "Micrsofot Yahei";
        resize: none;
    }
}
</style>