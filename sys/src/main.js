import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from './store'
import axios from 'axios'
import router from './router'
import VueSocketio from 'vue-socket.io'
import socketio from 'socket.io-client'
import {Message} from 'element-ui'


Vue.use(ElementUI)
Vue.use(new VueSocketio({
  debug: true,
  connection: 'http://localhost:3001',
  vuex: {
    store,
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_'
  }
}))


Vue.config.productionTip = false;
Vue.prototype.$http = axios;
axios.interceptors.request.use(config => { //必须返回config这个对象,plugins里的都无效了??
  config.headers.Authorization = window.sessionStorage.getItem('token') //将token设置在请求头中
  return config
})
axios.interceptors.response.use((res) => {
  if(res.data.status == 403){
    router.push('/')
    Message.error('登录超时或没有权限!请重新登录')
    // console.log(router)
  }
  // console.log(router.push)
  return res
})
Vue.prototype.$message = ElementUI.Message;

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')