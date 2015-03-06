'use strict';

var app = require('../app');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var Room = require('../modules/room');
var User = require('../modules/user');
var Message = require('../modules/message');
var util = require('util');

var DEBUG = true;

server.listen('8080', function() {
	console.log('Server start listening on port ' + server.address().port);
});

var rooms = {};
var people = {};

io.use(function(socket, next) {
	var token = socket.handshake.query.token;
	var userId = socket.handshake.query.user_id;
	var userName = socket.handshake.query.user_name;
	socket.handshake.query.authorization = false;



	if (typeof token !== 'undefined' && typeof userId !== 'undefined' && typeof userName !== 'undefined') {
		if (token === '00000000') {
			socket.handshake.query.authorization = true;
			next();	
		} else {
			next();	
		}
	} else {
		console.log('Authorization failure');
		next();
	}	

});


io.sockets.on('connection', function(socket) {
	var authorization = socket.handshake.query.authorization;
	if (authorization) {
		// var userAgent = socket.handshake.headers.user-agent;
		var userId = socket.handshake.query.user_id;
		var userName = socket.handshake.query.user_name;
		var joinSuccess = false;
		var connected = false;
		var roomId = null;
		var user = null;
		var room = null;

		if (DEBUG)
			console.log("A user connected "  + userName);

		// Check, is people exits in cache
		if (typeof people[userId] ==! 'undefined') {
			user = people[userId];
		} else {
			// get people data from db.
			user = new User(userId, userName);
			people[userId] = user;
		}


		socket.emit('connected', {'status': 'connection success'});
		connected = true;

		socket.on('joinRoom', function(data) {


			roomId = data.room_id;
			

			if (typeof roomId !== 'undefined') {
				if (DEBUG)
					console.log('joinRoom have room, roomId = ' + roomId);

				// Check, is room exits in cache.
				if (typeof rooms[roomId] !== 'undefined') {
					// get room data from cache.
					if (DEBUG)
						console.log('joinRoom have room, get room from cache');
					
					room = rooms[roomId];

				} else {
					// get room data from db.
					if (DEBUG)
						console.log('joinRoom have room, get room from db');
					room = new Room(roomId);
					rooms[roomId] = room;
				}

			} else if (typeof data.receiver_id !== 'undefined' && typeof data.receiver_name !== 'undefined') {

				if (DEBUG)
					console.log('joinRoom have not room, but have receiver_id and receiver_name');

				var receiverId = data.receiver_id;
				var receiverName = data.receiver_name;
				

				// To Do, check receiverId exits.
				// ...
				// ...

				// if (DEBUG)
					// console.log('joinRoom room does not exits but have receiverId, receiverName');	

				var members = [userId, receiverId].sort();
				roomId = "s_" + members.join("");

				if (typeof rooms[roomId] !== 'undefined')
					room = rooms[roomId];
				else {
					room = new Room(roomId);
					room.setMember(members);
					room.type = "0";	
					rooms[roomId] = room;
				}


			
			} else {
				console.log('joinRoom failure, because here did not roomId or receiverId or receiverName');
			}
		

			if (typeof room !== 'undefined')
				console.log(room.toString());
			
			if (typeof roomId !== 'undefined') {
				if (DEBUG)
					console.log(userName + " enter " + roomId + " room ");
				joinSuccess = true;
				var readedMessgeList = room.readedAllMessage(userId);
				var messageListRecord = room.getMemberMessageRecord(userId);
				socket.emit('successJoinRoom', {"message_list_record": readedMessgeList});
				io.sockets.in(roomId).emit('updateReadedMessage', {"readed_message_list": readedMessgeList});
				socket.join(roomId);
				
			}
			
		});

		socket.on('sendMessage', function(data) {

			// var message = data.message;
			// var sender_id = data.sender_id;
			// var sender_name = data.sender_name;
			// var time = data.time;

			if (DEBUG) {
				console.log("sendMessage DEBUG: id = " + data.id + " , content = " + data.content + " , time = " + data.time + " , roomId = "+ roomId);
			}
			if (joinSuccess) {

				// TODO: Need to push notification if another people was disconnected.

				if (typeof data.time !== 'undefined') {

						var message = null;

					if (typeof room !== 'undefined') {
						var messageId = room.getMessageId();
						message = new Message(messageId, userId, userName, data.content, data.time, data.id);
						room.addMessage(userId, message);
					} else {
						console.log('sendMessage room undefined');
					}

					// console.log(message.toString());
					io.sockets.in(roomId).emit("receiveMessage", {"id": data.id, "message_id" : messageId, "sender_id": userId , "sender_name": userName, "time": data.time, "content" : data.content});

				} else {
					socket.emit('sendMessageFailure', {"error_code": "0"});
				}
			}

		});

		socket.on('readMessage', function(data) {
			if (DEBUG)
				console.log("readMessage DEBUG: message_id = " + data.message_id);

			var readedMessageList = room.readedMessage(userId, data.message_id);
			io.sockets.in(roomId).emit("updateReadedMessage", {"readed_message_list": readedMessageList});
		});

		

		socket.on('leaveRoom', function() {
			console.log(userName + ' leave room ');
			socket.disconnect();
		});

		socket.on('disconnect', function(data) {
			console.log(userName + ' disconnect');
		});

	} else {
		socket.emit('authorizationFailure', {'error':'error'});
		socket.disconnect();
	}
	
});