// Flippers.js : Description : manage flippers movements
#pragma strict

private var _GetButton							: boolean = false;					// true if you want input manage by Edit -> Project Settings -> Input
var name_F										: String;							// the keyboard input to move the flipper	
@Header ("-> Choose between left or right flipper (only one)")	
var b_Flipper_Left								: boolean = false;					// Left Flipper
var b_Flipper_Right								: boolean = false;					// Right Flipper

var hinge										: HingeJoint;						// access HingeJoint component

@Header ("-> Audio when key input is pressed")	
var Sfx_Flipper 								: AudioClip;						// Audio clip when player presses name_F 
private var source								: AudioSource;						// Audiosourcce component

@Header ("-> Know if the flipper is activated or not")	
var Activate									: boolean = false;					// Know if the flipper is activated or not

private var obj_Game_Manager					: GameObject;						// Access to the Manager_Game gameobject tou can find the hierarchy
private var gameManager_Input					: Manager_Input_Setting;			// use to access Manager_Input_Setting component from Manager_Game gameobject

private var b_touch 							: boolean = false;					// Used to mobile input
private var b_Pause								: boolean = false;				
private var b_Debug								: boolean = false;					// use when you want to make test. Call by Manager_Input_Setting.js

private var Down								: boolean = false;					// use to if key is press when you use Input manager inputs 

private var b_PullPlunger						: boolean = false;					// if you pull the plunger you can't use right flippers

function Awake(){																	// --> Awake
	Physics.IgnoreLayerCollision(8, 9, true);										// Ignore collision between Layer 8 : "Board" and Layer 9 : "Paddle"
	Physics.IgnoreLayerCollision(10, 9, true);										// Ignore collision between Layer 8 : "Board" and Layer 9 : "Paddle"
	Physics.IgnoreLayerCollision(11, 9, true);										// Ignore collision between Layer 8 : "Board" and Layer 9 : "Paddle"
	Physics.IgnoreLayerCollision(12, 9, true);										// Ignore collision between Layer 8 : "Board" and Layer 9 : "Paddle"
	Physics.IgnoreLayerCollision(13, 9, true);										// Ignore collision between Layer 8 : "Board" and Layer 9 : "Paddle"
	Physics.IgnoreLayerCollision(0, 9, true);										// Ignore collision between Layer 8 : "Default" and Layer 9 : "Paddle"
	source = GetComponent.<AudioSource>();											// Access GetComponent.<AudioSource>()
	obj_Game_Manager = GameObject.Find("Manager_Game");							 
	if(obj_Game_Manager!=null)
	gameManager_Input = obj_Game_Manager.GetComponent.<Manager_Input_Setting>();	// 	Access GetComponent..<Manager_Input_Setting>() from the gameObject Manager_Game on the hierarchy
}

function Start() {																	// --> Start
	hinge = GetComponent.<HingeJoint>();											// Access GetComponent.<HingeJoint>()
	yield WaitForEndOfFrame();
	if(b_Flipper_Left && obj_Game_Manager!=null && !_GetButton)name_F = gameManager_Input.F_flipper_Left();	// Choose the keyboard button sttup on Game_Manager object on the hierarchy
	if(b_Flipper_Right && obj_Game_Manager!=null && !_GetButton)name_F = gameManager_Input.F_flipper_Right();	// Choose the keyboard button sttup on Game_Manager object on the hierarchy
}

function F_Activate(){if(!b_Debug)Activate = true;}									// --> Activate the flipper	. Call by Manager_Game.js on game object Manager_Game on the hierarchy
function F_Desactivate(){if(!b_Debug)Activate = false;}								// --> Deactivate the flipper	. Call by Manager_Game.js on game object Manager_Game on the hierarchy
function F_Pause_Start(){b_Pause = true;F_Desactivate();}	
function F_Pause_Stop(){b_Pause = false;F_Activate();}	


function F_Debug(){/*b_Debug = true;Activate = true;*/}

function PreventBugWhenOrientationChange(){											// If the orientation change you say that flippers are released
	b_touch = false;	
}

function Update(){																	// --> Update
	if(Activate){																	// if flipper is activate
		var hingeSpring: JointSpring = hinge.spring;								// Prevent Flipper stuck when flipper need to go back his init position
		hingeSpring.spring = Random.Range(1.99,2.01);
		hinge.spring = hingeSpring;

		for (var i: int = 0; i < Input.touchCount; ++i) {							// --> Touch Screen part
			if (Input.GetTouch(i).phase == TouchPhase.Began) {
		
				var ray : Ray  = Camera.main.ScreenPointToRay(Input.mousePosition);	// Construct a ray from the current touch coordinates
				var hit : RaycastHit ;

				if (Physics.Raycast(ray, hit, 100) 									// Don't move the right flippers if you pull the plnuger
				&& (hit.transform.name == "Mobile_Collider_zl" || hit.transform.name == "Mobile_Collider")) {
					b_PullPlunger = true;
				}
				else{
					b_PullPlunger = false;
				}
			}



			if(!b_PullPlunger && b_Flipper_Right && Input.GetTouch(i).position.x > Screen.width*.5	// know which part of the screen is touched by the player
				&& Input.GetTouch(i).position.y < Screen.height*.6 
				|| b_Flipper_Left && Input.GetTouch(i).position.x < Screen.width*.5 
				&& Input.GetTouch(i).position.y < Screen.height*.6){
				if (Input.GetTouch(i).phase == TouchPhase.Began ){					// if touch is detect 	
					if(Sfx_Flipper){
						source.volume = 1;
						source.PlayOneShot(Sfx_Flipper);							// play a sound
					}
					b_touch = true;												
				}
				else if(Input.GetTouch(i).phase == TouchPhase.Ended){
					b_touch = false;
				}
			}
		}
		if(!_GetButton){															// if a key is pressed
			if(Input.GetKeyDown(name_F) && Sfx_Flipper){
				source.volume = 1;
				source.PlayOneShot(Sfx_Flipper);									// play a sound
			}
		}
		else{
			//if(Input.GetButtonDown(name_F) && Sfx_Flipper){
			if(Input.GetAxisRaw(name_F) != 0 && !Down && Sfx_Flipper){
				source.volume = 1;
				source.PlayOneShot(Sfx_Flipper);									// play a sound
				Down = true;
			}
		}


		if(!_GetButton){
			if(Input.GetKey(name_F) || b_touch){										// --> the player presses a button or presses a touch screen
				var motor = hinge.motor;												// move the flipper
				hinge.motor = motor;
				hinge.useMotor = true;
			}
			else{																		// --> Flipper go to the init position.
				motor = hinge.motor;													// move the flipper to reach the init position
				hinge.motor = motor;
				hinge.useMotor = false;
			}
		}
		else{
			if(Input.GetAxisRaw(name_F) && _GetButton || b_touch){						// --> the player presses a button or presses a touch screen
				motor = hinge.motor;													// move the flipper
				hinge.motor = motor;
				hinge.useMotor = true;
			}
			else{																		// --> Flipper go to the init position.
				motor = hinge.motor;													// move the flipper to reach the init position
				hinge.motor = motor;
				hinge.useMotor = false;
				Down = false;
			}
		}
	}	
	else if(!b_Pause){																			// --> When the table is tilted. 
		motor = hinge.motor;														//		Flipper is desactivate. But you want him to go to the init position.
		hinge.motor = motor;
		hinge.useMotor = false;
	}
}


function F_InputGetButton(){														// use Edit -> Project Settings -> Input for Flippers
	_GetButton = true;
	if(b_Flipper_Left)name_F = gameManager_Input.F_flipper_Left();	// Choose the keyboard button sttup on Game_Manager object on the hierarchy
	if(b_Flipper_Right)name_F = gameManager_Input.F_flipper_Right();	// Choose the keyboard button sttup on Game_Manager object on the hierarchy

}

function ActivateFlipper(){												// Use This function is you want to activate flippers outside this script.Call SendMessage("ActivateFlipper");
	if(Sfx_Flipper){
		source.volume = 1;
		source.PlayOneShot(Sfx_Flipper);							
	}
	b_touch = true;		
}

function DeactivateFlipper(){											// Use This function is you want to deactivate flippers outside this script. Call SendMessage("DeactivateFlipper");
	b_touch = false;
}