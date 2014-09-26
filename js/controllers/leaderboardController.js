'use strict';
angular.module('controllers').controller('leaderboardController', ['$rootScope', '$scope', '$cookieStore', '$timeout', '$location', 'leaderboardService', 'APP_CONFIG', function($rootScope, $scope, $cookieStore, $timeout, $location, leaderboardService, APP_CONFIG) {
	// console.log('leaderboardController.js');
	$scope.pageClass = 'page-leaderboard';

	// count the runs
	var runCounter = 0;
	var switchLocation;


	/*******************GOD MODE ON******************************/
	if($location.search()['admin']){
		//set session storage
		console.log('god mode ON');
		$cookieStore.put('role','admin');
		//hack to init too lazy to fix
		$location.path('/evolution');
	}

	if($location.search()['user']){
		//set session storage
		console.log('god mode OFF');
		$cookieStore.remove('role');
	}

	if($cookieStore.get('role')){
		console.log('you are currently in ' + $cookieStore.get('role') + ' mode');
	}
	

	// is called when the promise resolves and pushes the data to the scope.
	var scoresToScope = function(data) {
		// set the list limit

		$scope.scoreListLimit = leaderboardService.getScoreListLimit; // field in leaderboardService.
		// the date for the list
		$scope.allScores = data; // data for all the scores.	
	}

	// getScoreData returns a promise - so then...and when done set the info on $scope.
	// the call has to stay down here - otherwise scoresToScope is undefined.
	var retrieveScores = function() {
		leaderboardService.getScoreData().then(scoresToScope);
	}
	
	//admin mode see all desktop boards
	retrieveScores();

	//console.log('location outside',loc.admin);

	if($cookieStore.get('role') == 'admin'){
		$rootScope.adminMode = true;
		//console.log('location true',loc);
		if($rootScope.switchPage == true){
			//console.log('it is true');
			$rootScope.switchPage=false;
			switchLocation = function(){
				$location.path('/evolution');
			}
		} else {
		// switch to the explanation page
			switchLocation = function(){
				console.log('it is false');
				$location.path('/explanation');
			}
		}
		$timeout(switchLocation, APP_CONFIG.PAGE_SWITCH_DELAY);
	
	//user mode, show only the leaderboard
	} else {

		console.log('else location',$location.url());
		switchLocation = function(){
			$location.path('/leaderboard?');
		}
		$timeout(switchLocation, APP_CONFIG.PAGE_SWITCH_DELAY);
	}
	
}]);