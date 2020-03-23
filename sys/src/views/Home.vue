<template>
<div class="background">
    <div class="container">
        <div class="span">
            <el-button type='text' @click='toggle1' :class="isActive?'active':''" style="color:#ccc;" :style="isActive?styleObj:''">Login</el-button>/ <el-button type='text' class='sign' @click='toggle2' :class="!isActive?'active':''" style="color:#ccc;" :style="!isActive?styleObj:''">Sign Up</el-button>
        </div>
        <div class="box">
            <Login v-if="isActive" />
            <Regis v-else @toggleChild="toggle1" />
        </div>
    </div>

</div>
</template>

<script>
import Login from '../components/Login'
import Regis from '../components/Regis'

export default {
    name: 'Home',
    components: {
        Login,
        Regis
    },
    data() {
        return {
            isActive: true,
            styleObj: {
                fontSize: '1.8rem',
                color: 'white'
            }
        }
    },
    methods: {
        toggle1() {
            this.isActive = true
        },
        toggle2() {
            this.isActive = false
        } //真的好吗?
    }
}
</script>

<style scoped>
body {
    margin: 0;
    padding: 0;
    height: 100vh;
}

.container {
    position: absolute;
    /* width: 70rem; */
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    background: rgba(0,0,0, 0.5);
    padding: 30px;

}

/* .panel {
    width: 30%;
    margin: 10rem 0 0;
    position: absolute;
    right: 0;
    top: 0;
    display: flex;
    justify-content: center;
} */

.el-form {
    position: relative;
    width: 12rem;
    margin: 2rem 0 0;
    /* margin-right:auto; */
}

.box {
    position: relative;
    height: 400px;
    width: 100%;
    margin-top:50px;
}

.background {
    background: url(../assets/back.jpeg) no-repeat;
    height: 100%;
    width: 100%;
    overflow: hidden;
    background-size: cover
}

/* .span{
  position: fixed;
} */
</style>
