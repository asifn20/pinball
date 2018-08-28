// Spinner_LapCounter.js : Description : Count the spinner rotation. This object is used by mission 
#pragma strict
@Header ("Infos to missions")	
var index					: int;										// choose a number. Used to create script mission.
var Parent_Manager			: GameObject[];								// Connect on the inspector the missions that use this object
var functionToCall			: String = "Counter";						// Call a function when OnCollisionEnter -> true;

static var Lap				: int = 0;									
private var tmp_CheckLap 	: int;

@Header ("Spinner rotation sound")
var Sfx_Rotation 			: AudioClip;								// Sound when ball hit Spinner
private var  sound_ 		: AudioSource;								// AudioSource component

@Header ("Points when the spinner rotate")
var Points					: int = 1000;								// Points you win when the object is hitting 
private var obj_Game_Manager: GameObject;								// Use to connect the gameObject Manager_Game
private var gameManager		: Manager_Game;								// Manager_Game Component from obj_Game_Manager


function Start(){														// --> init
	obj_Game_Manager = GameObject.Find("Manager_Game");					// Find the gameObject Manager_Game
	gameManager = obj_Game_Manager.GetComponent.<Manager_Game>();		// Access Manager_Game from obj_Game_Manager
	sound_ = GetComponent.<AudioSource>();								// Access AudioSource Component
}

function OnTriggerExit (other : Collider) {								// --> When ball enter on the trigger
	Lap++;
	tmp_CheckLap = Lap;
	for(var j : int = 0;j<Parent_Manager.length;j++){
		Parent_Manager[j].SendMessage(functionToCall,index);			// Call Parents Mission script
	}
	if(Sfx_Rotation)sound_.PlayOneShot(Sfx_Rotation);					// Play soiund if needed
	gameManager.F_Mode_BONUS_Counter();									// Send Message to the gameManager(Manager_Game.js) Add 1 to BONUS_Global_Hit_Counter
	gameManager.Add_Score(Points);										// Send Message to the gameManager(Manager_Game.js) Add Points to Add_Score
}


function index_info(){													// return the index of the object. Use by missions
	return index;
}
