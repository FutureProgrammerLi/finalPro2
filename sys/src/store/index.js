import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import code from '../services/encrypt.js'
import { Message } from 'element-ui'
// import { Message } from 'element-ui'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo:''
  },
  mutations: {
    getUserInfo(state,userInfo){
     state.userInfo = userInfo
    }
  },
  actions: {

  },
  modules: {
  }
})
