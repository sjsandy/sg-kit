'use strict';

/* Controllers */

var sgApp = angular.module('sgApp.controllers', []);

  sgApp.controller('styleGuide', ['$scope', function($scope) {

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
  sgApp.controller('MyCtrl2', ['$scope', function($scope) {

  }]);
