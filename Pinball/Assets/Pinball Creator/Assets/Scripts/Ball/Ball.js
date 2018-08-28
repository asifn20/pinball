// Ball.js : Description : this script manage the ball (sound, collision, trail)
#pragma strict
private var rb					: Rigidbody;									// Ball RigidBody Component
private var trail				: TrailRenderer;								// Ball TrailRenderer Component
@Header ("The maximum speed of the ball")	
var maxSpeed					: float = 25;									// change the ball Max speed on table. If you change the cabinet scale you probably must increase the Max speed

@Header ("Trail")														
var Speed_To_Activate_Trail 	: float = .5;									// The Trail become active when ball speed is superior to Speed_To_Activate_Trail
private var b_trail 			: boolean = true;

private var tmp_vel 			: Vector3;										// Used with the function Ball_Pause()

@Header ("Roll Sound")	
private var roll_audio			: AudioSource;									// roll AudioSource Component
private var once				: boolean = false;								// Boolean used to play roll sound only if the sound is not playing
var min_Mag_roll_audio			: float = 1;									// The minimum speed to play the roll sound
private var tmp_Save_Min_Mag	: float = 0;



var b_Shake						: boolean = false;
var Shake_Force					: float = 2;


private var b_OnHole			: boolean = false;								// Use to know if ball is on a hole or not


function Start() {																// --> function Start			
	rb = GetComponent.<Rigidbody>();											// Access <Rigidbody>() Component;	
	trail = GetComponent.<TrailRenderer>();										// Access <TrailRenderer>() Component;	


	roll_audio = GetComponent.<AudioSource>();						// Access <AudioSource>() Component; if roll sound is selected on the inspector

}

function Ball_Shake(Direction : Vector3){
	if(rb)rb.AddForce(Direction*Shake_Force, ForceMode.VelocityChange);	
}


function FixedUpdate()															// --> Fixed Update : FixedUpdate is used to deal with Physics
{
	if(rb.velocity.magnitude > maxSpeed)										// Limit ball speed.
    {
    	rb.velocity 			
    		= rb.velocity.normalized * maxSpeed;
    }

	if(b_trail && rb.velocity.magnitude > Speed_To_Activate_Trail)				// Enable ball trail.
    {
     	trail.enabled=true; 
     	b_trail = false;
    }
	if(!b_trail && rb.velocity.magnitude < Speed_To_Activate_Trail)				// Desable ball trail.
    {
     	trail.enabled=false; 
     	b_trail = true;
    }

    if(rb.velocity.magnitude > min_Mag_roll_audio && once)						// Play the roll sound.
    {
     	roll_audio.Play();
     	once = false;
    }
    else if(rb.velocity.magnitude <= min_Mag_roll_audio && !once)				// Stop the roll sound.
    {
     	roll_audio.Stop();
     	roll_audio.pitch = 1;
     	once = true;
    }

    if(!once && tmp_Save_Min_Mag == 0){
   	 roll_audio.pitch = rb.velocity.magnitude/2.5;								// When ball accelerate the pitch increase. 
   	}

}


function Ball_Pause(){															// --> Function Call When the game is on pause
	if(!b_OnHole){
		if(!rb.isKinematic){													// Start Pause
			tmp_vel = rb.velocity;
			rb.isKinematic = true;
		}
		else{																	// Stop Pause
			rb.isKinematic = false;
			rb.velocity = tmp_vel;
		}	
	}	
}

function OnHole(){																// --> Know if ball is on a hole. Prevent bug when a ball enter a hole and player press pause.
	b_OnHole = true;
}

function OutsideHole(){															
	b_OnHole = false;
}


function OnTriggerEnter(other : Collider){
	if(other.transform.tag == "Ramp_Sound" && tmp_Save_Min_Mag == 0){
		Debug.Log("Ramp SOund Start");
		tmp_Save_Min_Mag = min_Mag_roll_audio;
		min_Mag_roll_audio = 0;
	}
	else if(other.transform.tag == "Ramp_Sound"){
		Debug.Log("Ramp SOund Stop ");
		min_Mag_roll_audio = tmp_Save_Min_Mag;
		tmp_Save_Min_Mag = 0;
	}
}