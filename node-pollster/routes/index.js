var express = require('express');
var router = express.Router();

//Import all the modules necessary
var mongoose = require('mongoose');
var Poll = mongoose.model('Poll');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/polls', function(req, res, next) {
  Poll.find(function(err, polls){
    if(err) { return next(err);}
    res.json(polls);
  });
});

router.post('/polls', function(req, res, next){
  //To use this route I need to make a post http request with the information for the scheema in the body
  var poll = new Poll(req.body);
  //I save the document created with the model by calling save
  poll.save(function(err, poll){
    if(err){ return next(err);}

    //not sure exactly why we send a response, I guess just to doublecheck
    res.json(poll);
  });


});

module.exports = router;
