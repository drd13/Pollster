var mongoose = require('mongoose');

var PollSchema = new mongoose.Schema({
  question:String,
  choice1:String,
  choice2:String,
  votes1: {type: Number, default:0} ,
  votes2: {type: Number, default:0}
});

mongoose.model("Poll", PollSchema);
