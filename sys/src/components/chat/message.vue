<template>
<div class="message" >
    <!-- <el-button @click="test">test</el-button> -->
    <ul >
        <!-- {{correspond}}<br>
        {{sessions}} -->
        <!-- {{sessions}} -->
        {{correspond}}
        <li v-for="item in correspond" :key="item.id">
            <p class="time">
                <span>{{ item.senttime }}</span>
            </p>
             <div class="main" :class="{ self: item.self }">
                 <img class="avatar" :src="item.avatar?item.avatar:item.from_user" width="30" height="30"  /> <!--:src="item.self ? user.img : session.user.img" -->
                 <div class="text">{{ item.content }}</div><!-- -->
            </div>
        </li>
    </ul>
</div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
export default {
    props:['username'],
    computed:{
      ...mapState(['sessions','userlist']),
      ...mapGetters(['getterSessions']),
      correspond(){  //对应用户或自己发的
      let mid = this.getterSessions.filter(i=>(i.from_user == this.username && i.to_user == this.$store.state.userInfo.username)||(i.from_user == this.$store.state.userInfo.username &&i.to_user == this.username))
      mid.forEach(i=>{
          if(i.from_user == this.$store.state.userInfo.username){
              i.self = true
          }
      })
      return mid 
      // let receive = this.getterSessions.filter(i=>(i.from_user == this.username && i.to_user == this.$store.state.userInfo.username))
        // let send = this.getterSessions.filter(i=>(i.from_user == this.$store.state.userInfo.username &&i.to_user == this.username))
        // send.map(i=>i.self = true)
        // return [...send,...receive]
      }
    },
    methods: {
        test(){
            console.log(this.sessions)
            // console.log(this.userlist,this.getterSessions)
            // console.log(Boolean(this.sessions[0].from_user),this.sessions[0])
        }
    },
    created () {
        this.$on('sentUsername',data=>{
                console.log(data)
            })
    },

    directives: {
        // 发送消息后滚动到底部
        'scroll-bottom' () {
            this.vm.$nextTick(() => {
                this.el.scrollTop = this.el.scrollHeight - this.el.clientHeight;
            });
        }
    }
}
</script>
<style lang="less" scoped>
.message {
    padding: 10px 15px;
    overflow-y: scroll;
    ul{
        list-style: none;
    }
    li {
        margin-bottom: 15px;
    }
    .time {
        margin: 7px 0;
        text-align: center;
        > span {
            display: inline-block;
            padding: 0 18px;
            font-size: 12px;
            color: #fff;
            border-radius: 2px;
            background-color: #dcdcdc;
        }
    }
    .avatar {
        float: left;
        margin: 0 10px 0 0;
        border-radius: 3px;
    }
    .text {
        display: inline-block;
        position: relative;
        padding: 0 10px;
        max-width: ~'calc(100% - 40px)';
        min-height: 30px;
        line-height: 2.5;
        font-size: 12px;
        text-align: left;
        word-break: break-all;
        background-color: #fafafa;
        border-radius: 4px;
        &:before {
            content: " ";
            position: absolute;
            top: 9px;
            right: 100%;
            border: 6px solid transparent;
            border-right-color: #fafafa;
        }
    }
    .self {
        text-align: right;
        .avatar {
            float: right;
            margin: 0 0 0 10px;
        }
        .text {
            background-color: #b2e281;
            &:before {
                right: inherit;
                left: 100%;
                border-right-color: transparent;
                border-left-color: #b2e281;
            }
        }
    }
}
</style>