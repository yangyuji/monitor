'use strict';

var myApp = angular.module('myApp', ['socket-io', 'highcharts-ng', 'ngRoute']);
myApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
    when('/', {
        templateUrl: '/partials/index.html',
        controller: 'MonitorCtl'
    }).
    when('/server/:serverid', {
        templateUrl: '/partials/index.html',
        controller: 'MonitorCtl'
    }).
    otherwise({
        redirectTo: '/'
    });
}]);