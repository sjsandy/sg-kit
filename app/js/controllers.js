'use strict';

/* Controllers */

var sgApp = angular.module('sgApp.controllers', []);

  sgApp.controller('styleGuide', ['$scope', function($scope) {

        $scope.my_view = "views/view.html";
        $scope.cover = "views/cover.html";
        $scope.top_nav = "views/top-nav.html";
        $scope.features = "views/features.html";
        $scope.post = "views/post.html";
        $scope.footer = "views/footer.html";
        $scope.elements = {
         'social': "views/elements/social.html"
      }
        $scope.settings= {
            'title': 'SG.Kit',
            'slug': 'A Feature Packed Style Guide Toolkit!'
        };

  }]);
  sgApp.controller('MyCtrl2', ['$scope', function($scope) {

  }]);
