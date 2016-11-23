var express = require('express')
var router = express.Router()

module.exports = function(passport){

    router.get('/', function (req, res) {
      res.render('pages/home');
    });

    router.get('/create',function(req,res){
      res.render('pages/createPoll');
    })

    return router;
};
