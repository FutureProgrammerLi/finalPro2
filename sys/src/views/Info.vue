<template>
<div id="top" style="height:100%;overflow:auto;">
    <!-- 信息卡片 -->

    <UserCard />

    <!-- 投稿信息卡片,将对应dialog也放进去 -->
    <PostInfoCard />
    <!-- 投稿详情卡片 -->
    <PostDetailCard />

    <!-- 公告卡片 -->
    <AnnounceCard />

    <!-- 修改密码的弹窗 -->

    <!-- 修改资料的dialog -->

    <!-- <el-dialog :visible.sync="postDialog" width="40%" title="投稿信息">
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
            <el-button @click="postDialog = false">返 回</el-button>
        </span>
    </el-dialog> -->
</div>
</template>

<script>
import {
    mapState,
    mapGetters
} from 'vuex'
import code from '../services/encrypt'
import UserCard from '@/components/cards/UserCard'
import PostInfoCard from '@/components/cards/PostInfoCard.vue'
import PostDetailCard from '@/components/cards/PostDetailCard.vue'
import AnnounceCard from '@/components/cards/AnnounceCard.vue'
export default {
    name: 'Info',
    components: {
        UserCard,
        PostInfoCard,
        PostDetailCard,
        AnnounceCard
    },
    data() {
        return {
            username: this.$store.state.userInfo.username, //用处不明
        }
    },
    methods: {
        test() {
            console.log(this.announceList) //为什么是个数组? dispatch的问题吗?
        },
    },
    computed: {
        ...mapState(['userInfo', 'uploadInfo', 'postList', 'announceList']),
    },
    created() {
        this.$store.dispatch('asyncGetUploadInfo', this.$store.state.userInfo.username)
        this.$store.dispatch('asyncGetUploadDetails', this.$store.state.userInfo.username)
        this.$store.dispatch('asyncGetAnnounceList');
    }
}
</script>

<style scoped>
#top {
    height: auto;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden !important;
}

.el-card {
    overflow: auto;
}

.el-card::-webkit-scrollbar {
    width: 10px;
    height: 10px;
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

.announce-card {
    margin-top: 10px;
}

.postinfo {
    height: 30vh;
    overflow: auto;
}

#postInfoForm.input {
    width: 50%;
}
</style>
