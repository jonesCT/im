'use strict';
function User(id, name) {

	this.id = id;
	this.name = name;
	this.room_list = {};
	this.is_online = false;
	this.in_room = null;

}


User.prototype.getId = function() {
	return this.id;
}

User.prototype.getName = function() {
	return this.name;
}


User.prototype.toString = function() {
	return "user:{ id : " + this.id + " , name : " + this.name + " , room_list : " + this.room_list + " , is_online : " + this.is_online + " , in_room : " + this.in_room + " }";
}

module.exports = User;