var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
  author:String,
  body:String,
  poll: { type: mongoose.Schema.Types.ObjectId, ref: 'Poll' }
});

mongoose.model('Comment', CommentSchema);
