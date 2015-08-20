//引入程序包
var express = require('express')
  , path = require('path')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  , worker = require('child_process')
  , favicon = require('serve-favicon')
  , logger = require('morgan')
  , cookieParser = require('cookie-parser')
  , bodyParser = require('body-parser');

//路由控制器
var routes = require('./routes/index');
app.use('/', routes);

//设置日志级别
// io.set('log level', 1); 
  
server.listen(4000, function(){
  console.log("Express server listening on port " + server.address().port);
});

//WebSocket连接监听
io.on('connection', function (socket) {
	
  //通知客户端已连接
  //socket.emit('open');

  // 打印握手信息
  console.log(socket.handshake);
  
  // 对message事件的监听
  socket.on('pingxi', function(msg){
	  console.log(msg);
	  socket.broadcast.emit('message', msg);
  });

  //监听出退事件
  socket.on('disconnect', function () {  
	 console.log('client disconnect...');
  });
});

/*
*express基本配置
*/

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/*
* error handlers
*/

// development error handler
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}
// production error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;


