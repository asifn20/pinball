// Target.js : Description : Manage the target mechanics
#pragma strict
@Header ("Drop target or stationary target")	
var b_Drop_Target				: boolean = true;			// if true : Drop target / false : stationary target

@Header ("Infos to missions")	
var index						: int;						// choose a number. Used to create script mission.
var Parent_Manager				: GameObject[];				// Connect on the inspector the missions that use this object
var functionToCall				: String = "Counter";		// Call a function when OnCollisionEnter -> true;

@Header ("Force to drop the target")	
var MinMagnitude				: float = .5;

private var b_MoveObject		: boolean = false;
private var target				: float = 0;

@Header ("Local Position if activate or deactivate")
var ActivatePosY				: float = .11;				// local position when the target is activate
var DesactivatePosY				: float = -.25;				// local position when the target is deactivate
var MoveSpeed					: float = 5;				// speed to reach the target

@Header ("Sound fx")
var Sfx_Hit 					: AudioClip;				// Sound when the target is hit
var Sfx_ActivateDesactivate 	: AudioClip;				// Sound when you activate or activate
var volume_Deactivate			: float = .5;
var volume_Activate				: float = .5;
private var  sound_ 			: AudioSource;				// Audio component

@Header ("Points when Target is hit")
var Points						: int = 1000;				// Points you win when the object is hitting 
private var obj_Game_Manager	: GameObject;				// Use to connect the gameObject Manager_Game
private var gameManager			: Manager_Game;				// Manager_Game Component from obj_Game_Manager

@Header ("Toy connected to the Target")						// Connect a GameObject or paticule system with the script Toys.js attached
var Toy						: GameObject;
private var toy				: Toys;
var AnimNum					: int = 0;


function Start() {																	// --> Init
	if(transform.localPosition.y == ActivatePosY)									// init variable target
		target = ActivatePosY;
	else
		target = DesactivatePosY;

	obj_Game_Manager = GameObject.Find("Manager_Game");								// Find the gameObject Manager_Game

	if(obj_Game_Manager!=null)
	gameManager = obj_Game_Manager.GetComponent.<Manager_Game>();					// Access Manager_Game from obj_Game_Manager
	sound_ = GetComponent.<AudioSource>();											// Access AudioSource Component
	if(Toy)toy = Toy.GetComponent.<Toys>();											// access Toys component if needed
}

function Update () {																// --> Update
	if(b_MoveObject){																// Move the target
		transform.localPosition.y = Mathf.MoveTowards(transform.localPosition.y, target, MoveSpeed*Time.deltaTime);
		if(transform.localPosition.y == target){
			b_MoveObject = false;
		}
	}
}

function OnCollisionEnter(collision: Collision) {									// --> when the ball enter on collision with the targget
	if (collision.relativeVelocity.magnitude > MinMagnitude && !b_MoveObject){		// minimum magnitude et the Target don't move.	
		if(b_Drop_Target)	
			Desactivate_Object();													// Desactivate Object			
																					
		for(var j : int = 0;j<Parent_Manager.length;j++){
			Parent_Manager[j].SendMessage(functionToCall,index);					// Call Parents Mission script
		}

		if(!sound_.isPlaying && Sfx_Hit)sound_.PlayOneShot(Sfx_Hit,1);				// Play a sound if needed

		if(obj_Game_Manager!=null){
			gameManager.F_Mode_BONUS_Counter();											// Send Message to the gameManager(Manager_Game.js) Add 1 to BONUS_Global_Hit_Counter
			gameManager.Add_Score(Points);												// Send Message to the gameManager(Manager_Game.js) Add Points to Add_Score
		}
		if(Toy)toy.PlayAnimationNumber(AnimNum);									// Play toy animation if needed
	}
}

function Desactivate_Object(){														// --> Desactivate the target
	if(!sound_.isPlaying && Sfx_ActivateDesactivate && target == ActivatePosY){
	sound_.PlayOneShot(Sfx_ActivateDesactivate,volume_Deactivate);}													
	target = DesactivatePosY;
	b_MoveObject = true;
}

function Activate_Object(){															// --> Activate the target
	if(!sound_.isPlaying && Sfx_ActivateDesactivate && target == DesactivatePosY){
	sound_.PlayOneShot(Sfx_ActivateDesactivate,volume_Activate);}
	target = ActivatePosY;
	b_MoveObject = true;
}


function index_info(){																// return the index of the object. Use by missions
	return index;
}