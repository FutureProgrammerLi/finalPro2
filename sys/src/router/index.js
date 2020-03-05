import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'



Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path:'/welcome',
    name:'Welcome',
    component:()=>import('../views/Welcome.vue'),
    children:[
      {
        path:'/home',
        name:'Info',
        component:()=>import('../views/Info.vue')
      },
      {
        path:'/post',
        name:'Post',
        component:()=>import('../views/Post.vue')
      },
      {
        path:'/draft',
        name:'Draft',
        component:()=>import('../views/Draft.vue')
      },
      {
        path:'/help',
        name:'Help',
        component:()=>import('../views/Help.vue')
      }
    ]
  },
  
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.       //lazy-loaded?
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to,from,next)=>{     //简易判断是否带有token,没有实际verify
  if(to.path ==='/') return next()  //后台会再校验一次 server/users里面
  const tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr)  return next('/')
  next()
})

router.beforeEach((to,from,next)=>{    //退出登录
  if(to.path ==='/exit'){
    window.sessionStorage.clear()
    return next('/')
  }
  next()
})

export default router
