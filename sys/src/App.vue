<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <router-view/>
  </div>
</template>

<script>
export default {
  sockets:{
     
  },
  methods: {
    saveState(){
      localStorage.setItem("state",JSON.stringify(this.$store.state)) //刷新后state也会被保存,存了再loaclStorage
    }
  },
  mounted() {
      window.addEventListener('unload',this.saveState)       
  }
}
</script>

<style>
html, body, #app{
    margin:0;
    padding:0;
    height:100%;
}


</style>
