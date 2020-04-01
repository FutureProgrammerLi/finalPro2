import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

// import { Message } from 'element-ui'

Vue.use(Vuex)

export default new Vuex.Store({
  state: localStorage.getItem("state") ? JSON.parse(localStorage.getItem("state")):{
    userInfo:'',
    menuList:[],
    draftList:[],
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
     },
    getDraftList(state,draftList){
       state.draftList = draftList
     },
    overwriteInfo(state,data){
       state.userInfo = Object.assign(state.userInfo,data)
      //  console.log(state.userInfo)
     }
  },
  actions: {
    asyncGetUserInfo(context,username){
     axios.get('/api/users/query',{params:{
       username:username
     }}).then(res=>{
      //  console.log(res.data[0])
      context.commit('overwriteInfo',res.data[0])
     })
    },
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
      },
      asynUpdateRoleList(){
        axios.put('/api/users/updateRoleList').then(res=>{
          console.log(res)
        })
      },
      asyncGetDraftList(context,username){
        axios.get(`/api/draft/draftlist`,{params:{
          username:username
        }}).then(res=>{
          context.commit('getDraftList',res.data)
        })
      }
  },
  modules: {
  }
})


