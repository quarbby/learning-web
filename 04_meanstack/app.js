var app = angular.module('penguinNews', ['ui.router']);

app.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider){
        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: '/home.html',
                controller: 'MainCtrl'
            })
            .state('posts', {
                url: '/posts/{id}',
                templateUrl: '/posts.html',
                controller: 'PostsCtrl'
            });
        $urlRouterProvider.otherwise('home');
    }
]);

app.factory('posts', [function(){
    var o = {
        posts: []
    };
    return o;
}]);

app.controller('MainCtrl', [
   '$scope', 
   'posts',
   function($scope, posts) {
       $scope.posts = posts.posts;
        $scope.addPost = function(){
            if (!$scope.title || $scope.title === '') { return; }
            $scope.posts.push({
                title: $scope.title, 
                link: $scope.link,
                upvotes: 0,
                comments: [
                    {author: 'Joe', body: 'Cool post!', upvotes: 0},
                    {author: 'Bob', body: 'Cool dude', upvotes: 5}
                ]
            });
            
            $scope.title = '';
            $scope.link = '';
        };
        $scope.incrementUpvotes = function(post){
            post.upvotes += 1;
        };
   }
]);

app.controller('PostsCtrl', [
    '$scope',
    '$stateParams',
    'posts',
    function($scope, $stateParams, posts){
        $scope.post = posts.posts[$stateParams.id];
        $scope.addComment = function(){
          if ($scope.body === '') {return;}
          $scope.post.comments.push({
             body: $scope.body,
             author: 'user',
             upvotes: 0
          });
          $scope.body = '';
        };
        $scope.incrementUpvotes = function(comment){
            comment.upvotes += 1;
        };
    }
]);
