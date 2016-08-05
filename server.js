var express = require('express');
var app = express();
var log4js = require('log4js');
log4js.configure({
	appenders: [
		{ type: 'console' },{
			type: 'file',
			filename: 'logs',
			maxLogSize: 1024,
			backups:4,
			category: 'normal'
		}
	],
	replaceConsole: true
});
var logger = log4js.getLogger('normal');
logger.info('Cheese is Gouda.');
//var server = require('http').createServer(app);
var https=require('https');
var fs=require('fs');
var privatekey=fs.readFileSync('privatekey.pem');
var pc=fs.readFileSync('certificate.pem');
var options={
	key:privatekey,
	cert:pc
}
var server=https.createServer(options,app, function (req,res) {
	res.sendfile(__dirname + '/index.html');
})
var SkyRTC = require('skyrtc').listen(server);
var path = require("path");
console.log('process.env.PORT'+process.env.PORT);
logger.info('process.env.PORT'+process.env.PORT);
var port=process.env.PORT || 3000;
server.listen(port)
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
	res.sendfile(__dirname + '/index.html');
});

SkyRTC.rtc.on('new_connect', function(socket) {
	console.log('创建新连接');
});

SkyRTC.rtc.on('remove_peer', function(socketId) {
	console.log(socketId + "用户离开");
});

SkyRTC.rtc.on('new_peer', function(socket, room) {
	console.log("新用户" + socket.id + "加入房间" + room);
});

SkyRTC.rtc.on('socket_message', function(socket, msg) {
	console.log("接收到来自" + socket.id + "的新消息：" + msg);
});

SkyRTC.rtc.on('ice_candidate', function(socket, ice_candidate) {
	console.log("接收到来自" + socket.id + "的ICE Candidate");
});

SkyRTC.rtc.on('offer', function(socket, offer) {
	console.log("接收到来自" + socket.id + "的Offer");
});

SkyRTC.rtc.on('answer', function(socket, answer) {
	console.log("接收到来自" + socket.id + "的Answer");
});

SkyRTC.rtc.on('error', function(error) {
	console.log("发生错误：" + error.message);
});