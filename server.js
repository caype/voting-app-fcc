var express = require("express");
var favicon = require('serve-favicon');
var mongoose = require("mongoose");
var passport = require("passport");
var session = require('express-session');
var morgan  = require('morgan');
var cookieParser = require('cookie-parser');
var flash    = require('connect-flash');
const bodyParser = require('body-parser');

var app = new express();
app.use(favicon(__dirname + '/public/favicon.ico'));
app.set('view engine','ejs');
app.use(express.static(__dirname+'/public'));

require('./config/passport')(passport);

mongoose.connect("mongodb://chaya:admin@ds149207.mlab.com:49207/freecodecamplearn");
mongoose.Promise = global.Promise;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(session({
	secret: 'secretFCCsession',
	resave: true,
	saveUninitialized: true
}));
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(flash());

app.use(function(req, res, next) {
  res.locals.error_message = req.flash('error');
	res.locals.success_message = req.flash('success');
	res.locals.info_message = req.flash('info');
  next();
});

app.use(passport.initialize());
app.use(passport.session());

var port = process.env.PORT || 8080;

//routes

var appRoutes = require(__dirname+"/Routes/appRoutes")(passport);

app.use('/',appRoutes);

app.listen(port,  function () {
	console.log('Node.js listening on https://fcc-webapps-chayakrishnaprasad.c9users.io ');
});
