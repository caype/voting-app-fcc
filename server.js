var express = require("express");
var mongoose = require("mongoose");
var passport = require("passport");
var session = require('express-session');

var app = new express();
app.set('view engine','ejs');
app.use('/public', express.static(__dirname + '/public'));
require('./config/passport')(passport);

mongoose.connect(process.env.MONGO_URI);
mongoose.Promise = global.Promise;

app.use(session({
	secret: 'secretFCCsession',
	resave: true,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

var port = process.env.PORT || 8080;

//routes

var open = require(__dirname+"/Routes/open")(passport);

app.use('/',open);

app.listen(port,  function () {
	console.log('Node.js listening on https://fcc-webapps-chayakrishnaprasad.c9users.io ');
});