var mongodb = require('./db');

function Message(message) {
	this.toUser = message.toUser;
	this.fromUser = message.fromUser;
	this.content = message.message;
	this.time = message.time;
	this.isNew = message.isNew;
}

module.exports = Message;

Message.prototype.save = function save(callback) {
	var message = {
		toUser: this.toUser,
		fromUser: this.fromUser,
		content: this.content,
		time: this.time	,
		isNew: this.isNew
	};
	mongodb.open( function(err, db) {
		if (err) {
			return callback(err);
		}
		//读取 messages 集合
		db.collection('messages', function(err, collection) {
			if(err) {
				mongodb.close();
				return callback(err);
			}

			collection.insert(message, {safe: true}, function(err, user) {
				mongodb.close();
				callback(err, user);
			});
		});
	});
}

Message.getHistory = function getHistory(fromUsername, toUsername, callback) {
	mongodb.open(function(err, db) {
		if(err)
			return callback(err);
		//读取 messages 集合
		db.collection('messages', function(err, collection) {
			if(err) {
				mongodb.close();
				return callback(err);
			}
			//根据收发消息的 username 查询文档

			//console.log('mongodb fromUser: ' + fromUsername);
			//collection.find({fromUser: Number(fromUsername), toUser: Number(toUsername)}).toArray(function(err, docs) {
			
			//找出两用户对话的所有条目并已时间升序排列
			collection.find({'$or':[{fromUser: Number(fromUsername), toUser: Number(toUsername)},{fromUser: Number(toUsername), toUser: Number(fromUsername)}], isNew: false}).sort({time: 1}).toArray(function(err, docs) {	
				console.log(docs);
				mongodb.close();
				return callback(err, docs);
			});

			/*
			collection.find(function(error, cursor){
				cursor.each(function(error, doc){
					if(doc != null && doc.fromUser == fromUsername){
						console.log(doc);
					}
				});
			});
			*/

		});
	});
}

Message.getNew = function getNew(fromUsername, toUsername, callback) {
	mongodb.open(function(err, db) {
		if(err)
			return callback(err);
		//读取 messages 集合
		db.collection('messages', function(err, collection) {
			if(err) {
				mongodb.close();
				return callback(err);
			}
			//根据收发消息的 username 查询文档

			//console.log('mongodb fromUser: ' + fromUsername);
			//collection.find({fromUser: Number(fromUsername), toUser: Number(toUsername)}).toArray(function(err, docs) {
			
			//找出两用户对话的所有条目并以时间升序排列
			collection.find({'$or':[{fromUser: Number(fromUsername), toUser: Number(toUsername)},{fromUser: Number(toUsername), toUser: Number(fromUsername)}], isNew: true}).sort({time: 1}).toArray(function(err, docs) {	
				console.log(docs);
				mongodb.close();
				return callback(err, docs);
			});

			/*
			collection.find(function(error, cursor){
				cursor.each(function(error, doc){
					if(doc != null && doc.fromUser == fromUsername){
						console.log(doc);
					}
				});
			});
			*/

		});
	});
}

Message.setHistory = function setHistory(userName, callback) {
	mongodb.open(function(err, db) {
		if(err)
			return callback(err);
		//读取 messages 集合

		var collection = db.collection('messages');

		collection.update({'$or':[{fromUser: Number(userName)}, {toUser: Number(userName)}], isNew: true}, {$set:{isNew: false}}, {safe:true, multi:true}, function(err, result){
			console.log(result);
			mongodb.close();
			return callback(err);
		});

/*
		db.collection('messages', function(err, collection) {
			if(err) {
				mongodb.close();
				return callback(err);
			}


			
			//找出两用户对话的所有条目并已时间升序排列
			//collection.update({'$or':[{fromUser: Number(userName)},{toUser: Number(fromUsername)}], isNew: true},{$set:{isNew: 'zhen'}}, false, true);

			//collection.find({'$or':[{fromUser: Number(userName)},{toUser: Number(fromUsername)}], isNew: true}).sort({time: 1}).toArray(function(err, docs) {	
			//	console.log(docs);
			//	mongodb.close();
			//	return callback(err, docs);
			//});
		});
*/
	});
}