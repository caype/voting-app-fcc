var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
  id:Schema.Types.ObjectId,
  FirstName:String,
  LastName:String,
  CreatedAt:Date
});

module.exports = mongoose.model('user',userSchema);
