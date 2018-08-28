// Debug_Test_Ball.js : Description : Use on Prefab Debug_Test_Ball. Allow you to put the ball somewhere on playfield and add force to it.
// When you press a key the ball on playfield go to respawn position. When press key up a force is added to the ball. If there is no ball on playfield a ball is created
#pragma strict

var obj_Ball 				: GameObject;					// Connect Ball : Pinball_ball prefab
private var tmp_rb			: Rigidbody;					// access rgidbody component
var obj_Spawn				: GameObject;					// Connect ball respawn position

private var sound_			: AudioSource;					// audiosource component
var a_Loading				: AudioClip;					// sound
var a_Shoot					: AudioClip;					// sound

var TimeBeforeShootTheBall	: float = 1;					// choose time before you add force to the ball
var Force 					: float = 2;

var ReuseBall 				: boolean = true;				// if true : Check if there is a ball on playfield. If there is a ball on playfield the ball goes to respawn position.	If there is no ball on playfield a ball is created			
var Input_Key				: String = "";					// Choose the input key that respawn the ball on playfield

function Start () {																	// --> Init
	sound_ = GetComponent.<AudioSource>();											// access audiosource component
}

function Update () {																// --> Update
	if(Input.GetKeyDown(Input_Key)){												// GetKeyDown : ball go to the respwn position
		if(ReuseBall){																// ReuseBall = true
			var gos : GameObject[];
        	gos = GameObject.FindGameObjectsWithTag("Ball"); 						// Find ball oon playfield
  
        	if (gos.length != 0) {													// there is a ball on playfield
            	var tmp_Ball = gos[0];
            	tmp_Ball.transform.localPosition = obj_Spawn.transform.position;
            	tmp_Ball.transform.rotation = obj_Spawn.transform.rotation;
            	tmp_Ball.GetComponent.<Rigidbody>().isKinematic = true;
            	tmp_Ball.GetComponent.<Rigidbody>().velocity = Vector3(0,0,0);
       		}
			else{																	// there is no ball on playfield
       			tmp_Ball = Instantiate(obj_Ball, 
       				obj_Spawn.transform.position, 
       					obj_Spawn.transform.rotation);
       		}
		}
		else{																		// ReuseBall = false												
			tmp_Ball = Instantiate(obj_Ball, 
				obj_Spawn.transform.position, 
					obj_Spawn.transform.rotation);
		}
		tmp_rb = tmp_Ball.GetComponent.<Rigidbody>();
		tmp_rb.isKinematic = true;
	}

	if(Input.GetKeyUp(Input_Key)){													// GetKeyUp : add force to the ball
		sound_.clip = a_Loading;
		sound_.Play();
		Ball_AddForceExplosion();
	}
}

function Ball_AddForceExplosion(){													// --> Add force
	yield WaitForSeconds(TimeBeforeShootTheBall);
	tmp_rb.isKinematic = false;
	tmp_rb.AddForce(transform.forward*Force, ForceMode.VelocityChange);	
	sound_.clip = a_Shoot;
	sound_.Play();
}