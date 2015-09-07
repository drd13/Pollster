var express = require('express');
var router = express.Router();

//Import all the modules necessary
var mongoose = require('mongoose');
var Poll = mongoose.model('Poll');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.param('poll', function(req,res,next, id){
  //the fourth input of router.param is the :poll snippet
  //we ask to upvote by specifying a particular id in our put request, the middleware(router.param) takes this post request and adds the instance to req.post
  //to be passed to the put function which then operates on it
  console.log('inside param middleware');
  var query = Poll.findById(id);
  query.exec(function(err, poll){
    console.log('inside querry');
    if (err){ return next(err);}
    if (!poll) { return next(new Error('can\'t find post')); }
    //creates req.poll and assigns it the query result to be run by the next step of the request
    req.poll = poll;
    return next();
  });
});


//a route to upvote a poll. It returns a callback res.json(poll)
router.put('/polls/:poll/upvote1', function(req,res,next){
  console.log('inside upvote1 route');
  req.poll.upvote1(function(err, poll){
    if (err) { return next(err);}
    res.json(poll);
  });
});

router.put('/polls/:poll/upvote2', function(req, res, next){
  console.log('inside upvote2 route');
  req.poll.upvote2(function(err, poll){
    if (err) { return next(err);}
    res.json(poll);
  });
});

router.delete('/polls/:poll/delete', function(req, res, next){
  req.poll.remove(function(err){
    if (err) { return next(err);}
  });
  console.log('awomba its been deleted !!!');
  res.json('success');
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
