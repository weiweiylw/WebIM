var express = require('express');
var crypto = require('crypto');
var User = require('../models/user.js')
var Message = require('../models/message.js')

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'WebIM' });
});

router.get('/reg', function(req, res, next) {
  res.render('reg', { title: 'Register' });
});

//用户注册
router.post('/reg', function(req, res, next) {

	console.log(" Reg Posted");

	//检验用户两次输入的口令是否一致
	if (req.body['password'] != req.body['confirmPassword']) {
		console.log("password did not match!");
		res.send({msg: '两次输入的口令不一致！'});
		return;
	}

  //生成口令的散列值
  var md5 = crypto.createHash('md5');
  var password = md5.update(req.body.password).digest('base64');
  var newUser = new User({
  	name: req.body.nickname,
  	password: password,
  });
  //检查用户名是否已经存在
  User.get(newUser.name, function(err, user) {
  	if (user)
  		err = 'Username already exists.';
  	if (err) {
  		res.send({msg: '该昵称已存在，请更改。'});
  		return;
  	}
	  //如果不存在则新增用户
	  newUser.save( function(err) {
	  	if (err) {
	  		res.send({msg: err});
	  		return;
	  	}
	  	console.log("Reg success!");
	 	//req.session.user = newUser;
	 	res.send({msg: '注册成功！', reged: true});
	  });
	});
})

//用户登录
router.post('/login', function(req, res) {
	
  console.log("Login posted");
  //生成口令的散列值
  var md5 = crypto.createHash('md5');
  var username = req.body.nickname;
  var password = md5.update(req.body.password).digest('base64');
  User.get(username, function(err, user) {
 	if (!user) {
 		res.send({msg: '用户不存在！'});
 		return;
 	}
 	if (user.password != password) {
 		res.send({msg: '口令错误！'});
 		return;
 	}
 	console.log(username);
 	//req.session.user = user;
 	res.send({msg: '登录成功！', username: username, logined: true});
 });
});

//用户注销
router.get('/logout', function(req, res) {
	//req.session.user = null;
	res.send({msg: '注销成功！'});
});

//进入聊天
router.get('/chat', function(req, res, next) {
  res.render('chat', { title: 'Chat', username: req.query.username});
});

//获取用户的历史消息
router.post('/getHistoryMsg', function(req, res, next) {
	var fromUser = req.body['fromUsername'],
		toUser = req.body['toUsername'];

	console.log('getHisMsg:' + fromUser + ' ' + toUser);

	Message.getHistory(fromUser, toUser, function(err, messages) {
		if (err) {
			console.log('Get Message Error!');
			return;
		}
		//console.log(messages);
		res.send({hisMsgs: messages});
	});
});

//获取新消息
router.post('/getNewMsg', function(req, res, next) {
	var fromUser = req.body['fromUsername'],
		toUser = req.body['toUsername'];

	console.log('getNewMsg:' + fromUser + ' ' + toUser);

	Message.getNew(fromUser, toUser, function(err, messages) {
		if (err) {
			console.log('Get Message Error!');
			return;
		}
		//console.log(messages);
		res.send({newMsgs: messages});
	});
});

module.exports = router;