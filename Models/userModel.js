var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
  id:Schema.ObjectId,
  OAuthId:String,
  token:String,
  email:String,
  Name:String,
  CreatedAt:Date
});

module.exports = mongoose.model('votingapp-user',userSchema);
