import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

import {_} from 'vue-underscore'

// import { Message } from 'element-ui'

Vue.use(Vuex)

export default new Vuex.Store({
  state: localStorage.getItem("state") ? JSON.parse(localStorage.getItem("state")):{
    userInfo:'',
    to_username:'',
    menuList:[],
    draftList:[],
    postList:[],
    allPostList:[],
    announceList:[],
    postListTotal:0,
    comments:[],
    commentsNum:0,
    draftContentList:'',
    uploadInfo:'',
    sessions:localStorage.getItem('sessions') ?localStorage.getItem('sessions'):[],
    userlist:[],
    currentID:0,
    filterKey:''
  },
  mutations: {
    getUserInfo(state,userInfo){
     state.userInfo = userInfo
     state.currentID = userInfo.id
    },
    getList(state,data){
      state.menuList = data
    },
    getUploadInfo(state,uploadInfo){
      state.uploadInfo = uploadInfo[0]
     },
    getUploadDetails(state,postDetails){
       state.postList = postDetails;
    },
    getDraftList(state,draftList){
       state.draftList = draftList
     },
    getPostList(state,postList){
       state.allPostList = postList
      //  console.log(postList)
     },
    getListTotal(state,total){
        state.postListTotal = total
        // console.log(total)
     },
    draftContent(state,data){
      state.draftContentList = data
    },
    getCommentsNum(state,num){
     state.commentsNum = num
    },
    getComments(state,comments){
      state.comments = comments
    },
    overwriteInfo(state,data){  
       state.userInfo = Object.assign(state.userInfo,data)
      //  console.log(state.userInfo)
     },
    getUserList(state,data){
      state.userlist = data
    },
    getSessionList(state,data){
      state.sessions = data
      // console.log(state.sessions)
    },
    getAnnounceList(state,list){
      state.announceList = list
    },
    SELECT_SECTION(state,id){
      state.currentID = id 
    },
    SEND_MESSAGE(state,msgObj){
      if(state.userInfo.username == msgObj.from_user){ // 为了在receiveMsg里面复用
        msgObj.self = true  
      }
      state.sessions.push(msgObj)
    },
    SET_TO_USERNAME(state,username){
      state.to_username = username
      // console.log(state.to_username)
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
      asyncGetUploadInfo(context,username){
        // console.log(username)
        axios.get(`/api/getUploadInfo/${username}`).then(res=>{
          context.commit('getUploadInfo',res.data)
        })
      },
      asyncGetUploadDetails(context,username){
      axios.get(`/api/getUploadDetails/${username}`).then(res=>{
        context.commit('getUploadDetails',res.data)
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
          // console.log(res.data)
          context.commit('getDraftList',res.data)
        })
      },
      asyncGetContentByTitle(context,paramsObj){
        // console.log(paramsObj)
        if(paramsObj.id){
        axios.get(`/api/draft/getContent/${paramsObj.username}/${paramsObj.id}`).then(res=>{
          context.commit('draftContent',res.data)
          // console.log(res.data)
        })
        }
      },
      asyncGetExamineList(context,roleid){
        // console.log(roleid)
        axios.get(`/api/examine/getExamineList/${roleid}`).then(res=>{
          context.commit('getPostList',res.data.tableData)
          context.commit('getListTotal',res.data.total)
        })
      },
      commentsInsert(context,obj){
        axios.post('/api/examine/commentsInsert',obj).then(res=>{
          if(res.data.status === 200){
            console.log('Successfully Insert!')
          }else{
            console.log('Comment Failed!')
          }
        })
      },
      getComment(context,username){
        axios.get(`/api/examine/getComment/${username}`).then(res=>{
          if(res.status == 200){
            context.commit('getCommentsNum',res.data.length)
            context.commit('getComments',res.data)
          }
          // console.log(res)
        })
      },
      asyncGetUserList(context){
        axios.get(`/api/userlist`).then(res=>{
          context.commit('getUserList',res.data)
        })
      },
      asyncGetSessions(context,username){
        axios.get(`/api/sessionlist/${username}`).then(res=>{
          context.commit('getSessionList',res.data)
        })
      },
      asyncGetAnnounceList(context){
        axios.get(`/api/filesOp/announceList`).then(res=>{
          if(res.status == 200){
            context.commit('getAnnounceList',res.data)
          }
        })
      },
      inputSearch(context,value){
        context.commit('SET_FILTER_KEY',value)
      },

  },
  modules: {
  },
  getters:{
    filterList(state){
      // console.log(typeof state.userlist,state.userlist)
    return state.userlist.filter(i=>i.username!=state.userInfo.username)
    },
    unreadMsgs(state){
      return state.comments.filter(i=>i.done ==0).length
    },
    postNum(state){
      return state.postList.length
    },
    passNum(state){
      return state.postList.filter(i=>i.state=='passed').length
    },
    unpassNum(state){
      return state.postList.filter(i=>i.state=='unpassed').length
    },
    todoNum(state){
      return state.postList.filter(i=>i.state=='todo').length
    },
    getterSessions(state){
      // console.log(_.findWhere(state.userlist,{username}))
      state.sessions.forEach(i=>{
        // console.log(_.findWhere(state.userlist,{username:i.from_user}))
        let {avatar} = _.findWhere(state.userlist,{username:i.from_user})
        i.avatar =  avatar
      })
      return state.sessions
    }
  }
})


