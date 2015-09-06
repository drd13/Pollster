var app = angular.module('pollster',['ui.router']);

app.config(['$stateProvider','$urlRouterProvider', function($stateProvider, $urlRouterProvider){
  $stateProvider.state('home',
    {url:'/home',
    templateUrl:'/home.html',
    controller:'MainCtrl',
    //resolve is called as to not display page until the http request for the polls has been sent
    /*resolve: {
      //may not be working
      postPromise: ['polls', function(polls){
        return polls.getAll();
      }]
    }*/
  });
  $stateProvider.state('addPost',
    {url:'/create',
    templateUrl:'/addpost.html',
    controller:'SubmitCtrl'
  });

  $urlRouterProvider.otherwise('home');

}]);


app.controller('MainCtrl', ['$scope', 'polls', function($scope, polls){
  $scope.polls = polls.polls;

}]);

app.controller('SubmitCtrl',['$scope', 'polls', function($scope, polls){
  $scope.addPoll = function(){
    polls.polls.push({
      question:$scope.question,
      choice1:$scope.choice1,
      choice2:$scope.choice2,
      votes1:0,
      votes2:0,
    });
    console.log(polls.polls);
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
  //["Would you rather not drink water or not eat meat?", "Do you prefer Math or Litterature?", "What is your favorite country?"]};
  return item;
}]);
