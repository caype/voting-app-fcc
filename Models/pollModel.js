var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var objectID = Schema.ObjectId;

var pollSchema = new Schema({
    id: objectID,
    uniqueId:Number,
    description: String,
    poll:[],
    createdData: Date,
    createdById:String,
    AuthVoters:[],
    NonAuthVoters:[]
});

module.exports = mongoose.model('poll', pollSchema);
