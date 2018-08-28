// Spring_Launcher.js : Description : Manage the spring Launcher
#pragma strict
private var rb					: Rigidbody;
private var _GetButton			: boolean = false;					// true if you want input manage by Edit -> Project Settings -> Input
@Header ("Manual or Auto launcher")
var Auto_Mode					: boolean = false;						// true : Auto / false : Manual
private var rb_Ball				: Rigidbody;
private var Activate			: boolean = false;
private var name_F 				: String;

@Header ("Force apply to the ball")
var _Spring_Force				: float = 7;							// force apply to the ball
private var tmp_Spring_Force	: float;

@Header ("Sound fx")
var Sfx_Pull 					: AudioClip;							// sound played when you pull the plunger
private var Play_Once			: boolean = false;
var Sfx_Kick 					: AudioClip;							// sound played when the ball is kicked
private var  sound_ 			: AudioSource;							// Audiosource component

private var Spring_Max_Position : float = 0;							// spring maximum position
private var Spring_Min_Position : float = -.6;							// spring minimum position

private var obj_Game_Manager	: GameObject;							// Game_Manager
private var gameManager_Input	: Manager_Input_Setting;				// access Manager_Input_Setting from Game_Manager on the hierarchy

@Header ("Spring force to change cam view")
var Cam_Change_Min				: float = .4;							// if the force is greater than this value , the camera returns to the previous camera
private var Camera_Board		: GameObject;							// Access camera
private var camera_Movement		: Camera_Movement;						// Access Camera component

@Header ("Time To wait before player could launch the ball")	
var Timer						: float = .5;							// Time to wait before player could launch the ball
private var tmp_Timer 			: float = 0;
private var b_Timer				: boolean = false;

private var Ball_ExitThePlunger : boolean = false;					

private var b_Debug				: boolean = false;						// use when you want to make test. Call by Manager_Input_Setting.js		
private var b_touch 			: boolean =false;
private var b_Tilt 				: boolean = false;
private var obj_Mission_SkillShot: GameObject;

public var _BoxCollider		: BoxCollider;

function Start() {														// --> Init
   	Camera_Board = GameObject.Find("Main Camera");						// init Camera
	if(!b_Debug && Camera_Board && Camera_Board.GetComponent.<Camera_Movement>())
		camera_Movement = Camera_Board.GetComponent.<Camera_Movement>();

	rb = GetComponent.<Rigidbody>();
	sound_ = GetComponent.<AudioSource>();								// init audio

	obj_Game_Manager = GameObject.Find("Manager_Game");					// init game_Manager
	if(obj_Game_Manager != null){
		gameManager_Input = obj_Game_Manager.GetComponent.<Manager_Input_Setting>();	

		name_F = gameManager_Input.F_Plunger();
	}
}

function Update(){														// --> Update
	if(Activate && Auto_Mode){											// Case : AutoMode : true
		if(!_GetButton){
			if(Input.GetKeyDown(name_F)){
				Ball_AddForceExplosion();									//	Add Force
				if(!b_Debug && camera_Movement)camera_Movement.PlayIdle();	// Change Cam
				F_Desactivate();											// Desactivate spring
			}
		}
		else{
			if(Input.GetButtonDown(name_F)){
				Ball_AddForceExplosion();									//	Add Force
				if(!b_Debug && camera_Movement)camera_Movement.PlayIdle();	// Change Cam
				F_Desactivate();											// Desactivate spring
			}
		}
	}


	for (var i: int = 0; i < Input.touchCount; ++i) {					// This part is used for mobile control
		if (Input.GetTouch(i).phase == TouchPhase.Began) {
			var ray: Ray = Camera.main.ScreenPointToRay(Input.GetTouch(i).position);
			var hit: RaycastHit;
			if (Physics.Raycast (ray, hit, 100) ) {
				if(hit.transform.name == "Mobile_Collider" || hit.transform.name == "Mobile_Collider_zl"){
					b_touch = true;
				}
			}	

		}
		if (Input.GetTouch(i).phase == TouchPhase.Ended) {
			b_touch = false;
		}
	}



	if(Activate  && !Auto_Mode){										// -> Case : Manual Mode : Auto_mode = false

		if(!_GetButton){
			if(Input.GetKey(name_F) || b_touch){
			 	if(transform.localPosition.z >= Spring_Min_Position){
			 			transform.localPosition.z = 						// Move the spring launcher
			 			Mathf.MoveTowards(transform.localPosition.z, Spring_Min_Position, 1* Time.deltaTime);


			 		if(!sound_.isPlaying && Sfx_Pull && !Play_Once){		// play a sound
			 			sound_.clip = Sfx_Pull;
			 			sound_.volume = .7; 
			 			sound_.Play();
			 			Play_Once = true;
			 		}
				}
				tmp_Spring_Force = _Spring_Force*.5*transform.localPosition.z*transform.localPosition.z;	// save the force
			}
			else{
				if(Activate){
				 	if(transform.localPosition.z < Spring_Max_Position){

				 		transform.localPosition.z = Mathf.MoveTowards(transform.localPosition.z, Spring_Max_Position, 15 * Time.deltaTime);

				 		if(transform.localPosition.z ==0 ){
				 			if(Play_Once){
				 				sound_.Stop();
				 				Play_Once = false;
				 			}
				 			Ball_AddForceExplosion();							// add force
				 		}
					}
				}
			}
		}
		else {
			if(Input.GetButton(name_F) || b_touch){
				if(transform.localPosition.z >= Spring_Min_Position){
			 			transform.localPosition.z = 						// Move the spring launcher
			 			Mathf.MoveTowards(transform.localPosition.z, Spring_Min_Position, 1* Time.deltaTime);


			 		if(!sound_.isPlaying && Sfx_Pull && !Play_Once){		// play a sound
			 			sound_.clip = Sfx_Pull;
			 			sound_.volume = .7; 
			 			sound_.Play();
			 			Play_Once = true;
			 		}
				}
				tmp_Spring_Force = _Spring_Force*.5*transform.localPosition.z*transform.localPosition.z;	// save the force
			}
			else{
				if(Activate){
				 	if(transform.localPosition.z < Spring_Max_Position){

				 		transform.localPosition.z = Mathf.MoveTowards(transform.localPosition.z, Spring_Max_Position, 15 * Time.deltaTime);

				 		if(transform.localPosition.z ==0 ){
				 			if(Play_Once){
				 				sound_.Stop();
				 				Play_Once = false;
				 			}
				 			Ball_AddForceExplosion();							// add force
				 		}
					}
				}
			}
		}

	
		if(Ball_ExitThePlunger && transform.localPosition.z ==0){		// Prevent error with th camera movement
			F_Desactivate();
		}
	}
	else if(!Activate && !Auto_Mode){									// Move the spring launcher to init his position
		 	if(transform.localPosition.z < Spring_Max_Position){
		 		transform.localPosition.z = Mathf.MoveTowards(transform.localPosition.z, Spring_Max_Position, 15 * Time.deltaTime);
		 		if(transform.localPosition.z ==0 ){
		 			Play_Once = false;
		 		}
			}
	}

	if(b_Timer){													// Time to wait before adding force to the ball after the respawn
		tmp_Timer = Mathf.MoveTowards(tmp_Timer,Timer,				// Prevent error with th camera movement
			Time.deltaTime);
		if(Timer == tmp_Timer){										// Shoot ball enable.  		
			tmp_Timer = 0;
			b_Timer = false;
			Activate = true;
		}
	}


	if(b_Tilt && rb_Ball){											// Prevent Bug : Kick the ball if the game is on tilt mode and a ball on the plunger
		rb_Ball.AddForce(transform.forward*_Spring_Force, ForceMode.VelocityChange);	
		if(!b_Debug && camera_Movement)camera_Movement.PlayIdle();	
		if(!sound_.isPlaying && Sfx_Kick)sound_.PlayOneShot(Sfx_Kick);
		rb_Ball = null;
	}
}

function F_Activate(){ 															// Activate the plunger	. Call by Manager_Game.js on game object Manager_Game on the hierarchy
	b_Timer = true;	Ball_ExitThePlunger = false;
	if(_BoxCollider)_BoxCollider.enabled = true;	
}			
function F_Desactivate(){														// Desactivate the plunger. Call by Manager_Game.js on game object Manager_Game on the hierarchy
	Activate = false;
	if(_BoxCollider)_BoxCollider.enabled = false;
}										
function F_Activate_After_Tilt(){ 												// Activate the plunger if the table is tilted..Call by Manager_Game.js on game object Manager_Game on the hierarchy
	b_Timer = true;								
	Ball_ExitThePlunger = false;
	b_Tilt = false;
	if(_BoxCollider)_BoxCollider.enabled = true;
} 									

function Tilt_Mode(){b_Tilt = true;}											//  Desactivate the plunger if the table is tilted. Call by Manager_Game.js on game object Manager_Game on the hierarchy
	

function Ball_AddForceExplosion(){												// --> Add force to the ball
	if(rb_Ball != null){
		if(!Auto_Mode){
			rb_Ball.AddForce(transform.forward*_Spring_Force*tmp_Spring_Force*tmp_Spring_Force, ForceMode.VelocityChange);	
			if(Cam_Change_Min < tmp_Spring_Force){
		 		if(camera_Movement)camera_Movement.PlayIdle();	
		 		Ball_ExitThePlunger = true;
		 		if(obj_Mission_SkillShot)										// if obj_Mission_SkillShot != null send a message to start the skillshot timer on the skillshot mission 
		 			obj_Mission_SkillShot.SendMessage("Skillshot_Mission");		
		 	}
		}
		else{
			if(!b_Debug && camera_Movement)camera_Movement.PlayIdle();	

			rb_Ball.AddForce(transform.forward*_Spring_Force, ForceMode.VelocityChange);	
		}
		if(!sound_.isPlaying && Sfx_Kick)sound_.PlayOneShot(Sfx_Kick);
		tmp_Spring_Force = 0;
		rb_Ball = null;
	}
}


function BallOnPlunger(rb_obj : Rigidbody){										// Know if the ball is on the plunger
	if(!b_Debug && camera_Movement && rb_obj)camera_Movement.PlayPlunger();

	if(rb_obj){F_Activate();}
	else{F_Desactivate();}

	rb_Ball = rb_obj;				
}

function F_Debug(){
	b_Debug = true;
}

function Connect_Plunger_To_Skillshot_Mission(obj : GameObject){				// --> Call by the mission that use the skillshot  
	obj_Mission_SkillShot = obj;
}


function F_InputGetButton(){														// use Edit -> Project Settings -> Input for Flippers
	_GetButton = true;
}

function ActivatePlunger(){									// Use This function is you want to pull plunger outside this script.Call SendMessage("ActivatePlunger");
	if(!sound_.isPlaying && Sfx_Pull && !Play_Once){		
		sound_.clip = Sfx_Pull;
		sound_.volume = .7; 
		sound_.Play();
		Play_Once = true;
	}
	b_touch = true;	

}

function DeactivatePlunger(){								// Use This function is you want to push plunger outside this script.Call SendMessage("DeactivatePlunger");
	b_touch = false;
}
