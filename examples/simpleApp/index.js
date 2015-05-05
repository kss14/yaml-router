var twig = require("twig");
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');

var app = express();

require('yaml-router')(app);

// view engine setup
app.set('views', __dirname + '/app/views');
app.set('view engine', 'twig');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var server = http.createServer(app);
server.listen(8080);