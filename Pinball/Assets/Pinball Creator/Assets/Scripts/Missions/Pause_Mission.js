// Pause_Mission : Desciption : 
#pragma strict

//var obj								: GameObject[];				// Put here objects used on the mission Manager
var Led 							: GameObject[];				// Put her the lights used on the mission Manager
private var Led_Renderer 			: ChangeSpriteRenderer[];
private var manager_Led_Animation 	: Manager_Led_Animation;
//var Led_Pattern_Init 				: int = 0;					// Choose the light when the mission restart
private var Pause 					: boolean = false;
private var Led_Mission_In_Progress	: GameObject;				//
private var led_Mission_In_Progress : ChangeSpriteRenderer;
private var Led_Mission_Part1		: GameObject;				//
private var led_Mission_Part1 		: ChangeSpriteRenderer;
//var FunctionsToCall 				: String[];


function Start(){
	Led_Renderer = new ChangeSpriteRenderer[Led.length];
	for(var i : int = 0;i<Led.length;i++){
		Led_Renderer[i] = Led[i].GetComponent.<ChangeSpriteRenderer>();		
	}

	manager_Led_Animation = GetComponent.<Manager_Led_Animation>();		

	/*FunctionsToCall = new String[2];
	FunctionsToCall[0] = "Pause_Anim";
	FunctionsToCall[1] = "Pause_Game_Mission";*/
}


/// The function is called by the object : "Manager_Game" in the hierachy
function Start_Pause_Mission(){
	Pause = true;
	SendMessage("Pause_Start");												// Call function "Pause_Start" on the Mission Script 
	/*for(var i : int = 0;i<Led.length;i++){
		Led_Renderer[i].F_ChangeSprite_Off();
	}*/

	/*if(Led_Mission_In_Progress)led_Mission_In_Progress.F_ChangeSprite_Off();
	if(Led_Mission_Part1)led_Mission_Part1.F_ChangeSprite_Off();*/
}

/// The function is called by the object : "Manager_Game" in the hierachy
function Stop_Pause_Mission() {
	Pause = false;
	SendMessage("Pause_Stop");												// Call function "Pause_Stop" on the Mission Script 
}

function Return_Pause(){
	return Pause;
}


////////// THE GAME IS IN PAUSE MODE


function Pause_Game(){
	/*for(var i : int = 0;i<FunctionsToCall.length;i++){
		SendMessage(FunctionsToCall[i]);	
	}*/
	manager_Led_Animation.Pause_Anim();
	SendMessage("Pause_Game_Mission");
}

function Init_Obj_Pause_Mission(tmp_obj_Led : GameObject[]){				// Automatitaly connect mission's object to this script
	if(Led.length == 0){
		Led = new GameObject[tmp_obj_Led.length];
		Led = tmp_obj_Led;
	}

	Led_Renderer = new ChangeSpriteRenderer[Led.length];
	for(var k : int = 0;k<Led.length;k++){
		if(Led[k] != null)Led_Renderer[k] = Led[k].GetComponent.<ChangeSpriteRenderer>();		
	}
}

function Init_led_Mission_In_Progress(tmp_obj_Led : GameObject){				// Automatitaly connect mission's object to this script
	Led_Mission_In_Progress = tmp_obj_Led;
	led_Mission_In_Progress = Led_Mission_In_Progress.GetComponent.<ChangeSpriteRenderer>();
}

function Init_led_Part1_In_Progress(tmp_obj_Led : GameObject){				// Automatitaly connect mission's object to this script
	Led_Mission_Part1 = tmp_obj_Led;
	led_Mission_Part1 = Led_Mission_Part1.GetComponent.<ChangeSpriteRenderer>();
}
