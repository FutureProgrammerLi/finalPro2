var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mount = require('mount-routes')
var JwtUtil = require('./modules/token')


var indexRouter = require('./routes/index'); //怎么整合? mount
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

app.all('/api/*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, mytoken')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, Authorization')
  res.setHeader('Content-Type', 'application/json;charset=utf-8')
  res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With')
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  res.header('X-Powered-By', ' 3.2.1')
  if (req.method == 'OPTIONS') res.send(200)
  /*让options请求快速返回*/ else next()
})

//请求url除了/login(/regis,还没写)之外的,都要验证token
app.use(function (req,res,next){
  if(req.url != '/users/login' && req.url !='/users/regis' && req.url !='/users/checkIfExist'&& req.url!='/users/updateRoleList' ){
    let token = req.headers.authorization
    let jwt = new JwtUtil(token)
    let result = jwt.verifyToken()  //return了res
    // console.log(result)
    // console.log('1')
    if(result == 'err'){
      // console.log('2')
      // console.log(result)
      res.send({"status":"403","msg":"登录已过期或无权查看该页面"})
    }else{
      // console.log('3')
      next()
    }
  }
  else{
    // console.log('4')
    next()
  }
  })

  // app.use(function(req,res,next){
//   console.log('what')
//   console.log(req.url)
// })

  // 带路径的用法并且可以打印出路有表
mount(app, path.join(process.cwd(), '/routes'), true)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000,()=>{
  console.log('running...')
})

module.exports = app;
