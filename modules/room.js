'use strict';
var util = require('util');
function Room(id) {
	this.id = id;
	this.name = "";
	this.members = null;
	// Room type definition,
	// -1 == null, 0 == S, 1 == M, 2 == G
	this.type = -1;
	// 0 == out, 1 == in
	this.inRoomAppMember = {};
	this.inRoomWebMember = {};

	this.messageRecord = [];
	this.memberInitialMessageRecord = {};
	this.memberReadedMessageRecord = {};
}

Room.prototype.getRoomId = function() {
	return this.id;
}

Room.prototype.getRoomType = function() {
	return this.type;
}

Room.prototype.getMessageId = function() {
	var index = this.messageRecord.length - 1;
	// console.log("Room getMessageId DEBUG : index = " + index);
	if (index === -1)
		return 0;
	else {
		// console.log("Room getMessageId DEBUG : id " + this.messageRecord[index].getId() + 1);
		return this.messageRecord[index].getId() + 1;
	}
		
}

Room.prototype.setMember = function(members) {
	this.members = members;
	for (var i = 0 ; i < this.members.length; i++) {
		if (this.messageRecord.length === 0) {
			this.memberInitialMessageRecord[this.members[i]] = 0;
			this.memberReadedMessageRecord[this.members[i]] = 0;
		} else
			this.memberInitialMessageRecord[this.members[i]] = this.messageRecord.length - 1;
	}
}

Room.prototype.type = function(type) {
	this.type = type;
}

Room.prototype.addMember = function(userId) {
	this.members.push(memberId)
	if (this.messageRecord.length === 0)
		this.memberInitialMessageRecord[userId] = 0;
	else
		this.memberInitialMessageRecord[userId] = this.memberInitialMessageRecord - 1;
}

// Room.prototype.removeMember = function(memberId) {
// 	var index = -1;
// 	for(var i = 0; i < this.members.length; i++) {
// 		if (this.members[i].user_id == memberId) {
// 			index = i;
// 			break;
// 		}
// 	}
// 	this.members.remove(index);
// }

Room.prototype.getMemberMessageRecord = function(userId) {
	var messageRecord = [];
	for (var i = 0; i < this.members.length ; i++) {
		var id = this.members[i];
		// console.log('getMemberMessageRecord DEBUG : id = ' + id + ' length = ' + this.members.length);
		if (userId !== id) {
			var record = {};
			record['user_id'] = id;
			record['init_message_id'] = this.memberInitialMessageRecord[id];
			record['last_message_id'] = this.memberReadedMessageRecord[id];
			messageRecord.push(record);
		}
	}
	console.log('getMemberMessageRecord DEBUG : messageRecord : ' + util.inspect(messageRecord));
	return messageRecord;
}

Room.prototype.inRoomFromApp = function(userId) {

}

Room.prototype.inRoomFromWeb = function(userId) {

}

Room.prototype.addMessage = function(userId, message) {
	// console.log("Room addMessage DEBUG : message = " + message);
	this.messageRecord.push(message);
	this.memberReadedMessageRecord[userId] = message.getId();
	// console.log("Room addMessage DEBUG : messageRecord = " + this.messageRecord + " length = " + this.messageRecord.length);
}

Room.prototype.readedMessage = function(readerId, messageId) {

	var index = 0;
	if (typeof this.memberReadedMessageRecord[readerId] === 'undefined') {
		index = 0;
		this.memberReadedMessageRecord[readerId] = 0;
	} else 
		index = this.memberReadedMessageRecord[readerId] + 1;

	console.log("readedMessage DEBUG : index = " + index + " readerId = " + readerId + " , messageId = " + messageId);
	var record = [];
	for (index ; index <= messageId ; index++ ) {
		var message_id = this.messageRecord[index].getId();
		var sender_id = this.messageRecord[index].getSenderId();
		var sender_name = this.messageRecord[index].getSenderName();
		var time = this.messageRecord[index].getTime();
		var content = this.messageRecord[index].getContent();
		var id = this.messageRecord[index].getIndex();
		var count = this.messageRecord[index].readedCount(readerId, this.members.length);	

		record.push({"id": id,"message_id": message_id, "sender_id": sender_id, "sender_name": sender_name, "content": content,  "count": count, "time": time});
		// console.log("readedMessage DEBUG : record = " + util.inspect(record));
	}

	this.memberReadedMessageRecord[readerId] = messageId;
	return record;
	
}

Room.prototype.readedAllMessage = function(readerId) {
	var index = 0;
	if (typeof this.memberReadedMessageRecord[readerId] !== 'undefined')
		index = this.memberReadedMessageRecord[readerId] + 1;
	var end = this.messageRecord.length;
	var record = [];
	for (index ; index < end ; index++) {
		var message_id = this.messageRecord[index].getId();
		var sender_id = this.messageRecord[index].getSenderId();
		var sender_name = this.messageRecord[index].getSenderName();
		var time = this.messageRecord[index].getTime();
		var content = this.messageRecord[index].getContent();
		var id = this.messageRecord[index].getIndex();
		var count = this.messageRecord[index].readedCount(readerId, this.members.length);

		record.push({"id": id,"message_id": message_id, "sender_id": sender_id, "sender_name": sender_name, "content": content,  "count": count, "time": time});
	}

	this.memberReadedMessageRecord[readerId] = end;
	return record;
}

Room.prototype.toString = function() {
	return " room:{id : " + this.id + " , member : " + this.members + " , type : " + this.type + " , message_list : " + this.message_list + " }";
}

module.exports = Room;