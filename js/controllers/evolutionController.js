'use strict';
angular.module('controllers').controller('evolutionController', ['$rootScope','$scope', '$timeout', '$location', 'evolutionService', 'APP_CONFIG', function($rootScope, $scope, $timeout, $location, evolutionService, APP_CONFIG) {
	$scope.pageClass = "page-evolution";

	$scope.allEvolved = $rootScope.datas;
	
	var evolutionToScope = function(data) {
		var createdAt = new Date();
		var updatedAt = new Date();
		
		var data = [
			{"nickName" :  "Zhang San", "score" : 100, "animalImageBefore" : APP_CONFIG.ANIMAL_PATH_PREFIX + "snail.png", "animalImageAfter" : APP_CONFIG.ANIMAL_PATH_PREFIX + "pug.png"},
			{"nickName" :  "Jan Novák", "score" : 500, "animalImageBefore" : APP_CONFIG.ANIMAL_PATH_PREFIX + "pug.png", "animalImageAfter" : APP_CONFIG.ANIMAL_PATH_PREFIX + "cheetah.png"},
			{"nickName" :  "Jan Jansen", "score" : 750, "animalImageBefore" : APP_CONFIG.ANIMAL_PATH_PREFIX + "cheetah.png", "animalImageAfter" : APP_CONFIG.ANIMAL_PATH_PREFIX + "giraffe.png"},
			{"nickName" :  "Jean Dupont", "score" : 250, "animalImageBefore" : APP_CONFIG.ANIMAL_PATH_PREFIX + "wolf.png", "animalImageAfter" : APP_CONFIG.ANIMAL_PATH_PREFIX + "snail.png"},
			{"nickName" :  "Mario Rossi", "score" : 1500, "animalImageBefore" : APP_CONFIG.ANIMAL_PATH_PREFIX + "giraffe.png", "animalImageAfter" : APP_CONFIG.ANIMAL_PATH_PREFIX + "wolf.png"}
			];

			if($rootScope.datas !== null){
				$scope.allEvolved = $rootScope.datas;
				$rootScope.datas = null;
			}

	};
	//evolutionToScope();

	// switch to the leaderboard page
	var switchLocation = function() {
		$location.path('/explanation');
	};	
	// after PAGE_SWITCH_DELAY switch to leaderboard
	 $timeout(switchLocation, APP_CONFIG.PAGE_SWITCH_DELAY);

}]);