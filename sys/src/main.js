import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from './store'
import axios from 'axios'
import router from './router'

Vue.use(ElementUI)

Vue.config.productionTip = false;
Vue.prototype.$http = axios;
axios.interceptors.request.use(config=>{        //必须返回config这个对象,plugins里的都无效了??
  config.headers.Authorization = window.sessionStorage.getItem('token') //将token设置在请求头中
  return config
})
Vue.prototype.$message =ElementUI.Message;

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
