// switch.js : Description : Manage Switch table mechanics
#pragma strict

var index					: int;
var Parent_Manager			: GameObject[];
var functionToCall			: String = "Counter";	// Call a function when OnCollisionEnter -> true;

var Sfx_Hit 				: AudioClip;
private var  sound_ 		: AudioSource;

var Points					: int = 1000;			// Points you win when the object is hitting 
private var obj_Game_Manager: GameObject;
private var gameManager		: Manager_Game;

function Awake(){
	Physics.IgnoreLayerCollision(8,12, true);
}
function Start(){
	obj_Game_Manager = GameObject.Find("Manager_Game");
	gameManager = obj_Game_Manager.GetComponent.<Manager_Game>();	
	sound_ = GetComponent.<AudioSource>();
}


function OnCollisionEnter(collision: Collision) {
	if(collision.transform.tag == "Ball"){
		for(var j : int = 0;j<Parent_Manager.length;j++){
			Parent_Manager[j].SendMessage(functionToCall,index);			// Call Parents Mission script
		}

		if(!sound_.isPlaying && Sfx_Hit)sound_.PlayOneShot(Sfx_Hit);		// Play a sound

		gameManager.F_Mode_BONUS_Counter();									// Add Points to bonus counter
		gameManager.Add_Score(Points);										// Add point to score
	}
}

