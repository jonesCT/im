'use strict';

var express = require('express');
var group = express.Router();
var uuid = require('node-uuid');

group.post('/create', function(req, res) {

	var data = req.body;
	console.log('created ' + data);
	res.status(200).json({index:data});
});

module.exports = group;