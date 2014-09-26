'use strict';
angular.module('services').service('evolutionService',['$q', 'APP_CONFIG', '$rootScope', function($q, APP_CONFIG, $rootScope) {
  	// console.log("evolutionService.js");


    $rootScope.$on('#newScores', function(event, scores){
        //push data to parse
        
        //it should retrieve all users and stuff and don't give shit about scores
        //nothing to do with leaderboard
      $rootScope.switchPage = false;  
      var evoScores = init(scores);

      console.log("triggered",evoScores);

      

    });

    //a = leaderboardItems
    var init = function(a){

        //when this thing hits 5 elements trigger the evolution board display
        var counter = 0;
        var listOfFive;
        //Init the should_display_evolution_board flag
        var display = false;

        //retrieve current evolution data (previous leaderboard)

        retrieveCurrentEvolutionData().then(function(evolutionList) {

            // count displayable items (at least 5)
            evolutionList.forEach(function(item) {
                if(item.attributes.isEvolved == true) { counter++; };
            });
 
            // i have 5 items to show - set the flag to true
            if(counter > 4) {
              //display = true;
              //setEvolutionStatus(evolutionList, false);//clear data
            //}

            // return the list of 5 elements to display


            //if(display == true) {
              
              listOfFive = getListOfFive(a, evolutionList);
               
               ///////SEND///////////////////////////////////////
               //$rootScope.datas=listOfFive;
               //if(listOfFive !== undefined && listOfFive !== null){ 
                  //$rootScope.switchPage = true;
                  console.log("we have data",listOfFive);   
                  $rootScope.datas = listOfFive;
                  //$rootScope.$emit('#newEvos',listOfFive);
                  $rootScope.switchPage=true;
                  console.log("the rut scope",$rootScope.switchPage);
                //}
               //<- put current scores and set all flags to false
               deleteRows(evolutionList);
              //display = false;
            }

            if(a.length>0) {    
              var finalArray = processScores(a,evolutionList);
              if(finalArray.length>0) {
                insertEvolutionData(finalArray);
              }
            }

        });
    };

    function getListOfFive(a, evolutionList) {
      var items = [];
      var tmpRecord;
      var nickName;
      var score;
      var animalImageBefore;
      var animalImageAfter;
      var index =0;
      //TODO match items 


      //////////////////
      a.forEach(function(item){
        //flag = false;

        for(var i = 0; i < evolutionList.length; i++) {
          
          //previousScore = 0;
          if(item.id === evolutionList[i].get("userId") && evolutionList[i].get("isEvolved") === true) { //check this one
                nickName = evolutionList[i].get("nickName");
                score = determineScore(evolutionList[i].get("areaSwitches"), evolutionList[i].get("uniqueAreaSwitches"));

                animalImageBefore =/* APP_CONFIG.ANIMAL_PATH_PREFIX +*/ determineAnimal(evolutionList[i].get("areaSwitches"), evolutionList[i].get("uniqueAreaSwitches")); //before evolution list
                animalImageAfter = /*APP_CONFIG.ANIMAL_PATH_PREFIX +*/ determineAnimal(item.attributes.areaSwitches, item.attributes.uniqueAreaSwitches);

                tmpRecord = {"nickName" : nickName, "score" : score, "animalImageBefore" : animalImageBefore, "animalImageAfter" : animalImageAfter};
                items.push(tmpRecord); 


           
            
            
          }
        }
         
      }); 
      //////////////////


      return items;
      /*
       evolutionList.forEach(function(item){
              
              if(item.attributes.isEvolved == true && ) { 
                //nickName = item.attributes.nickName;               
                score = determineScore(item.attributes.areaSwitches, item.attributes.uniqueAreaSwitches);
                animalImageBefore = APP_CONFIG.ANIMAL_PATH_PREFIX + determineAnimal(item.attributes.areaSwitches, item.attributes.uniqueAreaSwitches); //before evolution list
                animalImageAfter = APP_CONFIG.ANIMAL_PATH_PREFIX + determineAnimal(item.attributes.areaSwitches, item.attributes.uniqueAreaSwitches);
                tmpRecord = {"nickName" : nickName, "score" : score, "animalImageBefore" : animalImageBefore, "animalImageAfter" : animalImageAfter};
                items.push(tmpRecord); 
              }
                
        }); 
        if(items.length > 4) {return items; }  
    */
    }

    function deleteRows(evolutionList){

      Parse.Object.destroyAll(evolutionList, {
          success: function() {
              // All the objects were deleted.
              console.log("------deleted ALL!");
          },
          error: function(error) {
          // An error occurred while deleting one or more of the objects.
          // If this is an aggregate error, then we can inspect each error
          // object individually to determine the reason why a particular
          // object was not deleted.
              if (error.code == Parse.Error.AGGREGATE_ERROR) {
                  for (var i = 0; i < error.errors.length; i++) {
                      console.log("Couldn't delete " + error.errors[i].object.id + 
                      "due to " + error.errors[i].message);
                  }
              } else {
                  console.log("Delete aborted because of " + error.message);
              }
          },
      });
        //updateEvolutionData(evolutionList); //create a real delete not append.
    }

    //a = leaderboard data array 
    //evolutionList = evolution data array
    function processScores(a,evolutionList){
      //console.log("scores",a.length);
      //console.log("evo DATA",b.length);
      var arr = [];
      var flag;

      var actualScore;
      var previousScore;

      a.forEach(function(score){
        flag = false;

        for(var i = 0; i < evolutionList.length; i++) {
          actualScore = 0;
          previousScore = 0;
          if(score.id === evolutionList[i].get("userId")) { //check this one

             actualScore = changedAnimal(score.attributes.uniqueAreaSwitches);
             previousScore = changedAnimal(evolutionList[i].get("uniqueAreaSwitches"));

            //console.log("A flag Set to TRUEEEEEEE::::",score.id===b[i].get("userId"));
            flag = true;


            if(actualScore-previousScore>0) {
                  //console.log("the shit changed",b[i]);
                  setEvolutionStatus(evolutionList[i], true);
                  //set the isEvolved to true here
                  //for this us0r
              }
            
            
            
          }
        }
        if(flag === false) {
          //console.log("BINGO! we found",score.id);
          arr.push(score);
        } 

      });
      return arr;

    }
    //add ranges from the config
    function changedAnimal(a) {
        switch(true) {
            case (a >= APP_CONFIG.ANIMAL_CHEETAH_SCORE): return 8; break;
            case (a >= APP_CONFIG.ANIMAL_RABBIT_SCORE): return 7; break;
            case (a >= APP_CONFIG.ANIMAL_WOLF_SCORE): return 6; break;
            case (a >= APP_CONFIG.ANIMAL_GIRAFFE_SCORE): return 5; break;
            case (a >= APP_CONFIG.ANIMAL_BEAR_SCORE): return 4; break;
            case (a >= APP_CONFIG.ANIMAL_SKUNK_SCORE): return 3; break;
            case (a >= APP_CONFIG.ANIMAL_PUGDOG_SCORE): return 2; break;
            case (a >= APP_CONFIG.ANIMAL_SNAIL_SCORE): return 1; break;
            default: return -1;break;
        }
    }

 
  	function insertEvolutionData (data) {

      /*call*/
      //console.log("final Array",data);
      updateEvolutionData(data);
  		return "EVOLUTION (dummyFunction)";
  	};

    function updateEvolutionData(data) {
      //var evolution = Parse.Object.extend("Evolution");
      var evolution = Parse.Object.extend("Evilution");
      var evolutionsArray = [];

      data.forEach(function (record) {
        
         //console.log("theREcord",record); 

        var evolvedUser = new evolution();
        evolvedUser.set("userId",record.id);
        evolvedUser.set("nickName",record.attributes.friendlyName);
        evolvedUser.set("areaSwitches",record.attributes.areaSwitches);
        evolvedUser.set("uniqueAreaSwitches",record.attributes.uniqueAreaSwitches);
        evolvedUser.set("isEvolved", false);
        evolutionsArray.push(evolvedUser);
      });
      console.log("before save",JSON.stringify(evolutionsArray));
      Parse.Object.saveAll(evolutionsArray);
    }

    function retrieveCurrentEvolutionData() {
      var promise = $q.defer();
      //var evolution = Parse.Object.extend("Evolution");
      var evolution = Parse.Object.extend("Evilution");
      var query = new Parse.Query(evolution);      

      query.find().then(function (data){
        promise.resolve(data);
      });

      return promise.promise;

    }

    var determineScore = function(areaSwitches, uniqueAreaSwitches) {
      var score = areaSwitches * 10 + uniqueAreaSwitches * 50;
      return score;
    }
    var determineAnimal = function(areaSwitches, uniqueAreaSwitches) {
      var score = uniqueAreaSwitches;
      var animal = "snail.png"; // DEFAULT

      if (score >= APP_CONFIG.ANIMAL_SNAIL_SCORE) { animal = "snail.png"; }
      if (score >= APP_CONFIG.ANIMAL_PUGDOG_SCORE) { animal = "pug.png"; }
      if (score >= APP_CONFIG.ANIMAL_SKUNK_SCORE) { animal = "skunk.png"; }
      if (score >= APP_CONFIG.ANIMAL_BEAR_SCORE) { animal = "bear.png"; }
      if (score >= APP_CONFIG.ANIMAL_GIRAFFE_SCORE) { animal = "giraffe.png"; }
      if (score >= APP_CONFIG.ANIMAL_WOLF_SCORE) { animal = "wolf.png"; } 
      if (score >= APP_CONFIG.ANIMAL_RABBIT_SCORE) { animal = "rabbit.png"; }
      if (score >= APP_CONFIG.ANIMAL_CHEETAH_SCORE) { animal = "cheetah.png"; }
      return APP_CONFIG.ANIMAL_PATH_PREFIX + animal;
    }


    function setEvolutionStatus(items, flag) {
        //var evolution = Parse.Object.extend("Evolution");
        var evolution = Parse.Object.extend("Evilution");
        var evolutionStatusArray = [];
        if(items.length > 1) {
          items.forEach(function (item){
            //console.log("the Flag",flag);
            item.set("isEvolved", flag);
            evolutionStatusArray.push(item);
          });
        }
        else{
          items.set("isEvolved", flag);
          evolutionStatusArray.push(items);
        }
      Parse.Object.saveAll(evolutionStatusArray);
    };


	// public 
	return {
    init : init
		//dummyFunction : dummyFunction
    }
}]);