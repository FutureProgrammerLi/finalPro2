<template>
<div>
    <el-container>
        <el-aside :width="isCollapse?'64px':'200px'">
            <el-scrollbar wrap-class="scrollbar-wrapper">
                <div id="topic"> 在线投稿系统</div>
                <el-menu class="el-menu-vertical-demo" default-active="/info" :collapse="isCollapse" :unique-opened="true" :collapse-transition="false" router>
                    <el-menu-item :index="item.path" v-for="item in $store.state.menuList" :key="item.id">
                        <i :class="iconObj[item.authName]"></i>
                        <span slot="title"> {{item.authName}}</span>
                    </el-menu-item>
                    
                    <!-- <el-menu-item index="2">       //Thanks demo
                        <i class="el-icon-menu"></i>
                        <span slot="title">导航二</span>
                    </el-menu-item> -->
                </el-menu>
                <!-- <el-button @click="test">test</el-button> -->
            </el-scrollbar>
        </el-aside>
  
        <el-container >
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
import obj from '../services/routes'
import { mapState } from 'vuex'
export default {
    name:'Welcome',
    components: {
        navi,
        myFooter
    },
    data() {
        return {
            isCollapse: false,
            iconObj: {      //毫无可复用性..
                '个人主页': 'el-icon-s-home',
                '我要投稿': 'el-icon-edit-outline',
                '草稿箱': 'el-icon-notebook-2',
                '我要帮助': 'el-icon-help',
                '退出': 'el-icon-back',
                '发布公告':'el-icon-mic',
                '审稿':'el-icon-view',
                '消息管理':'el-icon-message',
                '好友聊天':'el-icon-chat-dot-round'
            },
            routeMenu:[],
            roleid:'',
        }
    },
    methods: {
        toggleWidthParent() {
            this.isCollapse = !this.isCollapse
            let topic = document.getElementById('topic')
            this.isCollapse?topic.style.display = "none":topic.style.display ='block'
        },
        test(){
           console.log(this.$store.state.comments,this.$store.state.commentsNum)
        }
    },
    computed:{
        ...mapState(['sessions','userInfo','userlist','to_username'])
    },
    sockets: {
        connect() {
            console.log('连接成功')
        },
        receiveMsg(res) {
            // console.log(res.avatar)
            // console.log(this.userInfo.username)
            // if(res.from == this.to_username){
            //     res.avatar = this.userInfo.avatar
            //     console.log(this.userInfo.avatar)
            // }

            // if(res.from == this.to_username){//由list传来的username,就是to_user
            
            //     this.userlist.forEach(i=>{   //?逻辑复杂
            //         if(i.username == res.from){
            //             res.avatar = i.avatar
            //             console.log(i)
            //         }
            //     })
            // }  
            this.sessions.push(res)
            console.log(this.sessions)
        }
    },
    created() {
        this.$store.dispatch('asyncGetList',this.$store.state.userInfo.roleid)
        this.$store.dispatch('getComment',this.$store.state.userInfo.username)
    },
    mounted(){
        this.$socket.emit('regis',this.$store.state.userInfo.username)
        
    }
    
    
}
</script>

<style scoped>
div,
.el-container {
    height: 100%;
}

/* .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
} */
.el-main{
    overflow: auto;
    background-color: rgb(187, 247, 255);
    height:auto;
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
