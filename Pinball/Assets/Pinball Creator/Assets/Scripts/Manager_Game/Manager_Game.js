// Manager_Game : Description 
#pragma strict
var _GetButton							: boolean = false;			// true if you want input manage by Edit -> Project Settings -> Input (&uto connect)


private var obj_Managers				: GameObject[];				// (connected automatically) Array with GameObjects that manage each mission that you can find on playfield
private var Missions_Index				: int[];					// (connected automatically) Array with the ID of all the mission you can find on playfield
private var b_Pause 					: boolean = false;			// use to pause the script
private var pause_Mission 				: Pause_Mission[];			// (connected automatically) Access the Pause_Mission component for all the mission on playfield

@Header ("Score is saved with this name")	
var BestScoreName : String = "BestScore";

// Variables used for the gameplay
@Header ("Player Life and Score")	
var Life								: int = 3;					// --> Life
private var tmp_Life 					: int = 0;						// tmp_Life : the number of remaining life
private var player_Score				: int = 0;						// player score
private var Ball_num					: int;							// the number of ball played by the player
private var b_Game						: boolean = false;				// True : Player start the game . False : Game is over

@Header ("Tilt Mode")												// --> Tilt Mode
var MinTimeTilt							: float =1;						// minimum time in seconds between two shake 
var s_Warning 							: AudioClip;					// Play this sound when player hit the table
var s_Tilt 								: AudioClip;					// Play this sound if mode Tilt start
private var Tilt_Timer 					: float = 0; 					// timer to know if we need to start tilt mode
private var b_Tilt						: int = 0;						// 0 : Tilt Desactivate	 	1 : Player shakes the playfield			2 : Tilt Mode Enable  
private var b_touch_TiltLeft			: boolean = false;				// use for mobile device
private var b_touch_TiltRight			: boolean = false;				// use for mobile device
private var OnceTouchLeft				: boolean = true;				// use for mobile device
private var OnceTouchRight				: boolean = true;				// use for mobile device
private var MobileNudge					: boolean = false;				// use for mobile device to enable or disable nudge mode


@Header ("Mode Multi Ball")											// --> Mode Multi Ball
var obj_Launcher_MultiBall				: GameObject;					// Object that manage the multi-ball on playfield. Manage how the ball is ejected on playfield
private var multiBall 					: MultiBall; 					// Access MultiBall component from obj_Launcher_MultiBall gameObject;
private var Timer_Multi					: float = 1;					// ejection time between two balls 
private var Number_Of_Ball_On_Board 	: int = 0;						// Know the number of board. 
private var Multi_Ball					: boolean = false;				// Mode Multi ball activate or not
private var ReloadNumber				: int = 3;						// number of ball for the multi ball mode. Send by the mission with the function gameManager.F_Mission_MultiBall(missionIndex.F_index(),numberOfBall);
private var tmp_ReloadNumber			: int = 3; 					
private var tmp_index_Info 				: int = -1;						// lets you know what mission start Multi ball. Send by the mission with the function gameManager.F_Mission_MultiBall(missionIndex.F_index(),numberOfBall);
private var Mission_Multi_Ball_Ended 	: boolean = false;				// use to know if the multi ball stop
private var TimeToWaitBeforeMultiBallStart : boolean = false;			// prevent bug when a multi ball start after enter a hole
private var TimerMultiBall 				: float = 0;
var TimeToWaitMulti 					: float = 3;					// Time To Wait before the multi ball start 
var Deactivate_Obj						: GameObject[];					// Deactivate Target when multiball start

@Header ("Bonus Extra Ball")										// --> Bonus Extra Ball
var b_ExtraBall							: boolean = false;				// if true : extra ball is enabled
var obj_Led_ExtraBall					: GameObject;					// Connect here a Led
private var led_ExtraBall 				: ChangeSpriteRenderer;			// Access ChangeSpriteRenderer component from obj_Led_ExtraBall if a led is connected

@Header ("Bonus Ball Saver")										// --> Bonus Ball Saver
var StartGameWithBallSaver				: boolean = false;				// If true : player start a new ball with BallSaver
var StartDuration						: int = -1;
var b_Ball_Saver						: boolean = false;				// if true : Ball Saver is enabled
var obj_Led_Ball_Saver					: GameObject;					// Connect here a Led
private var led_Ball_Saver_Renderer 	: ChangeSpriteRenderer;			// Access ChangeSpriteRenderer component from obj_Led_Ball_Saver if a led is connected
var b_Respawn_Timer_Ball_Saver			: boolean = false;				// use to respawn the ball when ball lost
var Respawn_Timer_BallSaver				: float = 2;					// use to respawn the ball when ball lost
private var Timer_Ball_Saver 			: float = 2;					// Ball Saver duration					
private var tmp_Ball_Saver 				: float = 0;					// use for the ball saver timer 
private var b_Timer_Ball_Saver			: boolean = false;
var a_BallSave							: AudioClip;					// Play a sound when the player lose a ball
var BallSaverLedAnimation				: int = 0;						// Choose Led ANimation when after a ball saved 

@Header ("Bonus Multiplier")										// --> Bonus Multiplier (Bonus Multiplier = multiplier x Bonus_Base x BONUS_Global_Hit_Counter)
var multiplier							: int = 1;						// multiplier could be x1 x2 x4 x6 x 8 x10							
var Bonus_Base							: int = 100;					// 
var Mulitplier_SuperBonus				: int = 1000000;				// add points if multiplier = 10
var BONUS_Global_Hit_Counter			: int = 0;						// Record the number of object that hit the ball during the current ball
private var tmp_Multiplier				: int = 0;						// Use to calculate the score
private var tmp_BONUS_Global_Hit_Counter: int = 0;						// Use to calculate the score
private var tmp_Bonus_Score				: int = 0;						// Use to calculate the score
 
var obj_Multiplier_Leds					: GameObject[];					// Connect here 5 Leds
private var led_Multiplier_Renderer 	: ChangeSpriteRenderer[];		// Access ChangeSpriteRenderer component from obj_Multiplier_Leds if leds are connected


@Header ("Ball Lost")												// --> BALL LOST (There is 3 parts : Part 1 
var Time_Ballout_Part_1_BallOut 		: float = 2;					// Part 1 : Ball Lost : Choose the duration of this part
private var tmp_Ballout_Time 			: float = 0;
private var b_Ballout_Part_1 			: boolean = true;
var a_LoseBall							: AudioClip;					// Play a sound when the player lose a ball

var Time_Ballout_Part_2_Bonus			: float = 2;					// Part 2 : Bonus calculation : Choose the duration of this part					
private var tmp_Ballout_Time_2 			: float = 0;
private var b_Ballout_Part_2 			: boolean = true;
var a_Bonus_Screen						: AudioClip;					// Play a sound during the bonus score 

var Time_Ballout_Part_3_TotalScore		: float = 2;					// Part 3 : Next Ball or GameOver : Choose the duration of this part		
private var tmp_Ballout_Time_3 			: float = 0;
private var b_Ballout_Part_3 			: boolean = true;
var GameOverLedAnimation				: int = 0;						// Choose Led Animation when the player lose a ball 
var NewBallLedAnimation					: int = 0;						// Choose Led ANimation when there is a new ball on plunger after ball lost 

@Header ("LCD Text")												// --> LCD Text
private var Gui_Txt_Timer				:  UI.Text;						// Connect a UI.Text
private var Gui_Txt_Info_Ball			:  UI.Text;						// Connect a UI.Text
private var Gui_Txt_Score 				:  UI.Text;						// Connect a UI.Text
var arr_Info_Txt						= new Array ();					// Use to display text on LCD screen

private var tmp_Time					: float;						// Use to display text on LCD screen
private var TimeBetweenTwoInfo			: float;						// Use to display text on LCD screen
private var b_Txt_Info					: boolean = true;				// Use to display text on LCD screen

@Header ("Text used during game")									// --> Text used during game
var Txt_Game							: String[];						// Array : All the text use by the game Manager
// Use for Tilting mode
// Txt_Game[0] : Tilt
// Txt_Game[1] : Tilt Warning

// Txt_Game[2] + player_Score : Display the score when there is nothing else to display 
// Txt_Game[3] + (Ball_num+1) : Display the the ball number
// Txt_Game[4] : Display a text when we are wait a player start the game

// Bonus text when player lose a ball (There is 3 parts)
// Part 1 // Txt_Game[5],Txt_Game[6],Txt_Game[7] :   : Txt_Game[5] + "\n" + tmp_BONUS_Global_Hit_Counter + Txt_Game[6] + Bonus_Base + "\n" + tmp_Multiplier + Txt_Game[7], Time_Ballout_Part_2_Bonus);
// Part 2 // Txt_Game[8] : Txt_Game[8] + "\n" + player_Score.ToString() (display the player score)
// Part 3 // Txt_Game[9] : Display this text if player life > 0 

// Txt_Game[10] : Text for ball saver
// Txt_Game[11] : Text for Extra ball
// Txt_Game[12] : Text for Ball lost
// Txt_Game[13] : Text for Game Over
// Txt_Game[14] : Text when a game start
// Txt_Game[15] : Text when the scene start


@Header ("Plunger")													// --> Plunger
private var spawnBall					: GameObject;					// (connected automatically) The GameObject that manage the ejection after a ball respawn


@Header ("Ball")													// --> Ball
var ball								: Transform;					// Connect the ball Prefab
var s_Load_Ball 						: AudioClip;					// play a sound when the ball respan

class Leds_Pattern_Multi																					
{
    var obj 							: GameObject[] = new GameObject[1];		// array to connect object with the Tag "Leds_Groups","Missions" 
    var num_pattern 					: int[] = new int[1]; 					// choose the led animation you want to play. The order as obj
    var manager_Led_Animation			: Manager_Led_Animation[] = new Manager_Led_Animation[1]; ;// access component
}
// leds_Multi[0] is auto connected. leds_Multi[0] plays the first animation of each object with the Tag "Leds_Groups","Missions" or "Led_animation"
// It is better to create your own leds pattern from leds_Multi[1]
@Header ("Global Leds pattern manager")								// --> Global Leds pattern manager
var leds_Multi : Leds_Pattern_Multi[] 	= new Leds_Pattern_Multi[1];
var AnimDemoPlayfield					: int = 0;						// Choose leds animation used when the game is over or when the scene starts
var Loop_AnimDemoPlayfield				: boolean = true;				// loop global leds animations
private var AnimInProgress	 			: int = 0;						// Use to know the name of global Leds animation is being played
private var globAnimCount 				: int = 0;						// Use to know if all the leds animation on playfield are finish

private var obj_Tmp_Mission				: GameObject[];				
private var obj_Tmp_Leds_Groups			: GameObject[];
private var tmp_count 					: int = 0;

var b_InsertCoin_GameStart 				: boolean = false;				// Use when a new game start

private var Camera_Board				: GameObject;					// (auto connected) Camera with the tag "Main Camera"
private var camera_Movement				: Camera_Movement;				// access component Camera_Movement
private var pivotCam 					: CameraSmoothFollow;			// access component CameraSmoothFollow. Use to avoid that the camera move too harshly when the ball respawn on the plunger  

var spring_Launcher						: Spring_Launcher[];			// Plunger : access component Spring_Launcher


// variables used for debuging
private var manager_Input_Setting 		: Manager_Input_Setting;
private var Debug_Game					: boolean = false;	

private var obj_Skillshot_Mission		: GameObject;					// (auto connected) with the function F_Init_Skillshot_Mission(obj : GameObject)

@Header ("Audio : Sfx")												// --> Audio
private var sound 						: AudioSource;					// access AudioSOurce omponent

@Header ("UI ")														// --> Global Leds pattern manager
var Game_UI								: GameObject;					// Connect the parent UI
var Game_UI2								: GameObject;					// Connect the parent UI Part2 Contain button Start and quit
var Mobile_PauseAndCam					: GameObject;					// Use to deactivate Mobile pause and Mobile Change Camera button if you use the Mobile System of pause and change camera
var Mobile_Cam_Txt						: GameObject;					// Use to deactivate Mobile Change Camera text if you use the Mobile System of pause and change camera

var btn_UI								: GameObject[];					// Connect the UI button 
var PosGameUI							: float[];						// Choose the different UI position
private var Obj_UI_BestScore			: UI.Text;						// Display the best score
private var Obj_UI_Score				: UI.Text;						// Display game score
private var LCD_Wait_Start_Game 		: boolean = true;				// use to switch between best score and insert coin
private var count_LCD					: int = 0;



function Start () {	
	manager_Input_Setting = GetComponent.<Manager_Input_Setting>();
	var tmp_Gui : GameObject = GameObject.Find("txt_Timer");						// Connect UI.text to the LCD screen
	if(tmp_Gui)Gui_Txt_Timer = tmp_Gui.GetComponent.<UI.Text>();
	tmp_Gui = GameObject.Find("txt_Ball");
	if(tmp_Gui)Gui_Txt_Info_Ball = tmp_Gui.GetComponent.<UI.Text>();
	tmp_Gui = GameObject.Find("txt_Score");
	if(tmp_Gui)Gui_Txt_Score = tmp_Gui.GetComponent.<UI.Text>();
	if(Gui_Txt_Score)Gui_Txt_Score.text = Txt_Game[15];								// Display text on LCD screen when the scene start


	var _tmp : GameObject = GameObject.Find("UI_Game_Interface_v2_Lightweight_LCD");	// Find if there is a Text_Camera on hierarchy
	if(_tmp==null)_tmp= GameObject.Find("UI_Game_Interface_v2");
	if(_tmp!=null){
	/*for (var child : Transform in _tmp.transform) {
		if(child.name == "Text_Camera")
			Mobile_Cam_Txt = child.gameObject;
 	}*/
 	for (child in _tmp.transform) {
		var Typedchild : Transform = child as Transform;
		if(Typedchild.name == "Text_Camera")Mobile_Cam_Txt = Typedchild.gameObject;
 	}

 	}
 	_tmp = GameObject.Find("G_UI_Game_Interface_Mobile");								// Find if there is a UI interface on hierarchy
	if(_tmp!=null)Game_UI = _tmp;

	_tmp = GameObject.Find("G_UI_Game_Interface_Mobile_Part2");								// Find if there is a UI interface on hierarchy
	if(_tmp!=null)Game_UI2 = _tmp;


	_tmp = GameObject.Find("PauseAndView");												// Find if there is a btn_Mobile_Pause on hierarchy
	if(_tmp){
		/*for (var child : Transform in _tmp.transform) {
			if(child.name == "btn_Mobile_Pause")
				Mobile_PauseAndCam = child.gameObject;
	 	}*/
	 	for (child in _tmp.transform) {
			var Typedchild2 : Transform = child as Transform;
			if(Typedchild2.name == "btn_Mobile_Pause")Mobile_PauseAndCam = Typedchild2.gameObject;
 		}
 	}
	if(Game_UI){																	// If There is a UI interface connected.
		tmp_Gui = GameObject.Find("btn_InsertCoin");								// Find Button
		btn_UI[0] = tmp_Gui;
		tmp_Gui = GameObject.Find("btn_Resume_Game");								// Find Button
		btn_UI[1] = tmp_Gui;
		tmp_Gui = GameObject.Find("btn_Restart_Yes");								// Find Button
		btn_UI[2] = tmp_Gui;
		EventSystems.EventSystem.current.SetSelectedGameObject(btn_UI[0]);			// Select the Insert coin button
		tmp_Gui = GameObject.Find("Txt_Best_Score_1");								// Find Text Best Score
		if(tmp_Gui)Obj_UI_BestScore = tmp_Gui.GetComponent.<UI.Text>();
		tmp_Gui = GameObject.Find("Txt_Game_Score_1");								// Find Text Score
		if(tmp_Gui)Obj_UI_Score = tmp_Gui.GetComponent.<UI.Text>();
		if(Obj_UI_BestScore)Obj_UI_BestScore.text = PlayerPrefs.GetInt(BestScoreName).ToString();	//Display Best score

	}


	var gos : GameObject[] = GameObject.FindGameObjectsWithTag("MainCamera"); 		// Connect the main camera
	for (var go_ : GameObject in gos)  { 
		if(go_.GetComponent.<Camera_Movement>()){								
			Camera_Board = go_;
			camera_Movement = go_.GetComponent.<Camera_Movement>();
		}
	}


	if(obj_Launcher_MultiBall)														// Connect obj_Launcher_MultiBall to the script
		multiBall = obj_Launcher_MultiBall.GetComponent.<MultiBall>();

	sound = GetComponent.<AudioSource>();											// Access Audiosource component

	if(spawnBall == null)															// Connect the Mission to the gameObject : "spawnBall"
		spawnBall = GameObject.Find("Plunger_Spawn");

	gos = GameObject.FindGameObjectsWithTag("Plunger"); 							
	spring_Launcher = new Spring_Launcher[gos.length];								// Prepare array size 

	tmp_count =0;
	for (var go_ : GameObject in gos)  { 								
		spring_Launcher[tmp_count] = go_.GetComponent.<Spring_Launcher>();			// access Plungers Spring_Launcher component
		tmp_count++;
	}

	gos = GameObject.FindGameObjectsWithTag("Missions"); 							// Find all game objects with tag Missions and put them on arrays. 
	obj_Managers = new GameObject[gos.length];										// Prepare array size
	Missions_Index = new int[gos.length];											// Prepare array size

	tmp_count =0;
	for (var go4 : GameObject in gos)  { 											
		obj_Managers[tmp_count] = go4;												// Save information inside obj_Managers[] : the Mission gameObject 
		Missions_Index[tmp_count] = go4.GetComponent.<MissionIndex>().F_index();	// Save information inside Missions_Index[] : save the index of the Mission
		tmp_count++;
	}

	pause_Mission = new Pause_Mission[obj_Managers.length];							// Prepare array size
	for(var i : int = 0;i<obj_Managers.length;i++){									
		pause_Mission[i] = obj_Managers[i].GetComponent.<Pause_Mission>();			// access Pause_Mission component from all object inside obj_Managers[]
	}

	if(obj_Led_ExtraBall)															// Init obj_Led_ExtraBall
		led_ExtraBall = obj_Led_ExtraBall.GetComponent.<ChangeSpriteRenderer>();
	if(obj_Led_Ball_Saver)															// Init obj_Led_Ball_Saver
		led_Ball_Saver_Renderer = obj_Led_Ball_Saver.GetComponent.<ChangeSpriteRenderer>();

	
	if(obj_Multiplier_Leds.length>0){												// Init obj_Multiplier_Leds[] and access ChangeSpriteRenderer component
		led_Multiplier_Renderer = new ChangeSpriteRenderer[obj_Multiplier_Leds.length];
		for (i = 0;i< obj_Multiplier_Leds.length;i++)  { 		
			led_Multiplier_Renderer[i] 	= obj_Multiplier_Leds[i].GetComponent.<ChangeSpriteRenderer>();	 
		}
	}

	if(leds_Multi[0].obj[0] == null){												// if nothing is connected to Leds_Multi (LEDS Patterns). automaticaly create a led pattern with objects with the Tag "Leds_Groups","Missions"
		tmp_count =0;

		var gos_t = GameObject.FindGameObjectsWithTag("Missions"); 	
		obj_Tmp_Mission = new GameObject[gos_t.length];
		for (var go10 : GameObject in gos_t)  { 	
			obj_Tmp_Mission[tmp_count] = go10;	
			tmp_count++;
		}

		tmp_count =0;
		gos_t = GameObject.FindGameObjectsWithTag("Leds_Groups"); 	
		obj_Tmp_Leds_Groups = new GameObject[gos_t.length];
		for (var go10 : GameObject in gos_t)  { 	
			obj_Tmp_Leds_Groups[tmp_count] = go10;	
			tmp_count++;
		}

		tmp_count = obj_Tmp_Mission.length + obj_Tmp_Leds_Groups.length;

		leds_Multi[0].obj  = new GameObject[tmp_count];
		leds_Multi[0].num_pattern = new int[tmp_count];

		tmp_count = 0;//obj_Tmp_Mission.length + obj_Tmp_Leds_Groups.length;
		for (i = 0;i< obj_Tmp_Mission.length;i++)  { 	
				leds_Multi[0].obj[i] = obj_Tmp_Mission[i];	
				leds_Multi[0].num_pattern[tmp_count] = 0;
				tmp_count++;
		}
		for (i = 0;i< obj_Tmp_Leds_Groups.length;i++)  { 	
				leds_Multi[0].obj[tmp_count] = obj_Tmp_Leds_Groups[i];	
				leds_Multi[0].num_pattern[tmp_count] = 0;
				tmp_count++;
		}
	}

	for(var j : int = 0;j<leds_Multi.length;j++){
		leds_Multi[j].manager_Led_Animation = new Manager_Led_Animation[leds_Multi[j].obj.length];
		for(var k : int = 0;k<leds_Multi[j].obj.length;k++){
			leds_Multi[j].manager_Led_Animation[k] = leds_Multi[j].obj[k].GetComponent.<Manager_Led_Animation>();		
		}
	}

	tmp_ReloadNumber = ReloadNumber;												// Init the number of ball for Multi player mode

	var tmp : GameObject  = GameObject.Find("Pivot_Cam");
	if(tmp)pivotCam = tmp.GetComponent.<CameraSmoothFollow>();	// Access Component CameraSmoothFollow from the main camera

	Debug_Game = manager_Input_Setting.F_Debug_Game();
	yield WaitForEndOfFrame();
	if(Loop_AnimDemoPlayfield)PlayMultiLeds(AnimDemoPlayfield);						// Play a loop animation until the game Start. 
}

function HowManyAnimation(){
	return leds_Multi.length;
}

function Update () {


	/*for (var va : int = 0; va < Input.touchCount; ++va) {													// Mobile Touch for Pause and Change Camera
		if (Input.GetTouch(va).phase == TouchPhase.Began) {
			// Construct a ray from the current touch coordinates
			var ray : Ray  = Camera.main.ScreenPointToRay(Input.mousePosition);
			var	hit : RaycastHit;
			if (Physics.Raycast(ray, hit, 100)) {
				if(hit.transform.name == "btn_Mobile_Pause"){
					F_Pause_Game();}
				if (hit.transform.name == "btn_Mobile_Camera") {
					camera_Movement.Selected_Cam();}
			}
		}
	}

	if(Input.GetMouseButtonDown(0)){																		//  Mouse Click for Pause and Change Camera
		var ray2 : Ray  = Camera.main.ScreenPointToRay(Input.mousePosition);								// if you use yhe mobile Pause and Change Camera UI
		var	hit2 : RaycastHit;
		if (Physics.Raycast(ray2, hit2, 100)) {
				if(hit2.transform.name == "btn_Mobile_Pause"){
					F_Pause_Game();}
				if (hit2.transform.name == "btn_Mobile_Camera") {
					camera_Movement.Selected_Cam();}
			}
	}*/


	if(!_GetButton){																				// If we do not use Edit -> Project Settings -> Input (see Input_GetButton on Manager_Input_Setting)
		if(  Game_UI && Game_UI.activeInHierarchy && EventSystems.EventSystem.current.currentSelectedGameObject == null 						// UI : Select a button if nothing is selected
			&& Mathf.Abs(Input.GetAxisRaw("Horizontal"))==1
			|| Game_UI && Game_UI.activeInHierarchy && EventSystems.EventSystem.current.currentSelectedGameObject == null 
			&& Input.GetKeyDown(manager_Input_Setting.F_Plunger())
			){
			SelectLastButton();
		}
		if(Input.GetKeyDown(manager_Input_Setting.F_Pause_Game())){
			F_Pause_Game();}					// Pause Mode

		if(Input.GetKeyDown(manager_Input_Setting.F_Change_Camera())){								// Change the Camera view
		if(camera_Movement)camera_Movement.Selected_Cam();}	


	
	}
	else{																							// If we do not use Edit -> Project Settings -> Input
		if(Game_UI && Game_UI.activeInHierarchy && EventSystems.EventSystem.current.currentSelectedGameObject == null 						// UI : Select a button if nothing is selected
			&& Mathf.Abs(Input.GetAxisRaw("Horizontal"))==1
			|| Game_UI && Game_UI.activeInHierarchy && EventSystems.EventSystem.current.currentSelectedGameObject == null 
			&& Input.GetButtonDown(manager_Input_Setting.F_Plunger())
			){	
			SelectLastButton();
		}

		if(Input.GetButtonDown(manager_Input_Setting.F_Pause_Game())){
			F_Pause_Game();}					// Pause Mode

		if(Input.GetButtonDown(manager_Input_Setting.F_Change_Camera())){								// Change the Camera view
		if(camera_Movement)camera_Movement.Selected_Cam();}	
	}



	if(!b_Pause){
/////////////////////////////////	SECTION : Player Input : START /////////////
	if(!_GetButton){																				// If we do not use Edit -> Project Settings -> Input (see Input_GetButton on Manager_Input_Setting)
		if(!Game_UI && Input.GetKeyDown(manager_Input_Setting.F_Plunger())){if(!b_Game)F_InsertCoin_GameStart();}	// New Game Start
	}
	else{
		if(!Game_UI && Input.GetButtonDown(manager_Input_Setting.F_Plunger())){if(!b_Game)F_InsertCoin_GameStart();}
	}

	//if(Input.GetKeyDown(manager_Input_Setting.F_Plunger())){if(!b_Game)InsertCoin_GameStart();/*if(Game_UI)Game_UI.transform.localPosition.y = PosGameUI[0];*/}	// New Game Start
	if(b_Game){
		if(MobileNudge){
			for (var k: int = 0; k < Input.touchCount; ++k) {								// --> Touch Screen part USE for TILT Mode
					if(Input.GetTouch(k).position.x < Screen.width*.5						// know which part of the screen is touched by the player
						&& Input.GetTouch(k).position.y > Screen.height*.6 	&& Input.GetTouch(k).position.y < Screen.height*.8){
						if (Input.GetTouch(k).phase == TouchPhase.Began && b_Tilt <= 1){
							b_touch_TiltLeft = true;										// Enable Left Tilt	
						}							
					}
					if(Input.GetTouch(k).position.x > Screen.width*.5						// know which part of the screen is touched by the player
						&& Input.GetTouch(k).position.y > Screen.height*.6 	&& Input.GetTouch(k).position.y < Screen.height*.8){
						if (Input.GetTouch(k).phase == TouchPhase.Began && b_Tilt <= 1){
							b_touch_TiltRight = true;										// Enable Right Tilt	
						}										
					}								
				}
			}
		}



	if(b_Tilt == 1){																			// --> Player shakes the playfield	: First Time
		Tilt_Timer = Mathf.MoveTowards(Tilt_Timer,MinTimeTilt,Time.deltaTime);						// A timer start to know the time between two shake on the table
		if(Tilt_Timer == MinTimeTilt){																// Tilt_Timer is init after  MinTimeTilt 
			b_Tilt = 0;																				// Init Tilt Mode
			Tilt_Timer = 0;																			// init Tilt timer
		}
	}
	if(!_GetButton){																				// If we do not use Edit -> Project Settings -> Input (see Input_GetButton on Manager_Input_Setting)
		if(Input.GetKeyDown(manager_Input_Setting.F_Shake_Right()) && b_Game						// --> Player shakes the playfield : Right 
		|| b_touch_TiltRight &&  b_Game){
			if(b_Tilt == 1){																			// --> Start The Tilt Mode
				Start_Pause_Mode(-1);																	// Start Pause Mode for all the missions. We want to stop mission until all the balls exit the playfield
				if(camera_Movement)camera_Movement.Shake_Cam(1);										// PLay camera animation	
				if(s_Tilt)sound.PlayOneShot(s_Tilt);													// Play a soound
				if(Gui_Txt_Score)Add_Info_To_Array(Txt_Game[0],3);											// Write tilt on LCD Screen
				b_Tilt = 2;																				// b_Tilt = 2 : Tilt Mode Enable  
				Tilt_Timer = 0;																			// init timer
				F_Mode_Ball_Saver_Off();																// Disable Ball Saver
				b_ExtraBall = false;																	// Disable ExtraBall
				if(obj_Led_ExtraBall)led_ExtraBall.F_ChangeSprite_Off();								// Switch off the extra Ball led on playfield
				Flippers_Plunger_State_Tilt_Mode("Desactivate");										// Desactivate Flipper and plunger until all the balls exit the playfield
				b_touch_TiltRight = false; 
			}	
			else if(b_Tilt == 0){																	// --> Player shakes the playfield	: First Time
				if(Gui_Txt_Score)Add_Info_To_Array(Txt_Game[1],1);									// Wirte text on LCD Screen
				if(s_Warning)sound.PlayOneShot(s_Warning);												// Play a sound
				if(camera_Movement)camera_Movement.Shake_Cam(1);										// Play an animation 
				Shake_AddForce_ToBall(Vector3(-1,0,0));													// Add force to balls on playfield
				b_Tilt = 1;																				// b_Tilt = 1 : Player shakes the playfield	
				b_touch_TiltRight = false; 
			}
		}	
		if(Input.GetKeyDown(manager_Input_Setting.F_Shake_Left()) && b_Game							// --> Player shakes the playfield :  Left 
		|| b_touch_TiltLeft && b_Game){
			if(b_Tilt == 1){
				Start_Pause_Mode(-1);
				if(camera_Movement)camera_Movement.Shake_Cam(2);	
				if(s_Tilt)sound.PlayOneShot(s_Tilt);
				if(Gui_Txt_Score)Add_Info_To_Array(Txt_Game[0],3);
				b_Tilt = 2;
				Tilt_Timer = 0;
				F_Mode_Ball_Saver_Off();
				b_ExtraBall = false;
				if(obj_Led_ExtraBall)led_ExtraBall.F_ChangeSprite_Off();
				Flippers_Plunger_State_Tilt_Mode("Desactivate");
				b_touch_TiltLeft = false;
			}
			else if(b_Tilt == 0){
				if(Gui_Txt_Score)Add_Info_To_Array(Txt_Game[1],1);
				if(s_Warning)sound.PlayOneShot(s_Warning);
				if(camera_Movement)camera_Movement.Shake_Cam(2);															 
				Shake_AddForce_ToBall(Vector3(1,0,0));													
				b_Tilt = 1;
				b_touch_TiltLeft = false;
			}
		}	
		if(Input.GetKeyDown(manager_Input_Setting.F_Shake_Up()) && b_Game){							// --> Player shakes the playfield :  Up 
			if(b_Tilt == 1){
				Start_Pause_Mode(-1);
				if(camera_Movement)camera_Movement.Shake_Cam(3);	
				if(s_Tilt)sound.PlayOneShot(s_Tilt);
				if(Gui_Txt_Score)Add_Info_To_Array(Txt_Game[0],3);
				b_Tilt = 2;
				Tilt_Timer = 0;
				F_Mode_Ball_Saver_Off();
				b_ExtraBall = false;
				if(obj_Led_ExtraBall)led_ExtraBall.F_ChangeSprite_Off();
				Flippers_Plunger_State_Tilt_Mode("Desactivate");
			}
			else if(b_Tilt == 0){
				if(s_Warning)sound.PlayOneShot(s_Warning);
				if(Gui_Txt_Score)Add_Info_To_Array(Txt_Game[1],1);
				if(camera_Movement)camera_Movement.Shake_Cam(3);															
				Shake_AddForce_ToBall(Vector3(0,0,1));													
				b_Tilt = 1;
			}
		}	
	}
	else{																								// If we do use Edit -> Project Settings -> Input (see Input_GetButton on Manager_Input_Setting)
		if(Input.GetButtonDown(manager_Input_Setting.F_Shake_Right()) && b_Game						// --> Player shakes the playfield : Right 
		|| b_touch_TiltRight &&  b_Game){
			if(b_Tilt == 1){																			// --> Start The Tilt Mode
				Start_Pause_Mode(-1);																	// Start Pause Mode for all the missions. We want to stop mission until all the balls exit the playfield
				if(camera_Movement)camera_Movement.Shake_Cam(1);										// PLay camera animation	
				if(s_Tilt)sound.PlayOneShot(s_Tilt);													// Play a soound
				if(Gui_Txt_Score)Add_Info_To_Array(Txt_Game[0],3);											// Write tilt on LCD Screen
				b_Tilt = 2;																				// b_Tilt = 2 : Tilt Mode Enable  
				Tilt_Timer = 0;																			// init timer
				F_Mode_Ball_Saver_Off();																// Disable Ball Saver
				b_ExtraBall = false;																	// Disable ExtraBall
				if(obj_Led_ExtraBall)led_ExtraBall.F_ChangeSprite_Off();								// Switch off the extra Ball led on playfield
				Flippers_Plunger_State_Tilt_Mode("Desactivate");										// Desactivate Flipper and plunger until all the balls exit the playfield
				b_touch_TiltRight = false; 
			}	
			else if(b_Tilt == 0){																	// --> Player shakes the playfield	: First Time
				if(Gui_Txt_Score)Add_Info_To_Array(Txt_Game[1],1);									// Wirte text on LCD Screen
				if(s_Warning)sound.PlayOneShot(s_Warning);												// Play a sound
				if(camera_Movement)camera_Movement.Shake_Cam(1);										// Play an animation 
				Shake_AddForce_ToBall(Vector3(-1,0,0));													// Add force to balls on playfield
				b_Tilt = 1;																				// b_Tilt = 1 : Player shakes the playfield	
				b_touch_TiltRight = false; 
			}
		}	
		if(Input.GetButtonDown(manager_Input_Setting.F_Shake_Left()) && b_Game							// --> Player shakes the playfield :  Left 
		|| b_touch_TiltLeft && b_Game){
			if(b_Tilt == 1){
				Start_Pause_Mode(-1);
				if(camera_Movement)camera_Movement.Shake_Cam(2);	
				if(s_Tilt)sound.PlayOneShot(s_Tilt);
				if(Gui_Txt_Score)Add_Info_To_Array(Txt_Game[0],3);
				b_Tilt = 2;
				Tilt_Timer = 0;
				F_Mode_Ball_Saver_Off();
				b_ExtraBall = false;
				if(obj_Led_ExtraBall)led_ExtraBall.F_ChangeSprite_Off();
				Flippers_Plunger_State_Tilt_Mode("Desactivate");
				b_touch_TiltLeft = false;
			}
			else if(b_Tilt == 0){
				if(Gui_Txt_Score)Add_Info_To_Array(Txt_Game[1],1);
				if(s_Warning)sound.PlayOneShot(s_Warning);
				if(camera_Movement)camera_Movement.Shake_Cam(2);															 
				Shake_AddForce_ToBall(Vector3(1,0,0));													
				b_Tilt = 1;
				b_touch_TiltLeft = false;
			}
		}	
		if(Input.GetButtonDown(manager_Input_Setting.F_Shake_Up()) && b_Game){							// --> Player shakes the playfield :  Up 
			if(b_Tilt == 1){
				Start_Pause_Mode(-1);
				if(camera_Movement)camera_Movement.Shake_Cam(3);	
				if(s_Tilt)sound.PlayOneShot(s_Tilt);
				if(Gui_Txt_Score)Add_Info_To_Array(Txt_Game[0],3);
				b_Tilt = 2;
				Tilt_Timer = 0;
				F_Mode_Ball_Saver_Off();
				b_ExtraBall = false;
				if(obj_Led_ExtraBall)led_ExtraBall.F_ChangeSprite_Off();
				Flippers_Plunger_State_Tilt_Mode("Desactivate");
			}
			else if(b_Tilt == 0){
				if(s_Warning)sound.PlayOneShot(s_Warning);
				if(Gui_Txt_Score)Add_Info_To_Array(Txt_Game[1],1);
				if(camera_Movement)camera_Movement.Shake_Cam(3);															
				Shake_AddForce_ToBall(Vector3(0,0,1));													
				b_Tilt = 1;
			}
		}	
	}
/////////////////////////////////	SECTION END /////////////

/////////////////////////////////	SECTION : INFO : START /////////////
	if(!b_Txt_Info){																			// --> the text is displayed during "TimeBetweenTwoInfo"
		tmp_Time = Mathf.MoveTowards(tmp_Time,TimeBetweenTwoInfo,
			Time.deltaTime);
		if(tmp_Time == TimeBetweenTwoInfo){															// Display something when there nothing else to display
			b_Txt_Info = true;
			tmp_Time = 0;
			if(!LCD_Wait_Start_Game){
				if(tmp_Life > 0){																		// 
					if(Gui_Txt_Score)Gui_Txt_Score.text  = Txt_Game[2] + player_Score;					// display player score
					if(Gui_Txt_Info_Ball)Gui_Txt_Info_Ball.text  = Txt_Game[3] + (Ball_num+1);			// display the ball number
				}
				else{																					// if GameOver
					if(Gui_Txt_Score)Gui_Txt_Score.text  = Txt_Game[4];									// display player score
				}
			}
			else{
				if(count_LCD == 0){
					Add_Info_To_Array(Txt_Game[16] + "\n" + PlayerPrefs.GetInt(BestScoreName).ToString(), 3);
				}
				else{
					Add_Info_To_Array(Txt_Game[4],3);
				}
				count_LCD ++;
				count_LCD = count_LCD%2;
			}
		}
	}

/////////////////////////////////	SECTION END 	/////////////

/////////////////////////////////	SECTION : MULTI BALL /////////////
	if(Multi_Ball && Number_Of_Ball_On_Board < 3 && Timer_Multi > 1 && tmp_ReloadNumber > 0){	// --> Multi ball. condition to create a new ball on playfied
		newBall(spawnBall.transform.position);
		Timer_Multi =0;
		tmp_ReloadNumber--;
	}
	if(Multi_Ball){																					// Wait between two balls
		Timer_Multi += Time.deltaTime;

		if(tmp_ReloadNumber == 0 && Timer_Multi > 1){												// if there is no more ball to launch
			F_Mode_MultiBall();																		
		}
	}

/////////////////////////////////	SECTION : MULTI BALL : END	/////////////

/////////////////////////////////	SECTION : BALL SAVER /////////////
	if(b_Respawn_Timer_Ball_Saver){																// --> Ball Saver : use to respawn the ball when ball is lost and BallSaver = true
		Respawn_Timer_BallSaver = Mathf.MoveTowards(Respawn_Timer_BallSaver,1,					// Wait
			Time.deltaTime);
		if(Respawn_Timer_BallSaver == 1){														// Respan the ball
			b_Respawn_Timer_Ball_Saver = false;
			multiBall.KickBack_MultiOnOff();
		}
	}

	if(b_Timer_Ball_Saver){																		// --> Ball Saver Duration : Check if we need to disable ball saver
		tmp_Ball_Saver = Mathf.MoveTowards(tmp_Ball_Saver,Timer_Ball_Saver,
			Time.deltaTime);
		if(Timer_Ball_Saver == tmp_Ball_Saver){													// Stop the ball saver
			b_Timer_Ball_Saver = false;
			tmp_Ball_Saver = 0;
			F_Mode_Ball_Saver_Off();
		}
	}
	if(TimeToWaitBeforeMultiBallStart){															// Add a delay before starting multi ball
		TimerMultiBall = Mathf.MoveTowards(TimerMultiBall,TimeToWaitMulti,Time.deltaTime);
		if(TimerMultiBall == TimeToWaitMulti){
			TimerMultiBall = 0;
			TimeToWaitBeforeMultiBallStart = false;
			F_Mode_MultiBall();																	// Start the Mode_Multi ball by calling F_Mode_MultiBall()
		}
	}
/////////////////////////////////	SECTION : TIMER BALL SAVER : END	/////////////

/////////////////////////////////	SECTION : END OF A BALL /////////////
	if(!b_Ballout_Part_1){																		// --> End of a ball : 
		b_Tilt = 2;																					// when player lose a ball. Disable Tilt Mode

		for(var i : int =0;i<spring_Launcher.length;i++){
			spring_Launcher[i].F_Desactivate();														// Desactivate plunger
		}
		if(obj_Skillshot_Mission)											
			obj_Skillshot_Mission.SendMessage("Disable_Skillshot_Mission");							// Disable the skillshot mission

		tmp_Ballout_Time = Mathf.MoveTowards(tmp_Ballout_Time,Time_Ballout_Part_1_BallOut,			// Wait
			Time.deltaTime);
		if(tmp_Ballout_Time == Time_Ballout_Part_1_BallOut){										// Part 1
			if( a_Bonus_Screen){																	// Play a sound
				sound.clip = a_Bonus_Screen;					
				sound.Play();
			}							
			tmp_Ballout_Time = 0;																		
			b_Ballout_Part_1 = true;													
			b_Ballout_Part_2 = false;																// start Part 2
			Add_Info_To_Array(Txt_Game[5] + "\n" 													// display a text
				+ tmp_BONUS_Global_Hit_Counter + Txt_Game[6] + Bonus_Base 
				+ " x "+ "\n" + tmp_Multiplier + Txt_Game[7], Time_Ballout_Part_2_Bonus);
			Total_Ball_Score();																		// Add Bonus Points to player_Score
		}
	}

	if(!b_Ballout_Part_2){																			// Part 2
		tmp_Ballout_Time_2 = Mathf.MoveTowards(tmp_Ballout_Time_2,Time_Ballout_Part_2_Bonus,		// Wait
			Time.deltaTime);
		if(tmp_Ballout_Time_2 == Time_Ballout_Part_2_Bonus){										
			tmp_Ballout_Time_2 = 0;
			b_Ballout_Part_2 = true;
			b_Ballout_Part_3 = false;																// start Part 3
			Add_Info_To_Array(Txt_Game[8] + "\n" + player_Score.ToString(), Time_Ballout_Part_3_TotalScore);// display a text
		}
	}

	if(!b_Ballout_Part_3){																			// Part 3
		tmp_Ballout_Time_3 = Mathf.MoveTowards(tmp_Ballout_Time_3,Time_Ballout_Part_3_TotalScore,	// Wait
			Time.deltaTime);
		if(tmp_Ballout_Time_3 == Time_Ballout_Part_3_TotalScore){												
			tmp_Ballout_Time_3 = 0;
			b_Ballout_Part_3 = true;
			if(tmp_Life >= 1){																		// If tmp_Life > 1 new ball for the player
				PlayMultiLeds(NewBallLedAnimation);
				newBall(spawnBall.transform.position);
				if(StartGameWithBallSaver)															// If StartGameWithBallSaver = true. A new ball start with BallSaver
				F_Mode_Ball_Saver_On(StartDuration);												// if value = -1 Ball saver stay enable until the player lose the ball 	
				Add_Info_To_Array(Txt_Game[9],2);													// display a text
				b_Tilt = 0;																			// init Tilt Mode When player lose a ball
				if(obj_Skillshot_Mission)															// Use if you a mission to be a skillshot mission
					obj_Skillshot_Mission.SendMessage("Enable_Skillshot_Mission");					// The skillshot mission is enabled
				Stop_Pause_Mode();																	// Stop Pause Mode for all the missions. useful if the player loses the ball because of the tilt mode
			}
			else{																					// -> if GameOver
				PlayMultiLeds(AnimDemoPlayfield);													// Play a loop animation until the game Start
				Loop_AnimDemoPlayfield = true;														// enable to loop global leds animations
				b_Game		= false;
				b_Tilt = 0;																			// init Tilt Mode When player lose a ball
				Stop_Pause_Mode();																	// Stop Pause Mode for all the missions. useful if the player loses the ball because of the tilt mode
				if(Game_UI){
				if(!Game_UI.activeInHierarchy)Game_UI.SetActive(true);
				Game_UI.GetComponent.<RectTransform>().pivot.y = PosGameUI[0];
				//Game_UI.transform.localPosition.y = PosGameUI[3];						// If UI coneected Display Restart option Yes No
				EventSystems.EventSystem.current.SetSelectedGameObject(btn_UI[2]);		// Select the button No.
				if(Mobile_PauseAndCam)Mobile_PauseAndCam.SetActive(false);				// Use to deactivate Mobile pause and Mobile Change Camera button if you use the Mobile System of pause and change camera
				if(Mobile_Cam_Txt)Mobile_Cam_Txt.SetActive(false);
				}					
			}
		}
	}
/////////////////////////////////	SECTION : END OF A BALL : END	/////////////
	}
////////////////////////////////	DEBUG
	if(Debug_Game)Debug_Input();																	// Input for debugging
}


function Add_Info_To_Array(inf : String,Timer : float){											// --> Score Text : Call This function to add text to arr_Info_Txt
	if(Gui_Txt_Score)Gui_Txt_Score.text  = inf;
	if(Gui_Txt_Info_Ball)Gui_Txt_Info_Ball.text = "";												// We don't want to display the ball number when there is player information on LCD Fake Screen
	tmp_Time = 0;
	TimeBetweenTwoInfo = Timer;
	b_Txt_Info = false;
}

function Add_Info_To_Timer(inf : String){														// --> Timer Text : Call This function to add text to Gui_Txt_Timer
	if(Gui_Txt_Timer)Gui_Txt_Timer.text  = inf;
}


function Start_Pause_Mode(KeepAlive : int){														// --> Pause all the mission unless the mission with Index = KeepAlive. this function is called by the mission. 		
	for(var i : int=0;i<obj_Managers.length;i++){
		if(KeepAlive != Missions_Index[i])
			pause_Mission[i].Start_Pause_Mission();
	}
}

function Stop_Pause_Mode(){																		// --> Stop Pause all the mission. this function is called by the mission. 
	for(var i : int=0;i<obj_Managers.length;i++){
		pause_Mission[i].Stop_Pause_Mission();
	}
}

function Init_All_Mission(){																	// --> Initialize all the mission
	var gos = GameObject.FindGameObjectsWithTag("Missions"); 										// Find all game objects with tag Missions
	for (var go : GameObject in gos)  { 
		go.SendMessage("Mission_Intialisation_StartGame");											// Init missions when the game start
		if(tmp_Life==0 || b_InsertCoin_GameStart){													// When player is game Over or when a new game start
			go.SendMessage("InitLedMission");														// Init the leds that indicate a mission is complete
			init_Param_After_Game_Over();
		}
	} 
	Stop_Pause_Mode();
}


function PlayMultiLeds(Seq_Num : int){															// --> Use play a global leds animation. this function is called by the mission. 			
 	AnimInProgress = Seq_Num;
 	//Debug.Log("ici");
 	for(var i : int=0;i<leds_Multi[Seq_Num].obj.length;i++){
		leds_Multi[Seq_Num].manager_Led_Animation[i].Play_New_Pattern(leds_Multi[Seq_Num].num_pattern[i]);
	}
}


function checkGlobalAnimationEnded(){															// --> Check if a global leds animation is finished. Every mission call this function when her animation is finished.  
	globAnimCount++;
	if(globAnimCount == leds_Multi[AnimInProgress].obj.length-1){
		globAnimCount = 0;
		if(Loop_AnimDemoPlayfield)PlayMultiLeds(AnimDemoPlayfield);
	}
}

/////////////////////////////////	SECTION : Put the Game on PAUSE MODE : START /////////////
function Pause_Game(){
	if(!b_Pause)b_Pause = true;										// Pause Manager_Game 
	else b_Pause = false;

	var gos : GameObject[];			


	gos = GameObject.FindGameObjectsWithTag("MainCamera"); 			// Find all game objects with tag MainCamera
	for (var go : GameObject in gos)  { 
		if(b_Pause){
			if(go.GetComponent.<Camera_Movement>()){go.GetComponent.<Camera_Movement>().StartPauseMode();	// Desactivate Camera Movement
			}
		}
		else{
			if(go.GetComponent.<Camera_Movement>()){go.GetComponent.<Camera_Movement>().StopPauseMode();	// Activate Camera Movement
			}
		}
	} 

	gos = GameObject.FindGameObjectsWithTag("PivotCam"); 			// Find all game objects with tag PivotCam
	for (var go : GameObject in gos)  { 
		if(b_Pause)
			go.GetComponent.<CameraSmoothFollow>().StartPauseMode();// Desactivate Camera Movement
		else
			go.GetComponent.<CameraSmoothFollow>().StopPauseMode();	// Activate Camera Movement
	} 


	gos = GameObject.FindGameObjectsWithTag("Ball"); 				// Find all game objects with tag Ball
	for (var go : GameObject in gos)  { 
		go.GetComponent.<Ball>().Ball_Pause();						// Pause_Mode for these objects
	} 

	gos = GameObject.FindGameObjectsWithTag("Leds_Groups"); 		// Find all game objects with tag Leds_Groups
	for (var go3 : GameObject in gos)  { 
		go3.GetComponent.<Manager_Led_Animation>().Pause_Anim();	// Pause_Mode for these objects
	} 
	gos = GameObject.FindGameObjectsWithTag("Missions"); 			// Find all game objects with tag Missions
	for (var go4 : GameObject in gos)  { 
		go4.GetComponent.<Pause_Mission>().Pause_Game();			// Pause_Mode for these objects
	} 

	gos = GameObject.FindGameObjectsWithTag("Led_animation"); 		// Find all game objects with tag Led_animation
	for (var go5 : GameObject in gos)  { 
		go5.GetComponent.<Anim_On_LCD>().Pause_Anim();			// Pause_Mode for these objects
	} 


	gos = GameObject.FindGameObjectsWithTag("Flipper"); 			// Find all game objects with tag Flipper
	for (var go : GameObject in gos)  { 
		if(b_Pause)
			go.GetComponent.<Flippers>().F_Pause_Start();			// Desactivate Flippers
		else
			go.GetComponent.<Flippers>().F_Pause_Stop();			// Activate Flippers
	} 
	gos = GameObject.FindGameObjectsWithTag("Plunger"); 			// Find all game objects with tag Plunger
	for (var go : GameObject in gos)  { 
		if(b_Pause)
			go.GetComponent.<Spring_Launcher>().F_Desactivate();	// Desactivate Plunger
		else
			go.GetComponent.<Spring_Launcher>().F_Activate();		// Activate Plunger
	} 



	GetComponent.<Blink>().Pause_Blinking();						// Pause the blinking system

	gos = GameObject.FindGameObjectsWithTag("AnimatedObject"); 		// Find all game objects with tag Plunger
	for (var go : GameObject in gos)  { 
		go.GetComponent.<Toys>().Pause_Anim();						// Pause_Mode for these objects
	} 

	gos = GameObject.FindGameObjectsWithTag("Hole_Multi"); 			// Find all game objects with tag Hole_Multi
	for (var go : GameObject in gos)  { 
		go.GetComponent.<MultiBall>().F_Pause();					// Pause_Mode for these objects
	} 
	gos = GameObject.FindGameObjectsWithTag("Hole"); 				// Find all game objects with tag Hole
	for (var go : GameObject in gos)  { 
		go.GetComponent.<Hole>().F_Pause();							// Pause_Mode for these objects
	} 

	gos = GameObject.FindGameObjectsWithTag("spinner"); 			// Find all game objects with tag spinner
	for (var go : GameObject in gos)  { 
		if(b_Pause)
			go.GetComponent.<Spinner_Rotation>().F_Pause_Start();	// Pause_Mode for these objects
		else
			go.GetComponent.<Spinner_Rotation>().F_Pause_Stop();	// Activate spinner
	} 

	if(b_Pause && sound.isPlaying)
		sound.Pause();
	else 
		sound.UnPause();
		
}
/////////////////////////////////	SECTION : Put the Game on PAUSE MODE : END /////////////



/////////////////////////////////	SECTION : Gameplay : START /////////////
function gamePlay(other : GameObject){														// -->  The player lose a ball. Call by the script Pinball_TriggerForBall.js on object Out_Hole_TriggerDestroyBall on the hierarchy. This object detect when a ball is lost										
	Destroy(other);																				// Destroy the ball
	if(pivotCam)pivotCam.ChangeSmoothTimeWhenBallIsLost();										//  It avoids that the camera move too harshly when the ball respawn on the plunger  
	Number_Of_Ball_On_Board--;																	// Number_Of_Ball_On_Board -1

	if(Mission_Multi_Ball_Ended && Number_Of_Ball_On_Board == 1){								// Condition to stop Multi Ball : Mission_Multi_Ball_Ended && Number_Of_Ball_On_Board == 1
		if(camera_Movement)camera_Movement.Camera_MultiBall_Stop();								// change the camera view
		for(var i : int = 0; i< Missions_Index.length;i++){
			if(Missions_Index[i] == tmp_index_Info && tmp_index_Info != -1){
				obj_Managers[i].SendMessage("Mode_MultiBall_Ended");							// Stop multi ball	
			}
		}	
		Mission_Multi_Ball_Ended = false;
	}

	if(b_Ball_Saver && Number_Of_Ball_On_Board == 0){										// --> Condition to Activate Ball saver
		PlayMultiLeds(BallSaverLedAnimation);
		multiBall.KickBack_MultiOnOff();
		newBall(spawnBall.transform.position);
		Add_Info_To_Array(Txt_Game[10], 3);
		Respawn_Timer_BallSaver = 0;
		b_Respawn_Timer_Ball_Saver = true;
		b_Ball_Saver = false;
		if(obj_Led_Ball_Saver)led_Ball_Saver_Renderer.F_ChangeSprite_Off();
		 
		if(a_BallSave){
			sound.clip = a_BallSave;
			sound.Play();
		}
	}
	else if(b_ExtraBall && Number_Of_Ball_On_Board == 0){									// --> Condition to Activate Extra ball
		Add_Info_To_Array(Txt_Game[11], 3);
		newBall(spawnBall.transform.position);
		b_ExtraBall =false;
		if(obj_Led_ExtraBall)led_ExtraBall.F_ChangeSprite_Off();
	}
	else if(tmp_Life > 1 && Number_Of_Ball_On_Board == 0){									// --> New Ball
		Add_Info_To_Array(Txt_Game[12], 3);													
		b_Ballout_Part_1 = false;						
		if(a_LoseBall){
			sound.clip = a_LoseBall;
			sound.Play();
		}
		init_Param_After_Ball_Lost();
		tmp_Life--;
		var gos = GameObject.FindGameObjectsWithTag("Missions"); 				
		for (var go : GameObject in gos)  { 
			go.SendMessage("Mission_Intialisation_AfterBallLost");							// --> Init missions only if the mission must init after player lose the ball
		} 
		PlayMultiLeds(GameOverLedAnimation);
		Ball_num++;
		MobileNudge = false;																// Nudge Mode on mobile is disable
	}
	else if(Number_Of_Ball_On_Board <= 0){													// --> Game Over
		// GAME OVER
		if(Gui_Txt_Info_Ball)Gui_Txt_Info_Ball.text = "";										// We don't want to display the ball number when there is player information on LCD Fake Screen
		Add_Info_To_Array(Txt_Game[13], 3);
		b_Ballout_Part_1 = false;									
		if(a_LoseBall){
			sound.clip = a_LoseBall;
			sound.Play();
		}
		init_Param_After_Ball_Lost();
		tmp_Life--;
		Init_All_Mission();
		PlayMultiLeds(GameOverLedAnimation);
		Save_Best_Score();																		// Check if the player have beaten the best score
		MobileNudge = false;																// Nudge Mode on mobile is disable
	}
}

function Flippers_Plunger_State_Tilt_Mode(State : String){					// --> Activate or Desactivate the flipper and Plunger when table is tilted
	var gos : GameObject[];	
	gos = GameObject.FindGameObjectsWithTag("Flipper"); 						// Find all game objects with tag Flipper
	for (var go : GameObject in gos)  { 
		if(State == "Activate")
			go.GetComponent.<Flippers>().F_Activate();							//  Activate Flippers
		else
			go.GetComponent.<Flippers>().F_Desactivate();						// Desactivate Flippers
	}
	gos = GameObject.FindGameObjectsWithTag("Plunger"); 						// Find all game objects with tag Flipper
	for (var go : GameObject in gos)  { 
		if(State == "Activate"){
			go.GetComponent.<Spring_Launcher>().F_Activate_After_Tilt();		//  Activate plunger
		}
		else
			go.GetComponent.<Spring_Launcher>().Tilt_Mode();					// Desactivate plunger					
	} 
}

function InsertCoin_GameStart(){											// --> Insert Coin : Initialisation when Game Start
	LCD_Wait_Start_Game = false;
	Loop_AnimDemoPlayfield = false;												// Leds animation : Stop the loop animation
	Add_Info_To_Array(Txt_Game[14], 3);
	b_Game		= true;															// Game Start
	b_InsertCoin_GameStart = true;
	if(b_Pause)																	// Stop Pause
		Pause_Game();															

	

	var gos : GameObject[];			
	gos = GameObject.FindGameObjectsWithTag("Ball"); 							// Find all game objects with tag Ball
	for (var go : GameObject in gos)  { 
		Destroy(go);															// Destroy Ball on board
	} 

	gos = GameObject.FindGameObjectsWithTag("Led_animation"); 					// Find all game objects with tag Led_animation
	for (var go : GameObject in gos)  { 
		go.GetComponent.<Anim_On_LCD>().DestoyAnimGameobject();				//Destroy
	} 

	Init_All_Mission();															// Initialise all the missions
				
	gos = GameObject.FindGameObjectsWithTag("Flipper"); 						// Find all game objects with tag Flipper
	for (var go : GameObject in gos)  { 
		go.GetComponent.<Flippers>().F_Activate();								// Activate Flippers
	} 
	gos = GameObject.FindGameObjectsWithTag("Plunger"); 						// Find all game objects with tag Plunger
	for (var go : GameObject in gos)  { 
		go.GetComponent.<Spring_Launcher>().F_Activate();						// Activate Plunger
	} 

	tmp_Life = Life;															// Init Life
	player_Score = 0;															// Init Score
	Ball_num =0;
	Number_Of_Ball_On_Board  = 0;
	tmp_Ballout_Time  = 0;
	b_Ballout_Part_1  = true;
	tmp_Ballout_Time_2 	 = 0;
	b_Ballout_Part_2  = true;	
	tmp_Ballout_Time_3  = 0;
	b_Ballout_Part_3  = true;
	BONUS_Global_Hit_Counter =0;
	multiplier = 1;
	init_Param_After_Ball_Lost();
	init_Param_After_Game_Over();

	if(obj_Skillshot_Mission)													// Use if you a mission to be a skillshot mission
		obj_Skillshot_Mission.SendMessage("Enable_Skillshot_Mission");			// The skillshot mission is enabled

	if(spawnBall != null)newBall(spawnBall.transform.position);	
	PlayMultiLeds(NewBallLedAnimation);
	b_InsertCoin_GameStart = false;
}

function InitGame_GoToMainMenu(){											// --> Init Game when you choose No on UI Menu
	//Loop_AnimDemoPlayfield = true;												// Leds animation : start the loop animation

	b_Game		= false;														// Game could Start
	b_InsertCoin_GameStart = true;
	if(b_Pause)																	// Stop Pause
		Pause_Game();															

	

	var gos : GameObject[];			
	gos = GameObject.FindGameObjectsWithTag("Ball"); 							// Find all game objects with tag Ball
	for (var go : GameObject in gos)  { 
		Destroy(go);															// Destroy Ball on board
	} 

	gos = GameObject.FindGameObjectsWithTag("Led_animation"); 					// Find all game objects with tag Led_animation
	for (var go : GameObject in gos)  { 
		go.GetComponent.<Anim_On_LCD>().DestoyAnimGameobject();				//Destroy
	} 

	Init_All_Mission();															// Initialise all the missions
				
	gos = GameObject.FindGameObjectsWithTag("Flipper"); 						// Find all game objects with tag Flipper
	for (var go : GameObject in gos)  { 
		go.GetComponent.<Flippers>().F_Activate();								// Activate Flippers
	} 
	gos = GameObject.FindGameObjectsWithTag("Plunger"); 						// Find all game objects with tag Plunger
	for (var go : GameObject in gos)  { 
		go.GetComponent.<Spring_Launcher>().F_Activate();						// Activate Plunger
	} 

	gos = GameObject.FindGameObjectsWithTag("Hole"); 							// Find all game objects with tag Hole
	for (var go : GameObject in gos)  { 
		go.GetComponent.<Hole>().initHole();									// Init Hole. Usefull if player stop the game and a ball is on hole
	} 
	gos = GameObject.FindGameObjectsWithTag("Hole_Multi"); 						// Find all game objects with tag Hole_Multi
	for (var go : GameObject in gos)  { 
		go.GetComponent.<MultiBall>().initHole();								// Pause_Mode for these objects
	}


	tmp_Life = 0;															// Init Life
	player_Score = 0;															// Init Score
	Ball_num =0;
	Number_Of_Ball_On_Board  = 0;
	tmp_Ballout_Time  = 0;
	b_Ballout_Part_1  = true;
	tmp_Ballout_Time_2 	 = 0;
	b_Ballout_Part_2  = true;	
	tmp_Ballout_Time_3  = 0;
	b_Ballout_Part_3  = true;
	BONUS_Global_Hit_Counter =0;
	multiplier = 1;
	init_Param_After_Ball_Lost();
	init_Param_After_Game_Over();

	if(obj_Skillshot_Mission)													// Use if you a mission to be a skillshot mission
		obj_Skillshot_Mission.SendMessage("Disable_Skillshot_Mission");			// The skillshot mission is enabled

	Multi_Ball = false;															// init Multi Ball
	tmp_ReloadNumber = 0;
	Timer_Multi = 2;
		if(camera_Movement)camera_Movement.Camera_MultiBall_Stop();								// change the camera view
		for(var i : int = 0; i< Missions_Index.length;i++){
			if(Missions_Index[i] == tmp_index_Info && tmp_index_Info != -1){
				obj_Managers[i].SendMessage("Mode_MultiBall_Ended");							// Stop multi ball	
			}
		}	
	Mission_Multi_Ball_Ended = false;

	//if(spawnBall != null)newBall(spawnBall.transform.position);	
	b_InsertCoin_GameStart = false;

	Add_Info_To_Array(Txt_Game[4], 3);
	LCD_Wait_Start_Game = true;
	//if(Gui_Txt_Score)Gui_Txt_Score.text =  Txt_Game[4] + "\n" + "<size=17>" + Txt_Game[16] + PlayerPrefs.GetInt(BestScoreName).ToString() + "</size>";



	yield WaitForEndOfFrame();
	if(camera_Movement)camera_Movement.PlayIdle();
	Loop_AnimDemoPlayfield = true;												// Leds animation : start the loop animation
	PlayMultiLeds(AnimDemoPlayfield);

}

function newBall(pos : Vector3){											// --> NEW BALL . Create a ball on playfield
	if(s_Load_Ball)sound.PlayOneShot(s_Load_Ball);
	Instantiate(ball, pos, Quaternion.identity);
	Number_Of_Ball_On_Board++;
}

function init_Param_After_Ball_Lost(){										// --> INIT : init_Param_After_Ball_Lost 
	if(multiplier >10)multiplier = 10;
	tmp_Bonus_Score = BONUS_Global_Hit_Counter  * Bonus_Base * multiplier;		// Calculate Bonus_Score
	tmp_Multiplier = multiplier;
	tmp_BONUS_Global_Hit_Counter = BONUS_Global_Hit_Counter;
	BONUS_Global_Hit_Counter =0;
	multiplier = 1;
	if(obj_Multiplier_Leds.length>0){
		for(var i : int = 0; i< led_Multiplier_Renderer.length;i++){				
			led_Multiplier_Renderer[i].F_ChangeSprite_Off();					// Switch off Multiplier Leds
		}
	}
	Flippers_Plunger_State_Tilt_Mode("Activate");								// Usefull when the main playfield is tilted. Reactivate the flippers and plunger after Tilt Mode

}

function init_Param_After_Game_Over(){										// --> INIT : init_Param_After_Ball_Lost 

	Multi_Ball	 = false;
	Mission_Multi_Ball_Ended = false;
	b_ExtraBall	 = false;
	b_Ball_Saver= false;
	b_Respawn_Timer_Ball_Saver	 = false;						
	tmp_Ball_Saver 	 = 0;						
	b_Timer_Ball_Saver	 = false;	

	if(Deactivate_Obj.length >0){												// Deactivate Deactivate_Obj.
		for(var i : int =0;i<Deactivate_Obj.length;i++){
			Deactivate_Obj[i].SendMessage("Desactivate_Object");
		}
	}	

	var gos : GameObject[];			
	gos = GameObject.FindGameObjectsWithTag("Ball"); 							// Find all game objects with tag Ball
	for (var go : GameObject in gos)  { 
		Destroy(go);															// Destroy Ball on board
	} 
	if(StartGameWithBallSaver)													// If StartGameWithBallSaver = true. A new ball start with BallSaver
		F_Mode_Ball_Saver_On(StartDuration);									// if value = -1 Ball saver stay enable until the player lose the ball 	
	Flippers_Plunger_State_Tilt_Mode("Activate");								// Usefull when the main playfield is tilted. Reactivate the flippers and plunger after Tilt Mode
}
	
function F_Mode_ExtraBall(){													// Use for Mission
	b_ExtraBall = true;
	if(obj_Led_ExtraBall)led_ExtraBall.F_ChangeSprite_On();
}

function ExtraBall_State(){
	return b_ExtraBall;
}

	
function F_Mode_Ball_Saver_On(value : int){										// Use for Mission. Enabled ball saver
	Timer_Ball_Saver = value;													// Choose the duration of the Ball Saver				
	tmp_Ball_Saver = 0;															// Init saver timer 
	if(value != -1)																// if value = -1 Ball saver stay enable until the player lose the ball 								
		b_Timer_Ball_Saver  = true;												// Ball Saver timer start

	b_Ball_Saver = true;														// Ball Saver is enable
	if(obj_Led_Ball_Saver)led_Ball_Saver_Renderer.F_ChangeSprite_On();			// Switch On a light on the playfield
}
function F_Mode_Ball_Saver_Off(){												// Use for Mission. Disabled Ball saver
	Timer_Ball_Saver = 0;														// Init				
	tmp_Ball_Saver = 0;															// Init 																	
	b_Timer_Ball_Saver  = false;												// init
	b_Ball_Saver = false;														// Ball Saver is disable
	if(obj_Led_Ball_Saver)led_Ball_Saver_Renderer.F_ChangeSprite_Off();			// Switch Off a light on the playfield
}
function Ball_Saver_State(){
	return b_Ball_Saver;
}

// Initialize multiplier when a ball is lost
function F_Multiplier(){														// --> MULTIPLIER : use to multiply bonus score at the end of ball. Multiplier is initialize when the ball is lost. 
	if(multiplier == 1){														// multiplier increase  : x2 x4 x6 x8 x10 then Mulitplier_SuperBonus
		multiplier = 2;		
		if(obj_Multiplier_Leds.length>0)led_Multiplier_Renderer[0].F_ChangeSprite_On();
	}
	else if (multiplier < 10){													// Max multiplier is 10
		if(obj_Multiplier_Leds.length>0)led_Multiplier_Renderer[multiplier*.5].F_ChangeSprite_On();		
		multiplier += 2;										
	}
	else if (multiplier >= 10){													
		Add_Score(Mulitplier_SuperBonus);
		if(multiplier == 10)multiplier += 2;	
	}
}

function F_return_multiplier(){
	return multiplier;
}
function F_return_Mulitplier_SuperBonus(){
	return Mulitplier_SuperBonus;
}


function F_Mission_MultiBall(index_Info : int, nbr_of_Ball : int){				// Use for Mission
	ReloadNumber = nbr_of_Ball;													// Choose the number of balls of you want for the multi ball
	tmp_ReloadNumber = ReloadNumber;											// init var tmp_ReloadNumber. the variable is used to determine how much ball remains before the multi-ball end.
	tmp_index_Info = index_Info;												// Save the mission that start the multi-ball
	if(camera_Movement)camera_Movement.Camera_MultiBall_Start();				// Change the Camera view To Camera 4
	TimeToWaitBeforeMultiBallStart	= true;										// add delay to start Multi-Ball. Use to prevent bug when multi ball after enter a hole. You need to add a delay to be sure multi ball start after the ball respawn from the hole
	if(Deactivate_Obj.length >0){												// activate Object after multiball. Only work with drop target
		for(var i : int =0;i<Deactivate_Obj.length;i++){
      	     Deactivate_Obj[i].SendMessage("Activate_Object");
        }
	}	
}



function F_Mode_MultiBall(){													// --> MULTI BALL
	if(Multi_Ball){	
		//if(ball_Follow)ball_Follow.Start_BallFollow();											
		tmp_ReloadNumber = ReloadNumber;											// Muli Ball Stop
		Multi_Ball= false;
		multiBall.KickBack_MultiOnOff();
		Mission_Multi_Ball_Ended = true;	

		if(Deactivate_Obj.length >0){												// Deactivate Object after multiball. Only work with drop target
			for(var i : int =0;i<Deactivate_Obj.length;i++){
      	     Deactivate_Obj[i].SendMessage("Desactivate_Object");
     	   }
		}		
	}
	else {																			
		//if(ball_Follow)ball_Follow.Stop_BallFollow();
		Multi_Ball = true;															// Muli Ball Start
		multiBall.KickBack_MultiOnOff();
	}
}

function F_Init_Skillshot_Mission(obj : GameObject){							// --> Call by the skillshot mission
	obj_Skillshot_Mission = obj;													// 
}

function F_Mode_BONUS_Counter(){												// --> BONUS
	BONUS_Global_Hit_Counter++;
}

function Add_Score(addScore : int){												// --> Call This function to add points
	player_Score += addScore;

	if(player_Score > 999999999)												// Max score is 999,999,999 points					
		player_Score = 999999999;

	if(b_Txt_Info){																// write score on LCD display if nothing else is playing on lCD Screen.
		if(Gui_Txt_Score)Gui_Txt_Score.text  = Txt_Game[2] + player_Score;		// display player score
		if(Gui_Txt_Info_Ball)Gui_Txt_Info_Ball.text  = Txt_Game[3] + (Ball_num+1);	// display the ball number
	}
} 


function Total_Ball_Score(){
	player_Score += tmp_Bonus_Score;
}

function Save_Best_Score(){														// Check if the player have beaten the best score
	if(PlayerPrefs.HasKey(BestScoreName)){										// Check if PlayerPrefs(BestScoreName) exist
		if(PlayerPrefs.GetInt(BestScoreName) < player_Score){						// Check if the player beat has beaten the best score
			PlayerPrefs.SetInt(BestScoreName, player_Score);						// if true save the player_Score on PlayerPrefs(BestScoreName)
		}
	}
	else{																		// Check if PlayerPrefs(BestScoreName) doesn't exist
		PlayerPrefs.SetInt(BestScoreName, player_Score);							// Save the player_Score on PlayerPrefs(BestScoreName)
	}
	//if(Obj_UI_BestScore)Obj_UI_BestScore.text = PlayerPrefs.GetInt(BestScoreName).ToString();
	if(Obj_UI_Score)Obj_UI_Score.text = (player_Score+tmp_Bonus_Score).ToString();
}

function Shake_AddForce_ToBall(Direction : Vector3){							// --> Add force to ball when the the player shake the flipper
	var gos : GameObject[];			
	gos = GameObject.FindGameObjectsWithTag("Ball"); 							// Find all game objects with tag Ball
	for (var go : GameObject in gos)  { 
		go.GetComponent.<Ball>().Ball_Shake(Direction);							// Add force to the ball
	} 
}
	


/////////////////////////////////	SECTION : Gameplay : END /////////////



/////////////////////////////////	SECTION : Debug : START /////////////
function Debug_Input(){
	if(!b_Pause){
		/*if(Input.GetKeyDown(manager_Input_Setting.F_Start_Pause_Mode())){Start_Pause_Mode(-1);}					// Start_Pause_Mode(the_Mission_Who_Must_Keep_Active : int) Correspond au numéro de la mission du obj_Managers l'on veut stopper. -1 correspond à tout le monde en pause
		if(Input.GetKeyDown(manager_Input_Setting.F_Stop_Pause_Mode())){Stop_Pause_Mode();}
		if(Input.GetKeyDown(manager_Input_Setting.F_Init_All_Mission())){Init_All_Mission();}*/
		//if(Input.GetKeyDown(manager_Input_Setting.F_PlayMultiLeds())){PlayMultiLeds(0);}
		/*if(Input.GetKeyDown(manager_Input_Setting.F_newBall())){newBall(spawnBall.transform.position);};
		if(Input.GetKeyDown(manager_Input_Setting.F_Mode_MultiBall())){F_Mode_MultiBall();}*/
		//if(Input.GetKeyDown(manager_Input_Setting.F_Ball_Saver_and_ExtraBall())){F_Mode_Ball_Saver_On(-1); F_Mode_ExtraBall();}
		//if(Input.GetKeyDown(manager_Input_Setting.F_Ball_Saver_Off())){F_Mode_Ball_Saver_Off();}
	}
}



function F_NewBall(){				if(!b_Pause)newBall(spawnBall.transform.position);}	
function F_Ball_Saver_On(){			if(!b_Pause)F_Mode_Ball_Saver_On(-1);}	
function F_Ball_Saver_Off(){		if(!b_Pause)F_Mode_Ball_Saver_Off();}	
function F_ExtraBall(){				if(!b_Pause)F_Mode_ExtraBall();}	
function F_MultiBall(){				if(!b_Pause)F_Mode_MultiBall();}	
function F_PlayMultiLeds(){			if(!b_Pause)PlayMultiLeds(0);}	
function F_Init_All_Mission(){		if(!b_Pause)Init_All_Mission();}	
function F_Start_Pause_Mode(){		if(!b_Pause)Start_Pause_Mode(-1);}	
function F_Stop_Pause_Mode(){		if(!b_Pause)Stop_Pause_Mode();}	


function F_InsertCoin_GameStart(){	
	if(!b_Pause)InsertCoin_GameStart();
	if(Game_UI){
		Game_UI.GetComponent.<RectTransform>().pivot.y = PosGameUI[0];
		//Game_UI.transform.localPosition.y = PosGameUI[0];						// Change UI Position
		EventSystems.EventSystem.current.SetSelectedGameObject(null);			// Change selected button
	}
}	


function F_Pause_Game(){
	
	if(Game_UI && b_Game){														// If UI connected and game start
		if(Mobile_PauseAndCam && !Mobile_PauseAndCam.activeSelf){
			if(Mobile_PauseAndCam)Mobile_PauseAndCam.SetActive(true);
			if(Mobile_Cam_Txt)Mobile_Cam_Txt.SetActive(true);
			if(Game_UI)Game_UI.SetActive(false);
		}
		else{
			if(Mobile_PauseAndCam)Mobile_PauseAndCam.SetActive(false);
			if(Mobile_Cam_Txt)Mobile_Cam_Txt.SetActive(false);
			if(Game_UI)Game_UI.SetActive(true);
		}

		if(Game_UI.GetComponent.<RectTransform>().pivot.y == PosGameUI[0]){					// Pause Start
			//Game_UI.transform.localPosition.y = PosGameUI[1];					// Change UI Position
			Game_UI.GetComponent.<RectTransform>().pivot.y = PosGameUI[1];
			if(Game_UI.activeInHierarchy)EventSystems.EventSystem.current.SetSelectedGameObject(btn_UI[1]);	// Change selected button
		}
		else{																	// Pause Stop
			//Game_UI.transform.localPosition.y = PosGameUI[0];					// Change UI Position
			Game_UI.GetComponent.<RectTransform>().pivot.y = PosGameUI[0];
			if(Game_UI.activeInHierarchy)EventSystems.EventSystem.current.SetSelectedGameObject(null);		// Change selected button
		}
		Pause_Game();															// Pause
	}
	else if(!Game_UI){															// If no UI connected
		Pause_Game();
	}
}	

function F_Quit_No(){															// Stop pause
	Pause_Game();
	if(Game_UI){	
		//Game_UI.transform.localPosition.y = PosGameUI[0];						// Change UI Position
		Game_UI.GetComponent.<RectTransform>().pivot.y = PosGameUI[0];
		EventSystems.EventSystem.current.SetSelectedGameObject(null);			// Change selected button
	}
}	
function F_Quit_Yes(){															// return to the main menu	
	InitGame_GoToMainMenu();
	if(Game_UI){
		//Game_UI.transform.localPosition.y = PosGameUI[2];						// Change UI Position
		Game_UI.GetComponent.<RectTransform>().pivot.y = PosGameUI[2];
		if(Game_UI2)Game_UI2.SetActive(true);
		EventSystems.EventSystem.current.SetSelectedGameObject(btn_UI[0]);		// Change selected button
	}
}	

function SelectLastButton(){
	/*if(Game_UI.transform.localPosition.y == PosGameUI[2])
		EventSystems.EventSystem.current.SetSelectedGameObject(btn_UI[0]);

	if(Game_UI.transform.localPosition.y == PosGameUI[1])
		EventSystems.EventSystem.current.SetSelectedGameObject(btn_UI[1]);

	if(Game_UI.transform.localPosition.y == PosGameUI[3])
		EventSystems.EventSystem.current.SetSelectedGameObject(btn_UI[2]);	*/
	if(Game_UI.GetComponent.<RectTransform>().pivot.y == PosGameUI[2])
		EventSystems.EventSystem.current.SetSelectedGameObject(btn_UI[0]);

	if(Game_UI.GetComponent.<RectTransform>().pivot.y == PosGameUI[1])
		EventSystems.EventSystem.current.SetSelectedGameObject(btn_UI[1]);

	/*if(Game_UI.GetComponent.<RectTransform>().pivot.y == PosGameUI[3])
		EventSystems.EventSystem.current.SetSelectedGameObject(btn_UI[2]);	*/
}


function F_InputGetButton(){														// use Edit -> Project Settings -> Input for Flippers
	_GetButton = true;
}


function NudgeEnable(value : boolean ){
	MobileNudge = value;
}

function NewValueForUi(value : int){
	if(value == 0){
		PosGameUI[0] = 14;
		PosGameUI[1] = 22;
		PosGameUI[2] = 0;
		PosGameUI[3] = 34;
	}
	else{
		PosGameUI[0] = -6.04;
		PosGameUI[1] = -3.05;
		PosGameUI[2] = .05;
//		PosGameUI[3] = 1460;
	}

}