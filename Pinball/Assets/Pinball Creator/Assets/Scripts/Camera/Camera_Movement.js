// Camera_Movement : Description : Use on the GameObject Main_Camera on the hierarchy. 
// Manage Animator attach to the game Object
// Manage the UI button named  Text_Camera on the hierachy 
// This script send message to the script CameraSmoothFollow that you could find on game Object Pivot_Cam on the hierarchy
#pragma strict

private var anim				: Animator;												// Animator Component
private var MoveHash			: int = Animator.StringToHash("b_Move");				// Refers to Animator Parameters b_Move.
private var MoveStateHash 		: int = Animator.StringToHash("Base.Movement");			// Refers to Animator State Movement

private var IdleHash			: int = Animator.StringToHash("b_Idle_View");			// Refers to Animator Parameters b_Idle_View.
private var IdleStateHash_1 	: int = Animator.StringToHash("Base.Idle_View_1");		// Refers to Animator State Idle_View_1


private var IdleHash_2			: int = Animator.StringToHash("b_Plunger");				// Refers to Animator Parameters b_Plunger.

private var PlungerHash			: int = Animator.StringToHash("b_Plunger_View");		// Refers to Animator Parameters b_Plunger_View.
private var PlungerStateHash_1 	: int = Animator.StringToHash("Base.Plunger_View");		// Refers to Animator State Plunger_View

private var ShakerHash			: int = Animator.StringToHash("b_Shake");				// Refers to Animator Parameters b_Shake.
private var ShakeStateHash_Right: int = Animator.StringToHash("Base.Shake_Right");		// Refers to Animator State Shake_Right
private var ShakeStateHash_Left	: int = Animator.StringToHash("Base.Shake_Left");		// Refers to Animator State Shake_Left
private var ShakeStateHash_Up	: int = Animator.StringToHash("Base.Shake_Up");			// Refers to Animator State Shake_Up
private var ShakeStateHash_Right_Plunger	: int = Animator.StringToHash("Base.Shake_Left_Plunger");			// Refers to Animator State Shake_Up_Plunger
private var ShakeStateHash_Left_Plunger	: int = Animator.StringToHash("Base.Shake_Right_Plunger");			// Refers to Animator State Shake_Up_Plunger
private var ShakeStateHash_Up_Plunger	: int = Animator.StringToHash("Base.Shake_Up_Plunger");			// Refers to Animator State Shake_Up_Plunger


public var CamView				: int = 1;												// the camera currently used

var Txt							: UI.Text;												// Object to write the camera currently used
private var b_ChangeViewEnable 	: boolean = true;										// The camera could change only if b_ChangeViewEnable = true
private var Timer_ChangeView	: float = 0;											// Timer to calculate the minimum time before you could change the camera

private var obj_Pivot_Cam 		: GameObject;											// the game object parent with the script CameraSmoothFollow.js								
private var cameraSmoothFollow 	: CameraSmoothFollow;									// use to access CameraSmoothFollow component

// Multi Ball variable
private var CameraMultiBall 	: boolean = false;										// Use when the game is on multiBall mode
private var LastView 			: int;													// Use when the game is on multiBall mode 

private var CamStyle2D 				: boolean = false;										// Use to know if a 2D camera is used

function Start () {
	anim = GetComponent.<Animator>();													// Access to the Animator Component
	obj_Pivot_Cam = GameObject.Find("Pivot_Cam");										// Find object named Pivot_Cam on the hierarchy
	cameraSmoothFollow = obj_Pivot_Cam.GetComponent.<CameraSmoothFollow>();				// Access to the CameraSmoothFollow Component from obj_Pivot_Cam

 	var stateInfo : AnimatorStateInfo = anim.GetCurrentAnimatorStateInfo(0);			// know what animation is active
    if(stateInfo.fullPathHash == MoveStateHash)			
		cameraSmoothFollow.Player_Change_Camera(8);										// if MoveStateHash is set at default layer state
    else
    	cameraSmoothFollow.Player_Change_Camera(1);										// if IdleStateHash_1 is set at default layer state

	LastView = CamView;

	var tmp : GameObject = GameObject.Find("PauseAndView");								// Find Gameobject Text_Camera
	if(tmp!=null){
	 	for (child in tmp.transform) {
			var Typedchild : Transform = child as Transform;
			if(Typedchild.name == "Text_Camera"){
				Txt = Typedchild.GetComponent.<UI.Text>();								// Access the component UI.Text
				tmp = GameObject.Find("PauseAndView");
				if(tmp!=null){
				 	for (child2 in tmp.transform) {
						var Typedchild2 : Transform = child2 as Transform;
						if(Typedchild2.name == "btn_Mobile_Pause"){
							Txt.transform.SetParent(Typedchild2);						// Make the gameObject child of btn_Mobile_Pause gameObject
							Txt.gameObject.SetActive(true);								// Set active this gamObject
						}
			 		}
			 	}
			}
 		}
 	}

 	if(cameraSmoothFollow.Return_CamStyle())CamStyle2D = true;							// Cam 2D is used
}


function Update () {
 	var stateInfo : AnimatorStateInfo = anim.GetCurrentAnimatorStateInfo(0);			// know what animation is active
    if(stateInfo.fullPathHash == MoveStateHash)											// If the active state is MoveStateHash ("Base.Movement")
		anim.SetBool(MoveHash, false);													// Animator Parameters MoveHash ("b_Move") = false
  
    if(!b_ChangeViewEnable){															// --> Minimium time before two animations. .5 seconds
    	Timer_ChangeView = Mathf.MoveTowards(Timer_ChangeView,.5,Time.deltaTime);
    	if(Timer_ChangeView == .5){
    		b_ChangeViewEnable = true;
    		Timer_ChangeView = 0;
    	}
    }

	if(stateInfo.fullPathHash == ShakeStateHash_Right
		|| stateInfo.fullPathHash == ShakeStateHash_Left
		|| stateInfo.fullPathHash == ShakeStateHash_Up
		|| stateInfo.fullPathHash == ShakeStateHash_Up_Plunger
		|| stateInfo.fullPathHash == ShakeStateHash_Right_Plunger
		|| stateInfo.fullPathHash == ShakeStateHash_Left_Plunger
		)		
		anim.SetInteger(ShakerHash, 0);	
}

function Shake_Cam(shake : int){														// Play a specific animation when player shake the pinball. It's call by Manager_Game.js from the gameObject Manager_Game on the hierarchy
	anim.SetInteger(ShakerHash, shake);

}

function StartPauseMode(){anim.speed = 0;}
function StopPauseMode(){anim.speed = 1;}

function PlayAnimation(){																// Play an animation ("Base.Movement").
	anim.SetBool(MoveHash, true);														// Animator Parameters MoveHash ("b_Move") = true
}


function PlayIdle(){																	// This function is call by the script Spring_Launcher.js from the gameObject Spring on the hierachy
if(!CamStyle2D){
		anim.SetInteger(ShakerHash, 0);
		anim.SetBool(IdleHash_2, false);													// The ball exit the plunger										
		cameraSmoothFollow.ExitPlunger(CamView);	
	}										
}


function PlayPlunger(){																	// This function is call by the script Spring_Launcher.js from the gameObject Spring on the hierachy 
	var stateInfo : AnimatorStateInfo = anim.GetCurrentAnimatorStateInfo(0);			// The ball enter the plunger
	//if(!CamStyle2D){
	   	if(stateInfo.fullPathHash == IdleStateHash_1 									
	    	|| stateInfo.fullPathHash == MoveStateHash){			
	    	anim.SetInteger(ShakerHash, 0);										
			anim.SetBool(IdleHash_2, true);													// Play the plunger animation
			cameraSmoothFollow.Plunger(5);													// Change the position of the camera
		}
	//}

}


function Selected_Cam(){																// This function is used by the gameObject btn_Cam on the hierarchy to change the camera with a button on screen
	var stateInfo : AnimatorStateInfo = anim.GetCurrentAnimatorStateInfo(0);
	if(!CamStyle2D){
		if(b_ChangeViewEnable && !CameraMultiBall && stateInfo.fullPathHash != MoveStateHash){
			b_ChangeViewEnable = false;
			CamView ++;																		// Choose the next camera
			if(CamView == 5)
				CamView = 1;
			cameraSmoothFollow.Player_Change_Camera(CamView);								// Change the position of the camera
			if(Txt)Txt.text = CamView.ToString();										// Change Text on screen
		}
	}
}


function Camera_MultiBall_Start(){									// --> Call by Manager_Game.js to use a specific camera when MultiBall Mode Start. Camera 4 is used
	if(!CamStyle2D){
	LastView = CamView;												// Save the camera number
	if(CamView == 1 || CamView == 2){								// The camera change only if it's cam 1 and cam 2 because cam 3 and 4 already sees the whole playfield 
		if(b_ChangeViewEnable){
			b_ChangeViewEnable = false;
			CamView = 6;											// Transition between cam 1 and 4. Change animation
			cameraSmoothFollow.Player_Change_Camera(CamView);		// Change the target that the camera look at

		}
						
	}
	if(Txt)Txt.text = "";													// Change Text on screen
	CameraMultiBall = true;	
	}
}
function Camera_MultiBall_Stop(){									// --> Call by Manager_Game.js to use a specific camera when MultiBall Mode Stop
	if(!CamStyle2D){												
		CameraMultiBall = false;
		if(b_ChangeViewEnable){
			b_ChangeViewEnable = false;	
			CamView = LastView;											// Use to choose the good camera after MultiBall

			var tmp_Cam : int;
			if(CamView < 5)		
				tmp_Cam = 1;
			else
				tmp_Cam = CamView;
			anim.SetInteger(IdleHash, tmp_Cam);							// Play animation
																				
			cameraSmoothFollow.Player_Change_Camera(CamView);			// Change the target that the camera look at
			if(Txt)Txt.text = LastView.ToString();								// Change Text on screen
		}
	}
}
