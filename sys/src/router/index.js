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

export default router
