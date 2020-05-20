<template>
<div id="topDiv">
    <div class="sidebar">
        <card />
        <list @fromList="toMsg" />
    </div>
    <div class="main">
        <keep-alive>
            <message :username="username" />
        </keep-alive>
        <inputBox @sendMessage="testClientEmit" :username="username" />
    </div>
</div>
</template>

<script>
import card from '../components/chat/card'
import list from '../components/chat/list'
import message from '../components/chat/message'
import inputBox from '../components/chat/inputBox'
import a from '../services/GetDate'
import {
    mapState,
    mapGetters
} from 'vuex'

export default {
    name: "Chat",
    components: {
        card,
        list,
        message,
        inputBox
    },
    data() {
        return {
            val: '',
            to: '',
            username: ''
        }
    },
    created() {
        this.$store.dispatch('asyncGetUserList')
        this.$store.dispatch('getComment', this.$store.state.userInfo.username)
        this.$socket.emit('regis', this.$store.state.userInfo.username)
    },
    mounted() {
        this.$socket.emit('connect')
        this.$store.dispatch('asyncGetSessions', this.userInfo.username)
    },

    computed: {
        ...mapState(['sessions', 'userInfo']),
    },
    methods: {
        testClientEmit(content) {
            // console.log(this.$socket.emit)
            let contentObj = {
                from_user: this.$store.state.userInfo.username,
                to_user: this.to,
                content: content,
                senttime: a.getDate(),
                avatar: this.$store.state.userInfo.avatar
            }
            this.$socket.emit('sendMsg', JSON.stringify(contentObj))
        },
        toMsg(username) {
            this.to = username
            this.username = username
        },
        beforeDestroy() {
            sessionStorage.setItem('sessions', this.sessions)
        }  
    },
        sockets: {
        connect() {
            console.log('连接成功')
        },
        receiveMsg(res) {
            this.sessions.push(res)
        }
    },
}
</script>

<style lang="less" scoped>
#topDiv {
    margin: 20px auto;
    width: 800px;
    height: 600px;
    overflow: hidden;
    border-radius: 3px;

    .sidebar,
    .main {
        height: 100%;
    }

    .sidebar {
        float: left;
        width: 200px;
        color: #f4f4f4;
        background-color: #2e3238;
    }

    .main {
        position: relative;
        overflow: hidden;
        background-color: #eee;
    }

    .text {
        position: absolute;
        width: 100%;
        bottom: 0;
        left: 0;
    }

    .message {
        height: ~'calc(100% - 160px)';
    }

}

/* #topDiv {
    position: relative;
}

.chatbox {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60%;
    height: 70%;
}

.box {
    height: 30%;
}

.info,
.search {
    padding-left: 20px;
}

.info {
    padding-top: 10px;
}

.search {
    margin-top: 70px;
}

.sidebar {
    float: left;
    width: 30%;
    height: 100%;
    background-color: rgb(42, 51, 60);
    color: white;
}

.rightSide {
    margin-left: 30%;
    width: 70%;
    height: 100%;
}

.msgbox {
    height: 80%;
    background-color: rgb(154, 191, 226);
}

.inputbox {
    height: 20%;
    background-color: #fff;
} */
</style>
