var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require("../Models/userModel");
var configAuth = require('./keys');

module.exports = function(passport) {

  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
  });

    passport.use(new GoogleStrategy({
      clientID: configAuth.gplus.ClientID,
      clientSecret: configAuth.gplus.ClientSecret,
      callbackURL: configAuth.gplus.callbackURL
      },function(token, refreshToken, profile, done){
        process.nextTick(function(){
          User.findOne({ 'google.id' : profile.id }, function(err, user) {
            if (err)
                return done(err);

            if (user) {
                return done(null, user);
            }else{
              var newInsertedUser = new User({
                OAuthId    : profile.id,
                token : token,
                name  : profile.displayName,
                email : profile.emails[0].value
              });

              // save the user
              newInsertedUser.save(function(err) {
                  if (err)
                      throw err;
                  console.log(newInsertedUser);
                  return done(null, newInsertedUser);
              });
            }
          })
        })
    }));
};
