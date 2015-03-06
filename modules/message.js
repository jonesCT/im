'use strict';
function Message(id, senderId, senderName, content, time, index) {
	this.id = id;
	this.senderId = senderId;
	this.senderName = senderName;
	this.content = content;
	this.readCount = 0;
	this.time = time;
	this.index = index;
	this.reader = {};
}

Message.prototype.getId = function() {
	return this.id;
}

Message.prototype.getSenderId = function() {
	return this.senderId;
}

Message.prototype.getSenderName = function() {
	return this.senderName;
}

Message.prototype.getContent = function() {
	return this.content;
}

Message.prototype.getTime = function() {
	return this.time;
}

Message.prototype.getIndex = function() {
	return this.index;
}

Message.prototype.readedCount = function(reader_id, member_num) {
	if (this.sender_id !== reader_id && (typeof this.reader[reader_id] === 'undefined') && (member_num - 1) !== this.read_count) {
		this.reader[reader_id] = true;
		this.readCount ++;
	}
		
	return this.readCount;
}

Message.prototype.toString = function() {
	return "{ id : " + this.id + " , sender_id : " + this.senderId + " , sender_name : " + this.senderName + " , content : " + this.content + " , time : " + this.time + " , read_count : " + this.readCount +  " , index : " + this.index +" }";
}

module.exports = Message;