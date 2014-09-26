'use strict';
// config
angular.module('leaderboard').constant('APP_CONFIG', {
	// paths for images
  	ANIMAL_PATH_PREFIX : 'assets/img/animals/',
  	INCENTIVES_PATH_PREFIX : 'assets/img/incentives/',

	// levels for the different animals (unique area switches)
  	ANIMAL_SNAIL_SCORE : 0,
  	ANIMAL_PUGDOG_SCORE : 1,
  	ANIMAL_SKUNK_SCORE : 3,
  	ANIMAL_BEAR_SCORE : 5,
  	ANIMAL_GIRAFFE_SCORE : 10,
  	ANIMAL_WOLF_SCORE : 15,
  	ANIMAL_RABBIT_SCORE : 20,
  	ANIMAL_CHEETAH_SCORE : 30,

  	
  	// levels for the different incentives
  	INCENTIVE_WATER_SCORE : 0,
  	INCENTIVE_JUICE_SCORE : 500,
  	INCENTIVE_COKE_SCORE : 1250, 
  	INCENTIVE_CANDY_BAR_SCORE : 2500,
  	INCENTIVE_ENERGY_DRINK_SCORE : 5000,
  	//INCENTIVE_CHAMPAGNE_SCORE : 10000, // 2 B || ! 2 B?

  	// how long between page switches (in ms) DEFAULT: 10000
	PAGE_SWITCH_DELAY : 10000,

	DEVMODE: false // SET TO FALSE BEFORE USING! OTHERWISE FAKE DATA WILL BE USED...

});
