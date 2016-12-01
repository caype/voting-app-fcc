var express = require('express')
var router = express.Router();
var User = require("../Models/userModel");
var Poll = require("../Models/pollModel");
var GraphColors=["#2196f3", "#2ecc71", "#9b59b6", "#34495e", "#16a085", "#27ae60", "#2980b9", "#8e44ad", "#2c3e50", "#f1c40f", "#e67e22", "#e74c3c", "#ecf0f1", "#95a5a6", "#f39c12", "#d35400", "#c0392b", "#bdc3c7", "#7f8c8d"];

function isAuthenticated(req,res,next){
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

module.exports = function(passport) {

    router.get('/logoff',function(req,res){
      req.logout();
      res.redirect('/');
    });

    router.get('/myPolls',isAuthenticated,function(req,res){
      Poll.find({"createdById":req.user._id}, null, {sort: {'_id': -1}},function(err,foundRecords) {
        res.render('pages/myPollList',{userPolls:foundRecords,user:req.isAuthenticated()?req.user:null});
      });
    });

    router.get('/delete:id',function(req,res){
      console.log(req.body);
      res.send('reached');
    })
    
    router.get('/', function(req, res) {
        res.render('pages/home',{user:req.isAuthenticated()?req.user:null});
    });

    router.get('/profile', isAuthenticated, function(req, res) {
        res.send(req.user);
    });

    router.post('/create',isAuthenticated,function(req,res){
      var receivedPollData = req.body;
      var PollsToArray = receivedPollData.options.map(function(CurrentPoll,index){
        return {option:CurrentPoll,count:0,color:GraphColors[index]}
      });
      Poll.findOne({"description":receivedPollData.name},function(err,foundPoll){
        if(err) throw err;
        if(foundPoll){
          res.send(JSON.stringify(foundPoll));
        }else{
          var curDate = new Date();
          var newPoll = new Poll({
            description:receivedPollData.name,
            poll:PollsToArray,
            createdData:curDate,
            createdById:req.user._id
          });
          newPoll.save(function(err,savedPoll){
              if(err)  throw(err);
              res.send(JSON.stringify(savedPoll));
          });
        }
      })
    });

    router.post('/updatePoll',isAuthenticated,function(req,res){
      var receivedUpdatedPollData = req.body;
      Poll.findOne({_id:receivedUpdatedPollData._id},function(err,foundPollData){
        foundPollData.poll = receivedUpdatedPollData.poll;
        foundPollData.save(function(err){
          res.send(JSON.stringify(foundPollData));
        });
      });
    });

    router.get('/create',isAuthenticated,function(req, res) {
        res.render('pages/createPoll',{user:req.isAuthenticated()?req.user:null});
    });

    router.get('/auth/google', passport.authenticate('google', {
      scope: [ 'https://www.googleapis.com/auth/userinfo.email',
               'https://www.googleapis.com/auth/userinfo.profile']
    }));

    router.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect: '/profile',
            failureRedirect: '/'
    }));

    router.get('/auth/twitter', passport.authenticate('twitter'));

    router.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));

    router.get('/delete',function(req,res){
      User.find({}).remove().exec();
      res.send('done');
    });

    return router;
};
