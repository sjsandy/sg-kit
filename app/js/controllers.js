'use strict';

/* Controllers */

var sgApp = angular.module('sgApp', []);

sgApp.controller('styleGuide', ['$scope', function ($scope) {


    $scope.my_view = "views/view.html";
    $scope.cover = "views/cover.html";
    $scope.top_nav = "views/top-nav.html";
    $scope.features = "views/features.html";
    $scope.post = "views/post/preview.html";
    $scope.footer = "views/footer.html";
    $scope.comment = "views/footer.html";
    $scope.colors = ['aqua', 'blue', 'navy', 'teal', 'olive', 'lime', 'yellow', 'orange', 'red', 'fuchsia', 'purple', 'maroon', 'white', 'sliver', 'gray', 'darkgray', 'black'];
    $scope.sample_titles = ['A Sample Article', 'Another Sample Article', 'One More Sample title', 'Sample Article Number Four', 'One More For the Sake of it'];
    $scope.e = {
        'social': "views/elements/social.html",
        'author': "views/elements/author.html",
        'swatch': "views/elements/color-swatch.html",
        'subscribe': "views/elements/subscribe.html"
    };
    $scope.c = { //place yout components here
        'footer_copy': 'views/footer/social_copy.html',
        'post_preview': 'views/post/preview.html',
        'post_meta': 'views/post/post-meta.html',
        'post_preview_image': 'views/post/preview-image.html',
        'color_guide': 'views/sg/color-guide.html',
        'register': ''
    }
    $scope.settings = {
        'title': 'SG.Kit',
        'slug': 'A Feature Packed Style Guide Toolkit!'
    };

}]);

sgApp.controller('settingCtrl', ['$scope', '$http', function ($scope, $http) {
    //$scope.something ="something here";
    $http.get('data/sg.json').
        success(function (data, status, headers, config) {
            $scope.data = data.config;
            $scope.settings = $scope.data.settings;
            $scope.e = $scope.data.e;
            $scope.c = $scope.data.c;

        }).error(function (data, status, headers, config) {
            // $scope.error = "error loading http data ";
            console.log('ERROR connecting to http');
        });
}]);
