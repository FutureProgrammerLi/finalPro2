<template>
<div class="list">
    <ul>
        <li v-for="item in filterList" :key="item.id" :class="{ active: item.id === currentID }" @click="selectSession(item.id,item.username)">
            <img class="avatar" width="30" height="30" :alt="item.avatar" :src="item.avatar">
            <p class="name">{{item.username}}</p>
        </li>
    </ul>
    <!-- <el-button @click="test">test</el-button> -->
</div>
</template>

<script>
import {
    mapState,
    mapGetters
} from 'vuex'
export default {
    computed: {
        ...mapState(['currentID', 'userlist']),
        ...mapGetters(['filterList'])
    },
    vuex: {
        getters: {
            currentID: ({
                currentID
            }) => currentID
        }
    },

    methods: {
        selectSession(id, username) {
            this.$store.commit('SELECT_SECTION', id) //设置currentID = id
            // console.log(id, username)
            this.$emit('fromList',username)//传给message组件
            // console.log(this.currentID,id)
            //DONE
        },

        test() {
            console.log(this.filterList)
        }
    },
}
</script>

<style lang="less" scoped>
.list {
    li {
        padding: 12px 15px;
        border-bottom: 1px solid #292C33;
        cursor: pointer;
        transition: background-color .1s;

        &:hover {
            background-color: rgba(255, 255, 255, 0.03);
        }

        &.active {
            background-color: rgba(255, 255, 255, 0.1);
        }
    }

    .avatar,
    .name {
        vertical-align: middle;
    }

    .avatar {
        border-radius: 2px;
    }

    .name {
        display: inline-block;
        margin: 0 0 0 15px;
    }
}
</style>
