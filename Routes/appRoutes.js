var express = require('express')
var router = express.Router();
var User = require("../Models/userModel");

function isAuthenticated(req,res,next){
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

module.exports = function(passport) {

    router.get('/', function(req, res) {
        res.render('pages/home');
    });

    router.get('/profile', isAuthenticated, function(req, res) {
        res.send(req.user);
    });

    router.get('/create', function(req, res) {
        res.render('pages/createPoll');
    });

    router.get('/auth/google', passport.authenticate('google', {
        scope: ['profile', 'email']
    }));

    router.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect: '/profile',
            failureRedirect: '/'
        }));
    router.get('/delete',function(req,res){
      User.find({ id:333 }).remove().exec();
      res.send('done');
    })

    return router;
};
