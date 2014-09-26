'use strict';
angular.module('services').service('leaderboardService',['$q', 'APP_CONFIG','$rootScope' ,function($q, APP_CONFIG, $rootScope) {
  	// console.log("leaderboardService.js");

	// Parse.initialize(APP_ID, JS_KEY);
	
	// real data
	Parse.initialize("RDVvLL3vsCb5hCryzsrHxifjg6c2lLMlMcxRVag6","ZxrYxPYdTYeJnoTXAP5FU71kDctIbGl05U5GT5N6"); // alex allan (app id, js key)
	
	// fake data
	if (APP_CONFIG.DEVMODE == true) {
		Parse.initialize("fScrizACbHQgXJ6fykIOWhQzjTBTCPFZIKGpznhD", "fBeC47bLL3YhgKw4RtngU3P4DFqX8xZSTMKHGCf5"); // karla hungus
	}


  	// private
  	var leaderBoardSize = 14; // MUST be even!
	var scoreListLimit = leaderBoardSize / 2;
	//var processedData;
	
	var getScoreData = function(){	
		var servicePromise = $q.defer();
		
		// real data
		var query = new Parse.Query(Parse.User);
		query.descending("areaSwitches");

		// fake data
		if (APP_CONFIG.DEVMODE == true) {
			var query = new Parse.Query(Parse.Object.extend("Scores"));
			query.descending("score");
		}

		//query.limit(leaderBoardSize);
		//query.limit(1); // TODO: REMOVE BEFORE FLIGHT!


		query.find().then(function(data) {
			//push data to evolution
			//trigger event and set stuff to rootscope
			//if we have inUrl ?admin=true then proceed with the evolution service
			if($rootScope.adminMode == true){
				console.log("calling evolition",data);
				$rootScope.$emit('#newScores',data);
			}
		

			var processedData = processData(data);
			var sortedData = processedData.sort(compareScore);
			servicePromise.resolve(sortedData);
		}, function(data, error) {
  			//console.log("Message: " + error.message + "\nCode: " + error.code); //error is undef. check the handling tho.
		});
		
		return servicePromise.promise;
	};

	
	function processData(data){

		// clear old data
		var scores = [];
		var realDataRecords = data.length;

		var areaSwitches = 0; // 
		var uniqueAreaSwitches = 0; //
		var score; // the score
		var nickName; // nick
		var incentiveImage; // incentive
		var animalImage; // animal
		var createdAt;
		var updatedAt;
		for (var i = 0; i < leaderBoardSize; i++) {
			if (data[i] != undefined) {
				
				// real data
				areaSwitches = data[i].get("areaSwitches");			
				uniqueAreaSwitches = data[i].get("uniqueAreaSwitches");
				
				// fake data
				if (APP_CONFIG.DEVMODE == true) {
					areaSwitches = data[i].get("score"); // TODO: REMOVE BEFORE FLIGHT!
					uniqueAreaSwitches = 0;// TODO: REMOVE BEFORE FLIGHT!
				}
				score = determineScore(areaSwitches, uniqueAreaSwitches);
				
				// real data
				nickName = data[i].get("friendlyName");
				nickName = nickName.substring(0,15); // cut the nickname to fit into the container :P
				
				// fake data
				if (APP_CONFIG.DEVMODE == true) { 
					nickName = data[i].get("nickname"); 
				}
				
				// real data
				createdAt = data[i].get("createdAt");
				updatedAt = data[i].get("updatedAt");

				// fake data
				if (APP_CONFIG.DEVMODE == true) { 
					createdAt = new Date();
					updatedAt = new Date();
				}

				incentiveImage = determineIncentive(areaSwitches, uniqueAreaSwitches);
				animalImage = determineAnimal(areaSwitches, uniqueAreaSwitches);

				var tmpScore = {"nickName" : nickName, "score" : score, "animalImage" : animalImage, "incentiveImage" : incentiveImage, "createdAt" : createdAt, "updatedAt" : updatedAt};
			}
			// create dummy entries to fill the board up to leaderBoardSize ;)
			else { 
				
				var tmpScore = fakeScore(i);
				// var tmpScore = {"nickName" : fakeName(), "score" : 0, "animalImage" : APP_CONFIG.ANIMAL_PATH_PREFIX + "snail.png", "incentiveImage" : APP_CONFIG.INCENTIVES_PATH_PREFIX + "inc_water.png"};;
			}
			scores.push(tmpScore);
		}

		

		return scores;
	}
	var determineScore = function(areaSwitches, uniqueAreaSwitches) {
		var score = areaSwitches * 10 + uniqueAreaSwitches * 50;
		return score;
	}

	var determineIncentive = function(areaSwitches, uniqueAreaSwitches) {
		var score = areaSwitches * 10 + uniqueAreaSwitches * 50;
		var incentive = "inc_water.png"; // DEFAULT
		
		if (score >= APP_CONFIG.INCENTIVE_WATER_SCORE) { incentive = "inc_water.png";}
		if (score >= APP_CONFIG.INCENTIVE_JUICE_SCORE) { incentive = "inc_juice.png";}
		if (score >= APP_CONFIG.INCENTIVE_COKE_SCORE) { incentive = "inc_coke.png";}
		if (score >= APP_CONFIG.INCENTIVE_CANDY_BAR_SCORE) { incentive = "inc_candybar.png";}
		if (score >= APP_CONFIG.INCENTIVE_ENERGY_DRINK_SCORE) { incentive = "inc_energydrink.png";}
		return APP_CONFIG.INCENTIVES_PATH_PREFIX + incentive;
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

	var fakeScore = function(index){
		var createdAt = "createdAt";
		var updatedAt = "updatedAt";
		var score = 0;
		var fakeScores = [
			{"nickName" :  "Zhang San", "score" : score, "animalImage" : APP_CONFIG.ANIMAL_PATH_PREFIX + "snail.png", "incentiveImage" : APP_CONFIG.INCENTIVES_PATH_PREFIX + "inc_water.png", "createdAt" : createdAt, "updatedAt" : updatedAt},
			{"nickName" :  "Jan Novák", "score" : score, "animalImage" : APP_CONFIG.ANIMAL_PATH_PREFIX + "snail.png", "incentiveImage" : APP_CONFIG.INCENTIVES_PATH_PREFIX + "inc_water.png", "createdAt" : createdAt, "updatedAt" : updatedAt},
			{"nickName" :  "Jan Jansen", "score" : score, "animalImage" : APP_CONFIG.ANIMAL_PATH_PREFIX + "snail.png", "incentiveImage" : APP_CONFIG.INCENTIVES_PATH_PREFIX + "inc_water.png", "createdAt" : createdAt, "updatedAt" : updatedAt},
			{"nickName" :  "Jean Dupont", "score" : score, "animalImage" : APP_CONFIG.ANIMAL_PATH_PREFIX + "snail.png", "incentiveImage" : APP_CONFIG.INCENTIVES_PATH_PREFIX + "inc_water.png", "createdAt" : createdAt, "updatedAt" : updatedAt},
			{"nickName" :  "Mario Rossi", "score" : score, "animalImage" : APP_CONFIG.ANIMAL_PATH_PREFIX + "snail.png", "incentiveImage" : APP_CONFIG.INCENTIVES_PATH_PREFIX + "inc_water.png", "createdAt" : createdAt, "updatedAt" : updatedAt},
			{"nickName" :  "Kari Nordmann", "score" : score, "animalImage" : APP_CONFIG.ANIMAL_PATH_PREFIX + "snail.png", "incentiveImage" : APP_CONFIG.INCENTIVES_PATH_PREFIX + "inc_water.png", "createdAt" : createdAt, "updatedAt" : updatedAt},
			{"nickName" :  "Anders Andersen", "score" : score, "animalImage" : APP_CONFIG.ANIMAL_PATH_PREFIX + "snail.png", "incentiveImage" : APP_CONFIG.INCENTIVES_PATH_PREFIX + "inc_water.png", "createdAt" : createdAt, "updatedAt" : updatedAt},
			{"nickName" :  "John Doe", "score" : score, "animalImage" : APP_CONFIG.ANIMAL_PATH_PREFIX + "snail.png", "incentiveImage" : APP_CONFIG.INCENTIVES_PATH_PREFIX + "inc_water.png", "createdAt" : createdAt, "updatedAt" : updatedAt},
			{"nickName" :  "Li Si", "score" : score, "animalImage" : APP_CONFIG.ANIMAL_PATH_PREFIX + "snail.png", "incentiveImage" : APP_CONFIG.INCENTIVES_PATH_PREFIX + "inc_water.png", "createdAt" : createdAt, "updatedAt" : updatedAt},
			{"nickName" : "João des Couves", "score" : score, "animalImage" : APP_CONFIG.ANIMAL_PATH_PREFIX + "snail.png", "incentiveImage" : APP_CONFIG.INCENTIVES_PATH_PREFIX + "inc_water.png", "createdAt" : createdAt, "updatedAt" : updatedAt},
			{"nickName" : "Ivan Ivanovich Ivanov", "score" : score, "animalImage" : APP_CONFIG.ANIMAL_PATH_PREFIX + "snail.png", "incentiveImage" : APP_CONFIG.INCENTIVES_PATH_PREFIX + "inc_water.png", "createdAt" : createdAt, "updatedAt" : updatedAt},
			{"nickName" : "Fulano de Tal", "score" : score, "animalImage" : APP_CONFIG.ANIMAL_PATH_PREFIX + "snail.png", "incentiveImage" : APP_CONFIG.INCENTIVES_PATH_PREFIX + "inc_water.png", "createdAt" : createdAt, "updatedAt" : updatedAt},
			{"nickName" : "Hong Gildong", "score" : score, "animalImage" : APP_CONFIG.ANIMAL_PATH_PREFIX + "snail.png", "incentiveImage" : APP_CONFIG.INCENTIVES_PATH_PREFIX + "inc_water.png", "createdAt" : createdAt, "updatedAt" : updatedAt},
			{"nickName" : "Wang Wu", "score" : score, "animalImage" : APP_CONFIG.ANIMAL_PATH_PREFIX + "snail.png", "incentiveImage" : APP_CONFIG.INCENTIVES_PATH_PREFIX + "inc_water.png", "createdAt" : createdAt, "updatedAt" : updatedAt}
		];
		return fakeScores[index];
	};

	// to sort by score
	var compareScore = function(a,b) {
		return b.score - a.score;			
	};



	var fakeName = function() {
		var dc = ["Alfred","Pennyworth","Aquaman","Atrocitus","Bane","Batgirl","Batman","Bizarro","Black","Adam","Black","Manta","Blue","Beetle","Booster","Gold","Brainiac","Captain","Cold","Catwoman","Commissioner","James","Gordon","Constantine","Cyborg","Darkseid","Deadman","Deathstroke","Gorilla","Grodd","Green","Arrow","Green","Lantern","Harley","Quinn","Joker","Justice","League","Lex","Luthor","Load","More","Lucius","Fox","Mera","Nightwing","Plastic","Man","Ra's","Ghul","Raven","Reverse-Flash","Robin","SHAZAM!","Scarecrow","Sinestro","Solomon","Grundy","Superboy","Supergirl","Superman","Swamp","Thing","The","Flash","Titans","Watchmen","Wonder","Woman","Zatanna"];
		var marvel = ["A-Bomb","A-Z","A.I.M.","Aaron","Abomination","Absorbing","Abyss","Adam","Adder","Aegis","Agent","Agents","Aginar","Air-Walker","Ajak","Ajaxis","Akemi","Alain","Albert","Albion","Alex","Alexa","Alexander","Alice","Alicia","Alpha","Alvin","Amadeus","Amanda","Amazoness","America","America/Steve","American","Amiko","Amora","Amphibian","Amun","Anarchist","Ancient","Angel","Anger","Anita","Anne","Annihilus","Anole","Ant-Man","Anthem","Apes","Apocalypse","Aqueduct","Arachne","Arcade","Arcana","Archangel","Arclight","Ares","Argent","Armadillo","Armor","Armory","Army","Arnim","Arsenic","Artiee","Asgardian","Askani","Askew-Tronics","Astro","Asylum","Atlas","Aurora","Avalanche","Avalon","Avengers","Azazel","Badoon","Bain","Baldwin","Balinger","Banner","Banshee","Barnes","Baron","Baroness","Barracuda","Bart","Barton","Bastion","Batroc","Battering","Beak","Beast","Beautiful","Becatron","Bedlam","Beef","Beetle","Believers","Ben","Bengal","Bennett","Bertha","Beta-Ray","Betty","Beyonder","Bi-Beast","Big","Bill","Bird","Bishop","Black","Blackheart","Blacklash","Blackout","Blade","Blake","Blastaar","Blaze","Blazing","Blindfold","Blink","Blizzard","Blob","Blockbuster","Blok","Bloke","Blonde","Bloodaxe","Bloodscream","Bloodstone","Bloodstorm","Bloodstrike","Blue","Blur","Bob,","Bolt","Boom","Boomer","Boomerang","Box","Boy","Braddock","Brand","Brant","Bride","Bridge","Britain","Broadcloak","Brock","Bromley","Brood","Brother","Brotherhood","Bruce","Brute","Buchanan","Bucky","Bug","Bugle","Bulldozer","Bullseye","Bumpo","Bushwacker","Butterfly","By","Cable","Cage","Calamity","Caliban","Call","Callister","Callisto","Calypso","Cammi","Campion","Cannonball","Cap'n","Captain","Cardiac","Caretaker","Cargill","Carlie","Carmella","Carnage","Carol","Carpenter","Carter","Cassandra","Castle","Cat","Catseye","Cecilia","Celestial","Celestials","Centennial","Centurion","Centurions","Cerebro","Cerise","Ch'od","Chamber","Chameleon","Champions","Changeling","Chapel","Character","Charles","Charlie","Chase","Chat","Cheney","Chief","Child","Chimera","Cho","Chores","Christian","Chronomancer","ClanDestine","Claus","Claw","Clea","Cleary","Clint","Cloak","Cloud","Club","Cobalt","Cobra","Colcord","Colleen","Colonel","Colossus","Colt","Commandos","Confederates","Conners","Constrictor","Contessa","Control","Controller","Cooper","Cornelius","Corps","Corsair","Cortez","Cosmo","Cottonmouth","Count","Countess","Crew","Crimson","Cross","Crossbones","Crow","Crule","Crusader","Crusher","Crystal","Cub","Cuckoo","Cuckoos","Curious","Curt","Cuthbert","Cyber","Cyclops","Cypher","D'Ken","Dagger","Daily","Daimon","Daken","Dakota","Damage","Dancer","Dane","Dani","Danny","Danvers","Dare","Daredevil","Dargo","Dark","Darkhawk","Darkstar","Darwin","Daughter","Daughters","Dave","Davidson","Dazzler","Deacon","Dead","Deadpool","Dean","Death","Deathbird","Deathcry","Deathlok","Deathstrike","Debra","Debrii","Dee","Deena","Defenders","Delgado","Demogoblin","Demon","Deschain","Destine","Destiny","Detective","Deviants","Devil","Devos","Dexter","Diablo","Diamondback","Dinah","Dinosaur","Dirk","Doc","Doctor","Dog","Doll","Domino","Donald","Doom","Doomsday","Doop","Doorman","Dorian","Dormammu","Dr.","Dracula","Dragon","Drax","Dreadnoughts","Dreaming","Drew","Druig","Duck","Dugan","Dum","Duncan","Dust","Dutchman","Dynamo","E","Eagle","Earthquake","Echo","Eddie","Edward","Edwin","Ego","Electro","Elektra","Elements","Elite","Elixir","Ellis","Elloe","Elsa","Emma","Empath","Emplate","Enchantress","Ender","Energizer","Enforcers","Epoch","Erik","Eternals","Eternity","Evil","Evolutionary","Excalibur","Executioner","Exiles","Exodus","Expediter","Ezekiel","Fabian","Falcon","Falcon/Sam","Fallen","Famine","Fang","Fantastic","Fantastick","Fantomex","Farrell","Farson","Fat","Faustus","Fear","Felicia","Fenris","Feral","Fever","Fin","Firebird","Firebrand","Firedrake","Firelord","Firestar","Fish","Fisk","Fist","Fixer","Fixit","Flag","Flagg","Flatman","Flight","Flint","Floyd","Fly","Flying","Foggy","Foom","For","Force","Forearm","Forge","Forgotten","Forrester","Foster","Four","Fox","Frank","Frankenstein's","Franklin","Freak","Frightful","Frog","Frog-Man","Frost","Fujikawa","Fury","GW","Gabe","Galactus","Galaxy","Galia","Gambit","Gamma","Gamora","Gargan","Gargoyle","Garia","Garrison","Gateway","Gath","Gauntlet","Geiger","Gene","Generation","Genesis","Genis-Vell","George","Gertrude","Ghost","Giant","Giant-Man","Giant-dok","Gideon","Girl","Git","Gladiator","Glenn","Glorian","Gnuci","Goblin","Gods","Golden","Goliath","Gonzales","Gorgon","Gorilla","Grandmaster","Gravity","Gray","Great","Green","Gressill","Grey","Greymalkin","Grim","Grimm","Groot","Guard","Guardian","Guardians","Guardsmen","Gunslinger","Guy","Gwen","Gyrich","H.A.M.M.E.R.","H.E.R.B.I.E.","Hairball","Half-Life","Hammer","Hammerhead","Hand","Hank","Hannibal","Happy","Hardball","Hardy","Harley","Harpoon","Harrier","Harry","Hate-Monger","Havok","Hawal","Hawkeye","Hawkeye/Clint","Hayes","Heck","Hedge","Hellcat","Hellfire","Hellion","Hellions","Hellstrom","Hemingway","Henry","Hepzibah","Hercules","Hero","Heroes","Hex","High","Hill","Hindsight","Hines","Hire","Hiroim","Hitman","Hitomi","Hoag","Hobgoblin","Hogan","Hogarth","Hollister","Holocaust","Holy","Hood","Hope","Hoskins","Howard","Howlett","Howling","Hulk","Hulk-dok","Hulk/Bruce","Hulkling","Human","Humbug","Hunter","Husk","Hussar","Hyde","Hydra","Hydro-Man","Hyperion","Hypno-Hustler","III","IV","Iceman","Ikaris","Illuminati","Ilyana","Immortal","Imp","Imperfects","Imperial","Impossible","In-Betweener","Index","Industries","Inertia","Infant","Inhumans","Initiative","Ink","Intelligence","Invaders","Investigations","Invisible","Iron","Ironclad","J.","Jack","Jackal","Jackpot","James","Jameson","Jamie","Jane","Janus,","Jarvis","Jasper","Jazinda","Jean","Jennifer","Jeryn","Jessica","Jetstream","Jigsaw","Jimmy","Joan","Jocasta","John","Johnny","Jonah","Jones","Joseph","Joshua","Josiah","Joystick","Jubilee","Juggernaut","Jule","Julian","Junta","Justice","Justin","Ka-Zar","Kabuki","Kaifi","Kane","Kang","Karen","Karma","Karnak","Karolina","Kat","Kate","Katie","Keller","Kelly","Ken","Khan","Kid","Killer","Killmonger","Killraven","King","Kingpin","Kinsey","Kitty","Klaw","Knight","Komodo","Korath","Korg","Korvac","Kraven","Kree","Krista","Kronos","Ktor","Kulan","Kung,","Kylun","La","Lace","Lad","Lady","Lake","Lakes","Landau","Lantern","Lau","Lava-Man","Layla","Leader","Leaper","Leech","Legion","Lei","Lenny","Leo","Leopardon","Leper","Lester","Lethal","Li","Liberteens","Liberty","Lieutenant","Lifeguard","Lightning","Lightspeed","Lila","Lilandra","Lilith","Lily","Lionheart","Living","Liz","Lizard","Loa","Lockheed","Lockjaw","Logan","Loki","Loners","Longshot","Lord","Lords","Lorna","Luckman","Lucky","Lucy","Luke","Luminals","Lyja","M","M.O.D.A.M.","M.O.D.O.G.","M.O.D.O.K.","MI:","MS2","MVP","Ma","Mac","MacGillicudy","MacTaggert","Mach","Machine","Mad","Madame","Maddog","Madelyne","Madripoor","Madrox","Maelstrom","Maestro","Magdalene","Maggott","Magik","Maginty","Magma","Magneto","Magus","Major","Maker","Makkari","Malcolm","Malice","Man","Man-Thing","Man-Wolf","Man/Tony","Mancha","Mandarin","Mandrill","Mandroid","Manta","Mantis","Mapleleaf","Marauders","Marcus","Maria","Marie","Mariko","Marrow","Marten","Martin","Marvel","Marvex","Mary","Masked","Masque","Master","Mastermind","Masters","Mathemanic","Matsu'o","Matthew","Mattie","Mauler","Maverick","Maximus","May","Medusa","Meggan","Meltdown","Men","Menace","Mendez","Mentallo","Mentor","Mephisto","Mephistopheles","Mercury","Mesmero","Metal","Meteorite","Meugniot","Micro/Macro","Microbe","Microchip","Micromax","Midlands","Midnight","Miek","Mikhail","Millenium","Miller","Millie","Milo","Mimic","Mindworm","Minoru","Miss","Mister","Misty","Mockingbird","Model","Moira","Mojo","Mold","Mole","Molecule","Molly","Molten","Monger","Mongoose","Mongu","Monster","Moon","Moondragon","Moonstar","Moonstone","Morbius","Mordo","Morg","Morgan","Morlocks","Morlun","Morph","Mother","Mouse","Mr.","Mulholland","Multiple","Mummy","Murdock","Mutants","Mysterio","Mystique","Namor","Namora","Namorita","Naoko","Natasha","Nebula","Nefaria","Nega-Man","Negative","Nehzno","Nekra","Nelson","Nemesis","Nepal","Neramani","Network","New","Newton","Next","Nextwave","Nick","Nico","Nicolaos","Night","Nightcrawler","Nighthawk","Nightmare","Nightshade","Nile","Nine","Nine-Fold","Nitro","Nocturne","Noir","Nomad","Norman","Norrin","North","Northstar","Nova","Nuit","Nuke","Nurse","O'","O'Malley","Obadiah","Octavius","Octopus","Odin","Ogun","Old","Omega","One","Onslaught","Oracle","Ord","Order","Orphan","Orphan-Maker","Orphans","Osborn","Otto","Outlaw","Overlord","Owl","Oz","Ozymandias","Pack","Page","Paibok","Paladin","Pandemic","Panther","Paper","Parker","Patch","Patriot","Payback","Penance","Pepper","Pestilence","Pet","Pete","Peter","Phalanx","Phantom","Phil","Phoenix","Photon","Phyla-Vell","Pierce","Pierre","Piledriver","Pilgrim","Pip","Pixie","Plazm","Polaris","Porter","Post","Potts","Power","Powerful","Praxagora","Preak","Pretty","Pride","Prima","Prince","Princess","Prism","Prodigy","Proemial","Professor","Proteus","Proudstar","Prowler","Pryde","Pryor","PsyNapse","Psycho-Man","Psylocke","Puck","Puff","Puma","Punisher","Puppet","Purifiers","Purple","Pym","Pyro","Quasar","Quasimodo","Queen","Quentin","Quicksilver","Quill","Quire","Raccoon","Racer","Rachel","Radd","Radioactive","Rafael","Rage","Raider","Ram","Rand","Randall","Random","Rasputin","Rattler","Ravenous","Rawhide","Raza","Reaper","Reavers","Red","Redwing","Reilly","Renegades","Reporter","Reptil","Retro","Revanche","Reyes","Rhino","Rhodey","Richard","Richards","Richtofen","Rick","Ricochet","Rictor","Rider","Riptide","Risque","Robbie","Robert","Robertson","Robin","Robot","Rocket","Rockslide","Rogers","Rogue","Roland","Romanoff","Romulus","Ronan","Ross","Roughhouse","Roulette","Roxanne","Rozum","Rumiko","Runaways","Russian","S'Bak","S.H.I.E.L.D.","Sable","Sabra","Sabretooth","Sage","Sailors","Saint","Sakuma","Salem's","Sally","Salo","Samson","Samurai","Sandman","Santa","Santerians","Saracen","Sasquatch","Satana","Sauron","Scalphunter","Scarecrow","Scarlet","Sciver","Scorpion","Scourge","Scrambler","Scream","Screwball","Sebastian","Secret","Sefton","Selene","Senator","Sentinel","Sentinels","Sentry","Ser","Serpent","Sersi","Seven","Shadow","Shadowcat","Shadu","Shady","Shalla-bal","Shaman","Shane","Shang-Chi","Shanna","Shape","Shard","Shark","Sharon","Shatterstar","Shaw","She-Devil","She-Hulk","Sheldon","Shen","Sheva","Shi'Ar","Shield","Shift","Shinko","Shinobi","Shiva","Shiver","Shocker","Shockwave","Shooting","Shotgun","Shriek","Shrike","Sif","Silhouette","Silk","Silver","Silverclaw","Silvermane","Simpson","Sin","Sinister","Sir","Siren","Sister","Sitwell","Six","Skaar","Skin","Skreet","Skrulls","Skull","Skullbuster","Sky","Slapstick","Slayback","Sleeper","Sleepwalker","Slipstream","Slyde","Smasher","Smiling","Smith","Smythe","Snowbird","Soap","Soar","Society","Soldier","Solo","Songbird","Sons","Spacker","Spectrum","Speed","Speedball","Spencer","Sphinx","Spider","Spider-Girl","Spider-Ham","Spider-Man","Spider-Woman","Spider-dok","Spiders","Spike","Spiral","Spirit","Spiroza","Spitfire","Spot","Sprite","Spyke","Squad","Squadron","Squirrel","Stack","Stacy","Stane","Star","Star-Lord","Starbolt","Stardust","Starfox","Starhawk","Starjammers","Stark","Starr","Stature","Steel","Stein","Stellaris","Stepford","Stephanie","Stephen","Steve","Stick","Stilt-Man","Stingray","Stone","Storm","Strange","Stranger","Strong","Strucker","Stryfe","Stryker","Sub-Mariner","Sue","Sugar","Summers","Sumo","Sunfire","Sunset","Sunspot","Super","Super-Adaptoid","Super-Skrull","Supernaut","Supreme","Surfer","Surge","Susan","Swarm","Sway","Switch","Swordsman","Sym","Synch","T'Challa","Tag","Talbot","Talisman","Talkback","Talon","Talos","Tana","Tarantula","Tarot","Taskmaster","Tattoo","Ted","Tempest","Tenebrous","Terrax","Terrible","Terror","Texas","Thaddeus","Thanos","The","Thena","Thing","Thinker","Thor","Thrasher","Thunderball","Thunderbird","Thunderbolt","Thunderbolts","Thunderer","Thundra","Tiger","Tiger's","Tigra","Tilby","Timeslip","Tinkerer","Titania","Titanium","Toad","Tom","Tomas","Tombstone","Tomorrow","Tony","Torch","Toro","Toxin","Trauma","Triathlon","Tribunal","Trish","Triton","True","Tsurayaba","Turbo","Tusk","Twelve","Twister","Two-Gun","Tyger","Typhoid","Tyrannus","U-Foes","U-Go","U.S.","Uatu","Ulik","Ultimate","Ultimates","Ultimatum","Ultimo","Ultra-Adaptoid","Ultragirl","Ultron","Umar","Unicorn","Union","Universe","Unknown","Unus","Unuscione","Urich","Ursula","Valeria","Valkyrie","Vampiro","Van","Vance","Vanisher","Vapor","Vargas","Vaughn","Vector","Veda","Vega","Vengeance","Venom","Ventura","Venus","Vermin","Vertigo","Victor","Vin","Vindicator","Violations","Viper","Virginia","Vision","Vivisector","Von","Voodoo","Vulcan","Vulture","Walden","Walker","Wallflower","Wallop","Wallow","War","Warbird","Warbound","Warhawk","Warlock","Warpath","Warren","Warriors","Warstar","Wasp","Watcher","Watchers","Watson","Weapon","Web","Wendell","Wendigo","Werewolf","Wheel","Whiplash","Whirlwind","Whistler","White","Whitman","Whizzer","Wiccan","Widow","Widow/Natasha","Wiggin","Wild","Wilder","Wildside","William","Wilson","Wind","Wing","Winter","Wisdom","Witch","Wither","Wolf","Wolfpack","Wolfsbane","Wolver-dok","Wolverine","Woman","Wonder","Wong","Woo","Works","Worthington","Wraith","Wrecker","Wrecking","X","X-23","X-51","X-Babies","X-Cutioner","X-Factor","X-Force","X-Man","X-Men","X-Ray","X-Statix","X.S.E.","Xao","Xavier","Xavin","Xorn","Yamada-Jones","Yamashiro","Yashida","Yellow","Yellowjacket","Yorkes","Young","Zaladane","Zaran","Zarda","Zarek","Zeigeist","Zemo","Zero","Zodiak","Zola","Zombie","Zombies","Zuras","Zzzax"];
		return dc[Math.floor(Math.random()*dc.length)] + " " + marvel[Math.floor(Math.random()*marvel.length)];
	};
	
	// public 
	return {
        getScoreData : getScoreData, 
		getScoreListLimit : scoreListLimit
    }
}]);