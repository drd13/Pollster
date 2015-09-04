var app = angular.module('pollster',['ui.router']);

app.config(['$stateProvider','$urlRouterProvider', function($stateProvider, $urlRouterProvider){
  $stateProvider.state('home',
    {url:'/home',
    templateUrl:'/home.html',
    controller:'MainCtrl'
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

app.factory('polls',[function(){
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
  //["Would you rather not drink water or not eat meat?", "Do you prefer Math or Litterature?", "What is your favorite country?"]};
  return item;
}]);
