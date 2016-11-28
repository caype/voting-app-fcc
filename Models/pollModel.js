var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var objectID = Schema.ObjectId;

var pollSchema = new Schema({
    id: objectID,
    description: String,
    poll:[],
    createdData: Date
});

module.exports = mongoose.model('poll', pollSchema);
