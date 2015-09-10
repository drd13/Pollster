var mongoose = require('mongoose');

var PollSchema = new mongoose.Schema({
  question:String,
  choice1:String,
  choice2:String,
  votes1: {type: Number, default:0} ,
  votes2: {type: Number, default:0},
  //just added the comments to the schema this could  lead to errors !!
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});
PollSchema.methods.upvote1 = function(cb){
  //cb is what is returned by the callback of upvotes in the route in this case it is res.json(post);
    this.votes1 += 1;
    console.log('callback is ', cb);
    this.save(cb);

};
PollSchema.methods.upvote2 = function(cb){
  //cb is what is returned by the callback of upvotes in the route in this case it is res.json(post);
    this.votes2 += 1;
    console.log('callback is ', cb);
    this.save(cb);

};
mongoose.model("Poll", PollSchema);
