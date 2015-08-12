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


var getTrafficData = function(socket){
	
}
  
server.listen(4000, function(){
  console.log("Express server listening on port " + server.address().port);
});

//WebSocket连接监听
io.on('connection', function (socket) {
	
  //通知客户端已连接
  //socket.emit('open');

  // 打印握手信息
  // console.log(socket.handshake);

  setInterval(function(){
	var params = {  
		name: 'fscnc',  
		type: 'top' 
	};
    http_get('120.31.133.101', params, function(obj){
		socket.emit('top', obj);
	});
  },5000);
  
  setInterval(function(){
	var params = {  
		name: 'fscnc',  
		type: 'gen' 
	};
    http_get('120.31.133.101', params, function(obj){
		socket.emit('fscnc', { data: obj});
	});
	/*params = {  
		name: 'fstt',  
		type: 'gen' 
	};
    http_get('10.11.253.142', params, function(obj){
		socket.emit('fstt', { data: obj});
	});*/
	
	params = {  
		name: 'zscnc1',  
		type: 'gen' 
	};
    http_get('112.90.178.162', params, function(obj){
		socket.emit('zscnc1', { data: obj});
	});
	params = {  
		name: 'zscnc2',  
		type: 'gen' 
	};
    http_get('112.90.178.162', params, function(obj){
		socket.emit('zscnc2', { data: obj});
	});

	params = {  
		name: 'zstl1',  
		type: 'gen' 
	};
    http_get('121.201.99.181', params, function(obj){
		socket.emit('zstl1', { data: obj});
	});
	params = {  
		name: 'zstl2',  
		type: 'gen' 
	};
    http_get('121.201.99.181', params, function(obj){
		socket.emit('zstl2', { data: obj});
	});
	
	params = {  
		name: 'sdtl',  
		type: 'gen' 
	};
    http_get('113.105.248.114', params, function(obj){
		socket.emit('sdtl', { data: obj});
	});
	
	params = {  
		name: 'zqtl',  
		type: 'gen' 
	};
    http_get('61.143.222.50', params, function(obj){
		socket.emit('zqtl', { data: obj});
	});
	
	params = {  
		name: 'nbcnc',  
		type: 'gen' 
	};
    http_get('101.71.88.171', params, function(obj){
		socket.emit('nbcnc', { data: obj});
	});
	
	params = {  
		name: 'nbtl',  
		type: 'gen' 
	};
    http_get('115.238.185.13', params, function(obj){
		socket.emit('nbtl', { data: obj});
	});
	params = {  
		name: 'nbtl2',  
		type: 'gen' 
	};
    http_get('115.238.144.26', params, function(obj){
		socket.emit('nbtl2', { data: obj});
	});
	
	params = {  
		name: 'ecloud',  
		type: 'gen' 
	};
    http_get('121.201.60.70', params, function(obj){
		socket.emit('ecloud', { data: obj});
	});
  },5000);
  
  // 对message事件的监听
  socket.on('message', function(msg){
  });

  //监听出退事件
  socket.on('disconnect', function () {  
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

//uncomment after placing your favicon in /public
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

// error handlers

// development error handler
// will print stacktrace
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
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

//定时器，获取流量数据
var http_get = function(host, option, callback){
	var ret = {}; 
	var http = require('http');  
	var qs = require('querystring');  
	var data = option;
	/*{  
		name: 'fscnc',  
		type: 'top' 
	};//这是需要提交的数据  */
	var content = qs.stringify(data);  
	  
	var options = {  
		hostname: host,  
		port: 80,  
		path: '/detect.php?' + content,  
		method: 'GET'  
	};  
	  
	var req = http.request(options, function (res) {  
		//console.log('STATUS: ' + res.statusCode);  
		//console.log('HEADERS: ' + JSON.stringify(res.headers));  
		res.setEncoding('utf8');  
		res.on('data', function (chunk) {  
			//console.log('BODY: ' + chunk);  
			callback(chunk);
		});  
	});  
	  
	req.on('error', function (e) {  
		console.log('problem with request: ' + e.message);  
	});  
	  
	req.end();  
}

module.exports = app;


