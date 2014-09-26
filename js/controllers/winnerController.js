'use strict';
// we just recycle the leaderboardservice for the winner.
angular.module('controllers').controller('winnerController', ['$scope','leaderboardService', function($scope, leaderboardService) {
	// console.log("winnerController.js");
	$scope.pageClass = "page-winner";

	// is called when the promise resolves and pushes the data to the scope.
	var scoresToScope = function(data) {
		// set the list limit
		$scope.scoreListLimit = leaderboardService.getScoreListLimit; // field in leaderboardService.
		// the date for the list
		$scope.winner = data[0]; // data for the winner aka highest score.
	};

	// getScoreData returns a promise - so then...and when done set the info on $scope.
	// the call has to stay down here - otherwise scoresToScope is undefined.
	var retrieveScores = function() {
		leaderboardService.getScoreData().then(scoresToScope);
	}

	retrieveScores();

}]);