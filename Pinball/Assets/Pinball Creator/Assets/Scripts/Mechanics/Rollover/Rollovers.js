// Rollovers.js : Description : Manage the rollover mechanics
#pragma strict
@Header ("Infos to missions")	
var index					: int;					// choose a number. Used to create script mission.
var Parent_Manager			: GameObject[];			// Connect on the inspector the missions that use this object
var functionToCall			: String = "Counter";	// Call a function when OnCollisionEnter -> true;

@Header ("Sound fx")	
var Sfx_Hit 				: AudioClip;			// Sound when ball hit Rollover
private var  sound_ 		: AudioSource;

@Header ("Points when ball go through rollover")
var Points					: int = 1000;			// Points you win when the object is hitting 
private var obj_Game_Manager: GameObject;			// Use to connect the gameObject Manager_Game
private var gameManager		: Manager_Game;			// Manager_Game Component from obj_Game_Manager

@Header ("Toy connected to the Rollover")			// Connect a GameObject or paticule system with the script Toys.js attached
var Toy						: GameObject;
private var toy				: Toys;
var AnimNum					: int = 0;

function Start(){															// --> Init
	obj_Game_Manager = GameObject.Find("Manager_Game");						// Find the gameObject Manager_Game
	if(obj_Game_Manager!=null)
	gameManager = obj_Game_Manager.GetComponent.<Manager_Game>();			// Access Manager_Game from obj_Game_Manager
	sound_ = GetComponent.<AudioSource>();									// Access AudioSource Component
	if(Toy)toy = Toy.GetComponent.<Toys>();									// access Toys component if needed
}

function OnTriggerEnter (other : Collider) {								// --> When the ball enter the trigger
	if(other.tag == "Ball"){
		for(var j : int = 0;j<Parent_Manager.length;j++){
			Parent_Manager[j].SendMessage(functionToCall,index);			// Call Parents Mission script
		}

		if(!sound_.isPlaying && Sfx_Hit)sound_.PlayOneShot(Sfx_Hit);		// Play a sound if needed
		if(obj_Game_Manager!=null){
			gameManager.F_Mode_BONUS_Counter();									// Send Message to the gameManager(Manager_Game.js) Add 1 to BONUS_Global_Hit_Counter
			gameManager.Add_Score(Points);										// Send Message to the gameManager(Manager_Game.js) Add Points to Add_Score
		}
		if(Toy)toy.PlayAnimationNumber(AnimNum);							// Play toy animation if needed
	}
}

function index_info(){														// return the index of the object. Use by missions
	return index;
}