var twig = require("twig");
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');

var app = express();

//Include router-related middleware before yaml-router
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('yaml-router')(app);

// view engine setup
app.set('views', __dirname + '/app/views');
app.set('view engine', 'twig');

var server = http.createServer(app);
server.listen(8080);