// UI_Call_A_Function.js: Description : Use by the UI button to connect Manager_Game to the button and to call a function
#pragma strict

var manager_Game 		: Manager_Game;
var obj_UI 				: GameObject;
var obj_UI2 				: GameObject;
var obj_PauseMobile 	: GameObject;
//var obj_btn_Camera 		: GameObject;

var camera_Movement 	: Camera_Movement;


function Start () {
	var tmp = GameObject.Find("Manager_Game");
	if(tmp!=null)manager_Game = tmp.GetComponent.<Manager_Game>();


	tmp = GameObject.Find("G_UI_Game_Interface_Mobile");
	if(tmp!=null)obj_UI = tmp;

	tmp = GameObject.Find("G_UI_Game_Interface_Mobile_Part2");
	if(tmp!=null)obj_UI2 = tmp;


	tmp = GameObject.Find("Main Camera");


	if(tmp!=null){
		camera_Movement = tmp.GetComponent.<Camera_Movement>();
	}

	tmp = GameObject.Find("PauseAndView");


	if(tmp!=null){

	 	for (child in tmp.transform) {
			var Typedchild : Transform = child as Transform;
			if(Typedchild.name == "btn_Mobile_Pause")obj_PauseMobile = Typedchild.gameObject;
 		}
 	}
}

function Debug_ChangeCam(){				camera_Movement.Selected_Cam();}	

function Debug_NewBall(){				manager_Game.F_NewBall();}	
function Debug_Ball_Saver_On(){			manager_Game.F_Ball_Saver_On();}	
function Debug_Ball_Saver_Off(){		manager_Game.F_Ball_Saver_Off();}	
function Debug_ExtraBall(){				manager_Game.F_ExtraBall();}	
function Debug_MultiBall(){				manager_Game.F_MultiBall();}	

function Debug_PlayMultiLeds(){			manager_Game.F_PlayMultiLeds();}	
function Debug_Init_All_Mission(){		manager_Game.F_Init_All_Mission();}	
function Debug_Start_Pause_Mode(){		manager_Game.F_Start_Pause_Mode();}	
function Debug_Stop_Pause_Mode(){		manager_Game.F_Stop_Pause_Mode();}	



function Debug_InsertCoin_GameStart(){	manager_Game.F_InsertCoin_GameStart();}	
function Debug_Pause_Game(){			manager_Game.F_Pause_Game();}	
function F_Quit_No(){					manager_Game.F_Quit_No();}	
function F_Quit_Yes(){					manager_Game.F_Quit_Yes();}	
function F_Exit_Game(){	Exit_Game();}	
function Exit_Game(){
	yield WaitForEndOfFrame;
	Application.Quit();
}


function DeactivateEventSystem(){									// Deactivate UIs when you don't need them
	if(obj_PauseMobile)obj_PauseMobile.SetActive(true);
	//if(obj_txt_Camera)obj_txt_Camera.SetActive(true);
	if(obj_UI)obj_UI.SetActive(false);
	if(obj_UI2)obj_UI2.SetActive(false);
}

function ActivateCameraViewButton(){

}

function ActivateButtonPausemobile(){
	if(obj_PauseMobile)obj_PauseMobile.SetActive(true);
}