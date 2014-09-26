'use strict';
// services
var services = angular.module('services',[]);

// controllers
var controllers = angular.module('controllers',[]);

// directives
var directives = angular.module('directives',[]);

// dependencies
var app = angular.module('leaderboard',['ngRoute', 'ngAnimate', 'ngCookies', 'services', 'controllers', 'directives']); 


// routes
app.config(['$routeProvider',
  function($routeProvider) {
	$routeProvider.
	when('/leaderboard', {
	    templateUrl: 'views/leaderboard.tpl.html',
	    controller: 'leaderboardController'
	})
	.when('/evolution', {
	    templateUrl: 'views/evolution.tpl.html',
	    controller: 'evolutionController'
	})
	.when('/winner', {
	    templateUrl: 'views/winner.tpl.html',
	    controller: 'winnerController'
	})
	.when('/explanation', {
	    templateUrl: 'views/explanation.tpl.html',
	    controller: 'explanationController'
	})
	.otherwise({
        redirectTo: '/leaderboard'
    });
  }]);


