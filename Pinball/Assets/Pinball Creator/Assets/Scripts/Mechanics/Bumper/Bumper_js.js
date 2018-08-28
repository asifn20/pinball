// Bumper.js : Description : Bumper Manager
#pragma strict
@Header ("Infos to missions")	
var index					: int;							// choose a number. Used to create script mission.
var Parent_Manager			: GameObject[];					// Connect on the inspector the missions that use this object
var functionToCall			: String = "Counter";			// Call a function when OnCollisionEnter -> true;

@Header ("Force applied to the ball")	
var bumperForce 			: float = .6;					// modify the force applied to the ball

@Header ("Bumper sound")
var Sfx_Hit 				: AudioClip;					// Sound when ball hit bumper
private var  sound_ 		: AudioSource;					// AudioSource Component

@Header ("Points when the bumper is hit")
var Points					: int = 1000;					// Points you win when the object is hitting 
private var obj_Game_Manager: GameObject;					// Use to connect the gameObject Manager_Game
private var gameManager		: Manager_Game;					// Manager_Game Component from obj_Game_Manager

@Header ("LED connected to the bumper")
var obj_Led					: GameObject;					// Usefull if you want a led blinked when the slingshot is hitting
private var Led_Renderer	: ChangeSpriteRenderer;			// ChangeSpriteRenderer Component from obj_Led

@Header ("Toy connected to the bumper")						// Connect a GameObject or paticule system with the script Toys.js attached
var Toy						: GameObject;
private var toy				: Toys;
var AnimNum					: int = 0;


function Start(){																			// --> function Start
	obj_Game_Manager = GameObject.Find("Manager_Game");										// Find the gameObject Manager_Game
	if(obj_Game_Manager!=null)
	gameManager = obj_Game_Manager.GetComponent.<Manager_Game>();							// Access Manager_Game from obj_Game_Manager
	sound_ = GetComponent.<AudioSource>();													// Access AudioSource Component

	if(obj_Led)Led_Renderer = obj_Led.GetComponent.<ChangeSpriteRenderer>();				// If obj_Led = true; Access ChangeSpriteRenderer Component
	if(Toy)toy = Toy.GetComponent.<Toys>();													// access Toys component if needed
}

function OnCollisionEnter(collision: Collision) {											// --> Detect collision when bumper enter on collision with other objects
	for (var contact : ContactPoint in collision.contacts) {								// if there is a collision : 
		var rb: Rigidbody = contact.otherCollider.GetComponent.<Rigidbody>();				// Access rigidbody Component
		var t : float = collision.relativeVelocity.magnitude;								// save the collision.relativeVelocity.magnitude value
		rb.velocity = Vector3(rb.velocity.x*.25,rb.velocity.y*.25,rb.velocity.z*.25);		// reduce the velocity at the impact. Better feeling with the slingshot
		rb.AddForce( -1 * contact.normal * bumperForce,  ForceMode.VelocityChange);   	  	// Add Force
	}

		if(Sfx_Hit)sound_.PlayOneShot(Sfx_Hit);						// Play a sound

	for(var j : int = 0;j<Parent_Manager.length;j++){
		Parent_Manager[j].SendMessage(functionToCall,index);								// Call Parents Mission script
	}

	if(obj_Game_Manager!=null){
		gameManager.F_Mode_BONUS_Counter();													// Send Message to the gameManager(Manager_Game.js) Add 1 to BONUS_Global_Hit_Counter
		gameManager.Add_Score(Points);														// Send Message to the gameManager(Manager_Game.js) Add Points to Add_Score
	}
	if(obj_Led)Led_Renderer.Led_On_With_Timer(.2);											// If Obj_Led. Switch On the Led during .2 seconds
	if(Toy)toy.PlayAnimationNumber(AnimNum);												// Play toy animation if needed
}
		
function index_info(){																		// return the index of the object. Use by missions
	return index;
}
