import store from '../store/index.js' 
store.dispatch('asyncGetList')
var userinfo = store.state.userInfo
var menu = store.state.menuList

function dealRoutes(){
    // console.log(store.state.menuList)
    if(userinfo.id != 2){
        console.log('test')
        menu.splice(1,1)
        console.log(menu)
    }else{
        console.log('do nothing')
    }
return menu
}
var result = dealRoutes


