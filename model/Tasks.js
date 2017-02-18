//create model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tasksSchema = new Schema({
    title: String,
    isDone: Boolean
});

var Tasks = mongoose.model("tasks", tasksSchema);
module.exports = Tasks;