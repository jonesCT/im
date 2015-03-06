'use strict';

var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/', function(req, res) {
	var file = 'index.html';
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.sendFile(file, {root: path.join(__dirname, '../../healthcheck')});
});

router.get('/index.html', function(req, res) {
	var file = 'index.html';
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.sendFile(file, {root: path.join(__dirname, '../../healthcheck')});
});

module.exports = router;