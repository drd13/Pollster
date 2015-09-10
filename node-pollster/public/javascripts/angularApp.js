var app = angular.module('pollster',['ui.router']);

app.config(['$stateProvider','$urlRouterProvider', function($stateProvider, $urlRouterProvider){
  $stateProvider.state('home',
    {url:'/home',
    templateUrl:'/home.html',
    controller:'MainCtrl',

    //resolve is called as to not display page until the http request for the polls has been sent
    resolve: {
      //may not be working
      postPromise: ['polls', function(polls){
        return polls.getAll();
      }]
    }
  });

  $stateProvider.state('addPost',
    {url:'/create',
    templateUrl:'/addpost.html',
    controller:'SubmitCtrl'
  });

  $stateProvider.state('comment',
    {url:'/comment/{id}',
    templateUrl:'/comment.html',
    controller:'CommentCtrl',
    resolve: {
      poll: ['$stateParams','polls', function($stateParams, polls){
        //id is a state param because of comment/{id}
        console.log($stateParams.id);
        return polls.get($stateParams.id);
      }]
    }
  });

  //$urlRouterProvider.otherwise('home');

}]);


app.controller('MainCtrl', ['$scope', 'polls', function($scope, polls){
  $scope.polls = polls.polls;
  $scope.upvote2 = function(poll){
    polls.upvote2(poll);
  };
  $scope.upvote1 = function(poll){
    polls.upvote1(poll);
  };
  $scope.delete = function(poll){
    polls.delete(poll);
  };
}]);

app.controller('SubmitCtrl',['$scope', 'polls', function($scope, polls){
  $scope.addPoll = function(){
    if(!$scope.question || $scope.choice1 === '' || $scope.choice2 ==='') { return; }
    data = {
      question:$scope.question,
      choice1:$scope.choice1,
      choice2:$scope.choice2
    };
    polls.create(data);
    $scope.question = '';
    $scope.choice1 = '';
    $scope.choice2 = '';
  };

}]);

app.controller('CommentCtrl', ['$scope', 'polls', 'poll', function($scope, polls, poll){
  //not sure if it is necessary to import the whole of $scope.polls
  $scope.poll = poll;

  $scope.addComment = function(){
    if(!$scope.comment){return;}
    data = {
      author:$scope.author,
      body:$scope.comment,
    };
    polls.addComment(poll, data).then(function(res){
      console.log('data is', res.data);
      $scope.poll.comments.push(res.data);
    });
    $scope.author = '';
    $scope.comment ='';
  };

  $scope.deleteComment = function(poll,comment){
    polls.deleteComment(poll, comment).then(function(res){
      //filter removes item that has been deleted by matching the id past as a res from the request to the $scope item
      $scope.poll.comments = $scope.poll.comments.filter(function(comment){
        console.log((comment._id !== res.data._id));
        return (comment._id !== res.data._id);
      });
    });
  };

}]);


app.factory('polls',['$http',function($http){
  var item = {polls:[
    {question:"Would you rather not drink water or not eat meat?",
    choice1:'na',
    choice2:'na',
    votes1:0,
    votes2:0,},
    {question:"Do you prefer Math or Litterature?",
    choice1:'na',
    choice2:'na',
    votes1:0,
    votes2:0,}
  ]};
  item.getAll = function(){
    //need to put data in the database for the callback to do something
    return $http.get('/polls').success(function(data){
      angular.copy(data, item.polls);
    });
  };
  item.get = function(id){
    return $http.get('/polls/'+id).then(function(res){
      item.getAll();
      return res.data;
    });
  };
  item.create = function(poll){
    return $http.post('/polls',poll).success(function(data){
      //because or post request returns the item as a response we can directly add it to the item dictionary
      item.polls.push(data);
    });
  };
  item.upvote1 = function(poll){
    return $http.put('polls/'+poll._id+'/upvote1').success(function(data){
      poll.votes1+=1;
    });
  };
  item.upvote2 = function(poll){
    return $http.put('polls/'+poll._id+'/upvote2').success(function(data){
      poll.votes2+=1;
    });
  };
  item.addComment = function(poll, comment){
    return $http.post('polls/'+poll._id, comment);
  };

  item.delete = function(poll){
    return $http.delete('polls/'+poll._id+'/delete').success(function(){
      console.log('yay');
      item.getAll();
    });
  };

  item.deleteComment = function(poll, comment){
    return $http.delete('polls/'+ poll._id + '/delete/' + comment._id);
  };

  //["Would you rather not drink water or not eat meat?", "Do you prefer Math or Litterature?", "What is your favorite country?"]};
  return item;
}]);
