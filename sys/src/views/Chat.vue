<template>
<div id="topDiv">
    <!-- {{val}}
    <el-button @click="testClientEmit">testClientEmit</el-button>
    <el-button @click="testServertEmit">testServertEmit</el-button>
    <el-button @click="testClientOn">testClientOn</el-button> -->
    <div class="sidebar">
        <card />
        <list  @fromList="toMsg" />
        <!-- <el-input type="text" v-model="to"></el-input> -->
    </div>
    <div class="main">
        <message :username="username"/>
        <inputBox @sendMessage="testClientEmit" :username="username" />
       <!-- <el-button @click="test">test</el-button> -->
        <!-- <div class="text">
            <textarea placeholder="按 Ctrl + Enter 发送" v-model="content"></textarea>
        </div> -->
    </div>

</div>
</template>

<script>
import card from '../components/chat/card'
import list from '../components/chat/list'
import message from '../components/chat/message'
import inputBox from '../components/chat/inputBox'

export default {
    name: "Chat",
    components: {
        card,
        list,
        message,
        inputBox
    },
    created() {
        // this.initData();
        this.$store.dispatch('asyncGetUserList')
    },
    mounted() {
        this.$socket.emit('connect')
        this.$store.dispatch('asyncGetSessions',this.$store.state.userInfo.username)
    },
    data() {
        return {
            val: '',
            to: '',
            username:''
        }
    },
    sockets: {
       
    },
    methods: {
        testClientEmit(content) {
            // console.log(this.$socket.emit)
            let contentObj = {
                from: this.$store.state.userInfo.username,
                to: this.to,
                content: content,
                time: new Date()
            }
            this.$socket.emit('sendMsg', JSON.stringify(contentObj))
        },
        testServertEmit() {

        },
        testClientOn() {

        },
        dealWithScope() {

        },
        handleEdit(index, row) {
            console.log(index, row);
        },
        handleDelete(index, row) {
            console.log(index, row);
        },
        toMsg(username){
            this.username = username
            console.log(username)
        },
        test(){
            console.log(this.$store.state.userlist)
        }
    }
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
