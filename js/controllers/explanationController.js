'use strict';
// we just recycle the leaderboardservice for the winner.
angular.module('controllers').controller('explanationController', ['$scope', '$timeout', '$location', 'APP_CONFIG', function($scope, $timeout, $location, APP_CONFIG) {
	// console.log("winnerController.js");
	$scope.pageClass = "page-explanation";

	var switchLocation = function() {
		$location.path('/leaderboard')
	}	

	// after PAGE_SWITCH_DELAY switch to evolution
	var extraTimeout = 5000;
	$timeout(switchLocation, extraTimeout);
	// $timeout(switchLocation, APP_CONFIG.PAGE_SWITCH_DELAY);

}]);