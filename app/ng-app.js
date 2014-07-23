/**
 * Created by shawn sandy on 3/19/14.
 * starter script for angular.js app
 */


function SettingsController ($scope){


    $scope.title = "Starter Kit";
    $scope.my_view = "views/view.html";
    $scope.settings= {
        'title': 'My page Title',
        'slug': 'The is a slug'
    };


}
