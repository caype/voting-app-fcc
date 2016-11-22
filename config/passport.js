var googleplus = require("passport-google-plus").Strategy;
var User = require("../Models/userModel");
module.exports=function(passport){
    passport.serializeUser(function(user,done){
        done(null,user.id);
    });
    passport.deserializeUser(function(id,done){
        User.findById(id,function(err,foundUser){
            done(err,foundUser);
        });
    });
};
