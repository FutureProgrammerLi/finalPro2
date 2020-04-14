<template>
<div>
    {{val}}
    <el-button @click="testClientEmit">testClientEmit</el-button>
    <el-button @click="testServertEmit">testServertEmit</el-button>
    <el-button @click="testClientOn">testClientOn</el-button>
</div>
</template>

<script>
export default {
    name: "Announce",

    data() {
        return {
            val: '',
            id:''
        }
    },
    sockets: {
        connect() {
            console.log('连接成功')
            this.id = this.$socket.id
            // console.log(this.id)
        },
        progress() {
            console.log('FiredByServer')
        }
    },
    // mounted(){
    //   this.$socket.emit('connect')
    // },hMWomMLYrO-cv2V9AAAA
    methods: {
        testClientEmit() {
            // console.log(this.$socket.emit)
            this.$socket.emit('hello', 1)
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
        }
    }
}
</script>
