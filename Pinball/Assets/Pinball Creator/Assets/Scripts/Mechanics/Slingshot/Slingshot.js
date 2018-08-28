// Slingshot.js : Description : Mange slingshot mechanics.
#pragma strict
@Header ("Infos to missions")
var index					: int;							// choose a number. Used to create script mission.
var Parent_Manager			: GameObject[];					// Connect on the inspector the missions that use this object
var functionToCall			: String = "Counter";			// Call a function when OnCollisionEnter -> true;

@Header ("Force parameters")	
var Slingshot_force			: float  = 10;					// change the slingshot force added to a ball
var ForceMinimum			: float    = 1;  				// Minimum contact velocity between ball and slingshot to apply force
var relativeVelocityMax		: float    = 1;					// The maximum force apply to the ball

@Header ("Sound fx")	
var Sfx_Hit					: AudioClip ;					// Sound when ball hit the slingshot		
private var  sound_ 		: AudioSource;					// Audio Component

@Header ("Points when the slingshot is hit")
var Points					: int = 1000;					// Points you win when the object is hitting 
private var obj_Game_Manager: GameObject;
private var gameManager		: Manager_Game;

@Header ("Connect a led")
var obj_Led					: GameObject;					// Usefull if you want a led blinked when the slingshot is hitting
private var Led_Renderer	: ChangeSpriteRenderer;

@Header ("Toy connected to the Slingshot")					// Connect a GameObject or paticule system with the script Toys.js attached
var obj_Toy					: GameObject;					// Usefull if you want a led blinked when the slingshot is hitting
private var toy				: Toys;
var animNumber				: int = 0;


function Start(){																	//	--> Init
	obj_Game_Manager = GameObject.Find("Manager_Game");								// Find the gameObject Manager_Game
	if(obj_Game_Manager!=null)
	gameManager = obj_Game_Manager.GetComponent.<Manager_Game>();					// Access Manager_Game from obj_Game_Manager
	sound_ = GetComponent.<AudioSource>();											// Access AudioSource Component

	if(obj_Led)Led_Renderer = obj_Led.GetComponent.<ChangeSpriteRenderer>();		// Access led component if needed

	if(obj_Toy)toy = obj_Toy.GetComponent.<Toys>();									// Access led component if needed
}

function OnCollisionEnter(collision: Collision) {									// --> OnCollisionEnter with the ball
	var rb: Rigidbody = collision.gameObject.GetComponent.<Rigidbody>();

	if (rb != null && collision.relativeVelocity.magnitude > ForceMinimum){
		if(collision.relativeVelocity.magnitude < relativeVelocityMax){
			//Debug.Log("Yipo");
			var t : float = collision.relativeVelocity.magnitude;
			rb.velocity = Vector3(rb.velocity.x*.5,rb.velocity.y*.5,rb.velocity.z*.5);			// reduce the velocity at the impact. Better feeling with the slingshot
			rb.AddForce(transform.forward*Slingshot_force*t,ForceMode.VelocityChange);			// add force
		}
		else
			rb.AddForce(transform.forward*Slingshot_force*relativeVelocityMax,ForceMode.VelocityChange);


		if(Sfx_Hit)sound_.PlayOneShot(Sfx_Hit);										// Play a sound if needed

		for(var j : int = 0;j<Parent_Manager.length;j++){
			Parent_Manager[j].SendMessage(functionToCall,index);					// Call Parents Mission script
		}

		gameManager.F_Mode_BONUS_Counter();											// add one to the BONUS_Counter
		gameManager.Add_Score(Points);												// add points

		if(obj_Led)Led_Renderer.Led_On_With_Timer(.2);								// blinking

		if(obj_Toy)toy.PlayAnimationNumber(animNumber);								// play animation
	}
}
