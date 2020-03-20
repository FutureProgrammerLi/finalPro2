import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

// import { Message } from 'element-ui'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo:'',
    menuList:[],
    uploadInfo:''
  },
  mutations: {
    getUserInfo(state,userInfo){
     state.userInfo = userInfo
    },
    getList(state,data){
      state.menuList = data
    },
    getUploadInfo(state,uploadInfo){
      state.uploadInfo = uploadInfo[0]
     }
  },
  actions: {
    asyncGetList(context,roleid){
      if(roleid != undefined){     //不判断会发送两次,有一次是undefined
        // console.log(roleid)
        axios.get(`/api/getList/${roleid}`).then(res=>{
          context.commit('getList',res.data)
        })
      }
      },
      asyncGetUpload(context,username){
        // console.log(username)
        axios.get(`/api/getUploadInfo/${username}`).then(res=>{
          context.commit('getUploadInfo',res.data)
        })
      }
  },
  modules: {
  }
})


