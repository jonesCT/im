var express = require('express');
var bodyParser = require('body-parser');
var app = express();


//controllers
var healthcheck = require('./app/controllers/healthcheck');
var group = require('./app/controllers/group');

app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.status(200).json({index:"IM API"});
});

app.get('/brad', function(req, res) {

	res.setHeader("Access-Control-Allow-Origin","*");
	res.sendFile(__dirname + '/chat.html');
});

app.get('/jones', function(req, res) {

	res.setHeader("Access-Control-Allow-Origin","*");
	res.sendFile(__dirname + '/chat1.html');
});

app.use('/healthcheck', healthcheck);
app.use('/group', group);

module.exports = app;


