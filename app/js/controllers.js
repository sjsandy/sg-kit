'use strict';

/* Controllers */

angular.module('sgApp.controllers', [])
  .controller('styleGuide', ['$scope', function($scope) {

        $scope.title = "Starter Kit";
        $scope.my_view = "views/view.html";
        $scope.cover = "views/header-cover.html";
        $scope.top_nav = "views/top-nav.html";
        $scope.post= "views/post.html";
        $scope.settings= {
            'title': 'Starter Kit',
            'slug': 'A Feature Packed Barebones Start Theme!'
        };

  }])
  .controller('MyCtrl2', ['$scope', function($scope) {

  }]);
