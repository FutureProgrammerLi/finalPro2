<template>
<div>
    <div class="container">
        <div class="pannel">
            <div class="span">
                <el-button type='text' @click='toggle' :class="isActive?'active':''" style="color:#ccc;" :style="isActive?styleObj:''">Login</el-button>/ <el-button type='text' class='sign' @click='toggle' :class="!isActive?'active':''" style="color:#ccc;" :style="!isActive?styleObj:''">Sign Up</el-button>
            </div>
            <Login  v-if="isActive" />
            <Regis v-else @toggleChild="toggle" />
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
            styleObj:{
              fontSize:'1.4rem',
              color:'#409EFF'
            }
        }
    },
    methods: {
        toggle() {
            this.isActive = !this.isActive
        },
        
    }
}
</script>

<style>
body {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.container {
    position: relative;
    width: 70rem;
}

.panel {
    width: 30%;
    margin: 10rem 0 0;
    position: absolute;
    right: 0;
    top: 0;
    display: flex;
    justify-content: center;
}

.el-form {
    width: 30rem;
    margin: 3rem 0 0;
}
/* .span{
  font-size: 1.4rem!important;
  color:#ccc;
} */

</style>
