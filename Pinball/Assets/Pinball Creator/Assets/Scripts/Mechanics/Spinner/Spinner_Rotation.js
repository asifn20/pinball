// Spinner : Description : Manage the rotation of the spinner
#pragma strict
private var hinge 			: HingeJoint;
private var b_Timer 		: boolean = false;
var Sfx_Hit					: AudioClip ;
private var  sound_ 		: AudioSource;
private var obj_Game_Manager: GameObject;
private var gameManager		: Manager_Game;
private var b_Pause			: boolean = false;

function Start(){
	Physics.IgnoreLayerCollision(0,10, true);										// Default = 0 L_Spinner = 10
		hinge = GetComponent.<HingeJoint>();
		var motor = hinge.motor;
		hinge.motor = motor;
		hinge.useMotor = true;

	obj_Game_Manager = GameObject.Find("Manager_Game");
	gameManager = obj_Game_Manager.GetComponent.<Manager_Game>();	
	sound_ = GetComponent.<AudioSource>();
}


function Update(){																	// Decrease the spinner speed
	if(b_Timer && !b_Pause){																	
		var motor = hinge.motor;				
		motor.targetVelocity = Mathf.MoveTowards(motor.targetVelocity,0,700*
		Time.deltaTime);
		hinge.motor = motor;
		if(motor.targetVelocity == 0){
			b_Timer = false;
		}
	}
}


function Spin(value : float){														// Call by the script Spinner_Trigger.js on gameObject Trigger_Spinner on the hierarchy
	if(Sfx_Hit)sound_.PlayOneShot(Sfx_Hit);	
	var motor = hinge.motor;
	motor.targetVelocity = 1000*value;

	hinge.motor = motor;
	b_Timer = true;
}

function F_Pause_Start(){hinge.useLimits = true;b_Pause = true;}					// Use when Pause mode enable
function F_Pause_Stop(){hinge.useLimits = false;b_Pause = false;}	