// Manager_Input_Setting : Description 

#pragma strict
@Header ("Game Input")
var _Input_GetButton			: boolean = false;					// true if you want input manage by Edit -> Project Settings -> Input
var Flipper_Left				: String = "left shift";
var Flipper_Right				: String = "right shift";
var Plunger						: String = "return";
var Pause_Game					: String = "e";
var Change_Camera				: String = "c";
var Shake_Left					: String = "r";
var Shake_Right					: String = "t";
var Shake_Up					: String = "f";

@Header ("Debug Shortcuts")
//@Tooltip("essai")
private var PinballDebugMode			: boolean = false;

private var PlayMultiLeds				: String = "g";

private var Ball_Saver_and_ExtraBall	: String = "i";
private var Mode_Ball_Saver_Off			: String = "o";


function Start(){
	if(_Input_GetButton){
		var gos : GameObject[];	
		gos = GameObject.FindGameObjectsWithTag("Flipper"); 						// Find all game objects with tag Flipper
		for (var go : GameObject in gos)  { 
			go.GetComponent.<Flippers>().F_InputGetButton();						// use Edit -> Project Settings -> Input for Flippers
		} 

		GetComponent.<Manager_Game>().F_InputGetButton();							// Access UI and Shake buttons

		gos = GameObject.FindGameObjectsWithTag("Plunger"); 						// Find all game objects with tag Plunger
		for (var go : GameObject in gos)  { 
			go.GetComponent.<Spring_Launcher>().F_InputGetButton();					// use Edit -> Project Settings -> Input for Plunger
		}

		gos = GameObject.FindGameObjectsWithTag("Missions"); 						// Find all game objects with tag Missions
		for (var go : GameObject in gos)  { 
			go.GetComponent.<Mission_Start>().F_InputGetButton();					// use Edit -> Project Settings -> Input for Plunger
		}
	}
}


function F_flipper_Left(){				return Flipper_Left;}
function F_flipper_Right(){				return Flipper_Right;}
function F_Plunger(){					return Plunger;}
function F_Pause_Game(){				return Pause_Game;}
function F_Change_Camera(){				return Change_Camera;}
function F_Shake_Left(){				return Shake_Left;}
function F_Shake_Right(){				return Shake_Right;}
function F_Shake_Up(){					return Shake_Up;}



function F_Debug_Game(){				return PinballDebugMode;}
