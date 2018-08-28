// FocuCamEnterExit.js : Description : script use when you want the camera focus on a specific element
#pragma strict

private var cam 	: CameraSmoothFollow;			// Access Component CameraSmoothFollow from the main camera
@Header ("Choose the focus view you want to use")
var FocusCam 			: int = 0;					// Select in the inspector The view you want to use. use -1 for the Exit trigger

function Start(){
	var tmp : GameObject  = GameObject.Find("Pivot_Cam");
	if(tmp)cam = tmp.GetComponent.<CameraSmoothFollow>();	// Access Component CameraSmoothFollow from the main camera
}

function OnTriggerEnter(other : Collider) {	// --> When the ball enter the trigger, the camera view change
	if(other.tag == "Ball")
		cam.FocusCam(FocusCam);
}