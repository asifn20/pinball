// Mission_Start.js : Description. Manage the mission
// 
#pragma strict

private var _GetButton			: boolean = false;					// true if you want input manage by Edit -> Project Settings -> Input
private var DownLeft			: boolean = false;
private var DownRight			: boolean = false;

private var obj_Game_Manager	: GameObject;						// Represent Object Manager_Game on the hierarchy
private var missionIndex		: MissionIndex;						// Used to Access Mission_Index component (You find Mission_Index.js on each Mission)
private var gameManager			: Manager_Game;						// Used to Access Manager_Game component (You find Manager_Game.js on Manager_Game object on the hierachy)
private var sound_				: AudioSource;
private var a_Sound_is_Playing_When_Pause_Game_Start 	: boolean = false;
@Header ("|->See Documentation for more informations about Mission<-|", order = 0)	
@Header ("Initialize mission after ball lost", order = 1)						// --> 
var InitMissionWhenBallLost 	: boolean = true;					// InitMissionWhenBallLost = true. By default When the player lose a ball the mission is initialized. If false . Mission is not initialize if we are on Mission part 1

@Header ("Allow a mission to be paused.")							// --> If false. Mission is not affected by the pause of other mission. And the mission could'nt pause other mission
var b_PauseMissionMode 			: boolean = true;					// By default a mission is paused when another mission begins. But if you want that mission is never paused check b_PauseMissionMode = false, 
private var b_Pause 			: boolean = false;					// Used to pause the mission

@Header ("--> Table Mechanics Gpr 1  : Type", order = 0)			// --> 
var HowManyTime_Gpr1			: int = 3;
@Header ("Type : Target", order = 1)								// --> 
var Grp_1_Target				: boolean = true;
var Target_No_Order_Grp_1		: boolean = true;					// Check if there is no particular order to shoot the target
var Target_Order_Grp_1			: boolean = false;					// Check if there is particular order to shoot the target. The target order is the same as the  obj_Grp_1 array order
private var target_Grp_1		: Target[];							// Used to Access Target component because in this mission obj_Grp_1 are targets
private var target_Grp_2		: Target[];							// Used to Access Target component because in this mission obj_Grp_2 are targets

@Header ("Type : Rollover")											// --> 
var Grp_1_Rollover				: boolean = false;
var Rollover_No_Order_Grp_1		: boolean = false;					// Check if there is no particular order to shoot the target
var Rollover_Order_Grp_1		: boolean = false;					// Check if there is particular order to shoot the target. The target order is the same as the  obj_Grp_1 array order
var Rollover_Type3_Grp_1		: boolean = false;					// a group of rollover that could be change when the player press flippers buttons
private var Rollover_Grp_1		: Rollovers[];						// Used to Access Rollovers component 
private var Rollover_Grp_2		: Rollovers[];						// Used to Access Rollovers component 
private var Rollover_StopMoving : boolean = true;
private var LedTmp 				= new Array ();  
var SpecificText				: boolean = false;					// If you want a specific text appear letter by letter on LCD Screen. Use for rollover Grp1
private var Input_name_Left 	: String = "m";						// Use with Rollover_Type3_Grp_1. 
private var Input_name_Right 	: String = "q";						// Use with Rollover_Type3_Grp_1. 
private var gameManager_Input	: Manager_Input_Setting;			// access Manager_Input_Setting component from Manager_Game GameObject

@Header ("Type : Bumper")											// --> 
var Grp_1_Bumper				: boolean = false;
private var Bumper_Grp_1		: Bumper_js[];						// Used to Access Bumper_js component 
private var Bumper_Grp_2		: Bumper_js[];						// Used to Access Bumper_js component 

@Header ("Type : Spinner")											// --> 
var Grp_1_Spinner				: boolean = false;
private var Spinner_Grp_1		: Spinner_LapCounter[];				// Used to Access Spinner_LapCounter component
private var Spinner_Grp_2		: Spinner_LapCounter[];				// Used to Access Spinner_LapCounter component

@Header ("Type : Hole")												// --> 
var Grp_1_Hole					: boolean = false;
private var Hole_Grp_1			: Hole[];							// Used to Access Hole component
private var  Hole_Grp_2			: Hole[];							// Used to Access Hole component

@Header ("--> Put here your tables Mechanics")						// --> 
var obj_Grp_1 					: GameObject[];						// Put here your tables Mechanics 

@Header ("--> Leds corresponding to the tables Mechanics obj_Gpr_1. Same order as the obj_Grp_1")// --> 
var obj_Grp_1_Leds 				: GameObject[];						// Put here your Leds corresponding to the tables Mechanics obj_Gpr_1. For exemple connect obj_Grp_1[0] to obj_Grp_1_Leds[0]
@Header ("--> During Mission : Keep Leds from Grp1 On")
var KeepLedGrp1OnDuringMission	: boolean = false;

@Header ("--> Table Mechanics Gpr 2  : Type", order = 0)			// --> 
var HowManyTime_Gpr2			: int = 3;
@Header ("Type : Target", order = 1)								// --> 
var Grp_2_Target				: boolean = true;
var Target_No_Order_Grp_2		: boolean = true;					// Check if there is no particular order to shoot the target
var Target_Order_Grp_2			: boolean = false;					// Check if there is particular order to shoot the target. The target order is the same as the  obj_Grp_1 array order
var Target_Type_Stationary		: boolean = false;

@Header ("Type : Rollover")											// --> 
var Grp_2_Rollover				: boolean = false;
var Rollover_No_Order_Grp_2		: boolean = false;					// Check if there is no particular order to shoot the target
var Rollover_Order_Grp_2		: boolean = false;					// Check if there is particular order to shoot the target. The target order is the same as the  obj_Grp_1 array order

@Header ("Type : Bumper")											// --> 
var Grp_2_Bumper				: boolean = false;
@Header ("Type : Spinner")											// --> 
var Grp_2_Spinner				: boolean = false;
@Header ("Type : Hole")												// --> 

var Grp_2_Hole					: boolean = false;
@Header ("--> Put here your tables Mechanics")						// --> 
var obj_Grp_2					: GameObject[];						// Same as obj_Grp_1. Sometime it could be easy to separate your tables Mechanics to script a mission. 
@Header ("--> Leds corresponding to the tables Mechanics obj_Gpr_2. Same order as the obj_Grp_2")// --> 
var obj_Grp_2_Leds 				: GameObject[];						// Put here your Leds corresponding to the tables Mechanics obj_Gpr_2. For exemple connect obj_Grp_2[0] to obj_Grp_2_Leds[0]
private var obj_Led				: GameObject[];						// It is obj_Grp_1_Leds + obj_Grp_1_Leds. Used to manage Manager_Led_Animation.js and Pause_Mission.js
private var Led_Renderer		: ChangeSpriteRenderer[];			// Used to Access ChangeSpriteRenderer component from your Leds. (You find ChangeSpriteRenderer.js on each Leds object)
var arr_led_State 				= new Array ();  					// an array to manage the leds states (On or Off)

@Header ("--> Led for Part1 in progress")							// --> 
var Led_Part1_InProgress			: GameObject;					// the led that could be used to switch on a led when a mission is in progress
private var led_Part1_InProgress_	: ChangeSpriteRenderer;			// This Led is not connected with the animation system of this mission. But you could add the led to a Group_Leds Prefab (Project->Prefabs->Grp_Leds->Group_Leds) 
private var Led_Part1_InProgress_State : int = 0;

@Header ("--> Led for Mission in progress")							// --> 
var Led_Mission_InProgress			: GameObject;					// the led that could be used to switch on a led when a mission is in progress
private var led_Mission_InProgress_	: ChangeSpriteRenderer;			// This Led is not connected with the animation system of this mission. But you could add the led to a Group_Leds Prefab (Project->Prefabs->Grp_Leds->Group_Leds) 
private var Led_Mission_InProgress_State : int = 0;

@Header ("--> The led that switch On when the mission is complete")	// --> 
var Led_Mission_Complete		: GameObject;						// the led that switch On when the mission is complete
private var Led_Mission_Renderer: ChangeSpriteRenderer;

@Header ("--> Texts you want to display on LCD screen")
var Mission_Txt_name			: String = "";						// Use to display on LCD screen	
var Mission_Txt					: String[];							// An array to manage the text you want to write on LCD screen

private var Step				: int = 0;							// Used on function Counter(). Represent the different step to reach a mission 

var arr_obj_Grp_1_State 		= new Array ();						// an array to manage obj_Grp_1 states
var arr_obj_Grp_2_State 		= new Array ();  					// an array to manage obj_Grp_2 states

@Header ("--> Options during mission",order=0)						// --> Options during mission
@Header ("Timer",order=1)											// --> Timer options during mission
var b_Mission_Timer				: boolean = false;					// Only one timer during a mission
var b_Mission_Multi_Timer		: boolean = false;					// init timer after hitting object
var Mission_Time				: int = 10;
private var b_MissionTimer		: boolean = false;					// use for the mission timer
private var missionTimer		: float = 10;						// use for the mission timer
private var lastTimerValue		: int;								// use for the mission timer

@Header ("Multi ball (only available for Rollover Gpr2)")												// --> Multi ball. The muti ball is activated when a mission start (Part 2 Start)
var multiBall					: boolean = false;					// if multi ball activate
var numberOfBall				: int = 3;							// number of ball for the multi-ball
var JackpotPoints				: int = 20000;						// Points win for a jackpot when multi ball is enable
private var Step_MultiBall 		: int = 0;							// use when you need to pass through rollover Grp2 in a specific order. 

@Header ("--> Options when Mission is Complete")					// --> options that could win the player after a mission success. Choose only one option at a time
var Points						: int = 20000;						// When a mission is complete the player win this points
@Header ("Random Bonus between (ExtraBall,BallSaver,Multiplier,Points)")// 
var Random_Bonus				: boolean = false;					// Random bonus between : ExtraBall, BallSaver, Multiplier, KickBack
private var tmp_random			: int;
var ExtraBall					: boolean = false;					// Player win an extra ball
var BallSaver					: boolean = false;					// Player win a ball Saver
var BallSaverDuration			: int = 10;							// Choose the ball saver duration. if BallSaverDuration = -1 Ball Saver is enable until the player lose the ball
var Multiplier					: boolean = false;					// Increase the multiplier Bonus x2 x4 x6 x8 x10 Super Bonus (Choose the Multiplier_SuperBonus value On the gameObject Manger_Game on the hierarchy)
var KickBack					: boolean = false;					// When player win the mission one or more doors are open
var BeginWithKickBack			: boolean = false;					// If you want a mission start with the kickback open
var obj_Door_Kickback			: GameObject[];						// Put here the door you want to open
private var Kickback_Door 		: Target[];							// Accesse Target component from game objects obj_Door_Kickback
var obj_Led_Kickback			: GameObject[];						// Put here the led connected to the KickBack doors
private var Kickback_Led 		: ChangeSpriteRenderer[];			// Access ChangeSpriteRenderer component from game objects obj_Led_Kickback



@Header ("--> Skillshot Mission")									// --> Skillshot Mission . Skillshot work in association with the Plunger(Spring object) and Manager_Game on the hierarchy 
var b_SkillShot 				: boolean = false;					// true if it is the skillshot mission
var Skillshot_Target_num 		: int = 1;							// Index number of the object you want to choose to be the target
var Led_SkillShot 				: GameObject;						// The led connected to the Skillshot mission
private var led_SkillShot		: ChangeSpriteRenderer;				// access ChangeSpriteRenderer component
var SkillshotDuration			: int = 5;							// Skillshot Duration (seconds)
var Skillshot_Points			: int = 1000000;					// Points win if skillshot mission is complete
var sfx_Skillshot				: AudioClip;
var sfx_Skillshot_Fail			: AudioClip;
private var b_Mission_SkillShot : boolean = false;					// use to enable or disable skillshot mission
private var b_SkillShot_Timer 	: boolean = false;					// use to enable or disable skillshot timer
private var b_Skillshot_OnAir 	: boolean = false;					// Use to prevent the skillshot timer restart if the ball is not correctly ejected from the plunger 

@Header ("--> Choose a led animation (or not) for each mission part")// --> Animation that could be played for PART 1(before), PART 2(the mission Start), PART 3 (during the Mission), Mission Complete or fail
// Next section refer to the animations created on script Manager_Game.js (Global Manager Leds pattern)						
var LED_Anim_Num_Part1			: int = 0;							// if LED_Anim_Num_Part1 = -1 no animation is playing/
var LED_Anim_Num_Part2			: int = 0;							// if LED_Anim_Num_Part2 = -1 no animation is playing/
var LED_Anim_Num_Part3			: int = 0;							// if LED_Anim_Num_Part3 = -1 no animation is playing/
var LED_Anim_Num_Complete		: int = 0;							// if LED_Anim_Num_Complete = -1 no animation is playing/
var LED_Anim_Num_Fail			: int = 0;							// if AniNumberFail = -1 no animation is playing/

@Header ("--> Choose Toy animation (or not) for each mission part")// --> Animated Object on the playfield that could be played for PART 1(before), PART 2(the mission Start), PART 3 (during the Mission), Mission Complete or fail
var PlayfieldAnimation			: GameObject;						// Attached here an animated object with the script Toys.js
private var playfieldAnimation 	: Toys;
var PF_AnimNumPart1				: int = 0;							// if PF_AnimNumPart1 = -1 no animation is playing/
var PF_AnimNumPart2				: int = 0;							// if PF_AnimNumPart2 = -1 no animation is playing/
var PF_AnimNumPart3				: int = 0;							// if PF_AnimNumPart3 = -1 no animation is playing/
var PF_AnimNumComplete			: int = 0;							// if PF_AnimNumComplete = -1 no animation is playing/
var PF_AnimNumFail				: int = 0;							// if PF_AnimNumFail = -1 no animation is playing/


@Header ("--> Choose animation (or not) to display on LCD screen for each mission part")// --> 	
var obj_Anim_On_Led_Display		: GameObject[];						// Put here animation you want to play on the LCD sceen		
var LCD_AnimNumPart1			: int = 0;							// if LCD_AnimNumPart1 = -1 no animation is playing/
var LCD_AnimNumPart2			: int = 0;							// if LCD_AnimNumPart2 = -1 no animation is playing/
var LCD_AnimNumPart3			: int = 0;							// if LCD_AnimNumPart3 = -1 no animation is playing/
var LCD_AnimNumComplete			: int = 0;							// if LCD_AnimNumComplete = -1 no animation is playing/
var LCD_AnimNumFail				: int = 0;							// if LCD_AnimNumFail = -1 no animation is playing/

@Header ("--> Choose an sound fx (or not) for each mission part")// --> 	
var sfx_Part1					: AudioClip;						// Put here a sound fx
var sfx_Part2					: AudioClip;						// Put here a sound fx
var sfx_Part3					: AudioClip;						// Put here a sound fx
var sfx_Complete				: AudioClip;						// Put here a sound fx
var sfx_Fail					: AudioClip;						// Put here a sound fx

@Header ("--> Debug elements")// --> 	
var obj_Gui_Debug : GameObject;

function Start(){																			// --> 1) INIT
	sound_ = GetComponent.<AudioSource>();													// access AudioSource component
	first();																				// first() initialize obj_Grp_1[], obj_Grp_2[] and obj_Led[]
	//yield WaitForEndOfFrame();																
	//Mission_Intialisation();																// Init mission
}

////////// COUNTER : START /////////////
// Object connected to obj_Grp_1[] et obj_Grp_2[] send message to this mission when an object is touched by the ball.
function Counter(num : int){																// --> Mission Progression
	if(!b_Pause){																			// USE when the game PAUSE MODE or When you want to pause a mission IN GAME
		if(Grp_1_Target){			Part_1_Type_Target_Gpr1(num);}							// Part 1 : Pre mission
		else if(Grp_1_Rollover){	Part_1_Type_Rollover_Gpr1(num);}
		else if(Grp_1_Bumper){		Part_1_Type_Bumper_Gpr1(num);}
		else if(Grp_1_Spinner){		Part_1_Type_Spinner_Gpr1(num);}
		else if(Grp_1_Hole){		Part_1_Type_Hole_Gpr1(num);}

		if(Grp_2_Target){			Part_2_Type_Target_Gpr2(num);}							// Part 2 : Mission start
		else if(Grp_2_Rollover){	Part_2_Type_Rollover_Gpr2(num);}
		else if(Grp_2_Bumper){		Part_2_Type_Bumper_Gpr2(num);}
		else if(Grp_2_Spinner){		Part_2_Type_Spinner_Gpr2(num);}
		else if(Grp_2_Hole){		Part_2_Type_Hole_Gpr2(num);}
		else if(obj_Grp_2.length==0 || HowManyTime_Gpr2 == 0){								// If no object on part 2.
			if(Step == HowManyTime_Gpr1)	Step++;
		}

		if(Grp_2_Target){			Part_3_Type_Target_Gpr2(num);}							// Part 3 : Mission				
		else if(Grp_2_Rollover){	Part_3_Type_Rollover_Gpr2(num);}
		else if(Grp_2_Bumper){		Part_3_Type_Bumper_Gpr2(num);}
		else if(Grp_2_Spinner){		Part_3_Type_Spinner_Gpr2(num);}
		else if(Grp_2_Hole){		Part_3_Type_Hole_Gpr2(num);}


		if(Step == (HowManyTime_Gpr1+HowManyTime_Gpr2+1)){									// Part 4 : Mission Complete
			if(Led_Mission_InProgress){
				Led_Mission_InProgress_State = 0;
				led_Mission_InProgress_.led_Part_InProgress_State(0);
				led_Mission_InProgress_.F_ChangeSprite_Off();	

			}

			if(Random_Bonus){
				F_Random_Bonus();
			}
			else{
				if(ExtraBall){																// Options when the mission is complete	
					gameManager.F_Mode_ExtraBall();
					Mission_Complete();	
				}
				else if(BallSaver){
					gameManager.F_Mode_Ball_Saver_On(BallSaverDuration);
					Mission_Complete();	
				}
				else if(Multiplier){
					gameManager.F_Multiplier();
					Mission_Complete();	
				}
				else if(KickBack){
					for(var i : int =0;i<obj_Door_Kickback.length;i++){
						Kickback_Door[i].Desactivate_Object();	
					}
					for(i =0;i<obj_Led_Kickback.length;i++){
						Kickback_Led[i].F_ChangeSprite_On();	
					}
					Mission_Complete();	
				}
				else{
					Mission_Complete();	
				}
			}
		}
	}
} 
////////// COUNTER : END /////////////

//////// FUNCTION WHEN A MISSION IS FINISHED ////////
function Mission_Complete(){														// --> Mission Complete
	Bonus_text();

   	gameManager.Add_Score(Points);														// Add Score
   	if(Led_Mission_Complete)
		Led_Mission_Renderer.Led_Mission_Complete("On");								// Switch On the led that indicate the mission is complete	

	Play_LedAnim_ObjAnim_LCDAnim_Complete();											// Play led animation; object animation or lcd animation																												
   	Mission_Intialisation();															// Init Mission
}

//////// FUNCTION WHEN A MISSION IS FAILED ////////
function Mission_Fail(){															// --> Mission Fail														
	if(Mission_Txt.length > 1
	&& Mission_Txt[1]!="")gameManager.Add_Info_To_Array(Mission_Txt_name + "\n" + Mission_Txt[1], 3);// Write a text on LCD Screen
	Play_LedAnim_ObjAnim_LCDAnim_Fail();												// Play led animation; object animation or lcd animation	
	Mission_Intialisation();															// Init Mission
}

//////// FUNCTION Mission_Intialisation_AfterBallLost ////////
function Mission_Intialisation_AfterBallLost(){										// --> initialisation after a ball lost
	if(InitMissionWhenBallLost || Step > obj_Grp_1.length){								// Mission is initialize if : 1) var InitMissionWhenBallLost = true or 2) if the mission is on part 3					
		Mission_Intialisation();														// Init the mission
	}
	if(!BeginWithKickBack)Init_KickBack_WhenPlayerLoseBall(); 							// Init kickback when the ball is lost
}


//////// Mission_Intialisation : START ////////
private var init_Ended : boolean = false;
function Mission_Intialisation(){													// --> Function to initialize a mission
	init_Ended = false;
	if(Grp_1_Target){			Mission_Intialisation_Target_Gp1();}
	else if(Grp_1_Rollover){	Mission_Intialisation_Rollover_Gp1();}
	else if(Grp_1_Bumper){		Mission_Intialisation_Bumper_Gp1();}
	else if(Grp_1_Spinner){		Mission_Intialisation_Spinner_Gp1();}
	else if(Grp_1_Hole){		Mission_Intialisation_Hole_Gp1();}

	if(Grp_2_Target){			Mission_Intialisation_Target_Gp2();}
	else if(Grp_2_Rollover){	Mission_Intialisation_Rollover_Gp2();}
	else if(Grp_2_Bumper){		Mission_Intialisation_Bumper_Gp2();}
	else if(Grp_2_Spinner){		Mission_Intialisation_Spinner_Gp2();}
	else if(Grp_2_Hole){		Mission_Intialisation_Hole_Gp2();}

	if(BeginWithKickBack){															// init kickback
		for(var i : int =0;i<obj_Door_Kickback.length;i++){
			Kickback_Door[i].Desactivate_Object();	
		}
		for(i =0;i<obj_Led_Kickback.length;i++){
			Kickback_Led[i].F_ChangeSprite_On();	
		}
	}


	if(b_PauseMissionMode)gameManager.Stop_Pause_Mode();							// Stop_Mission_Pause_Mode
   	Step=0;																			// init mission step
   	Step_MultiBall = HowManyTime_Gpr1+1;
	InitMissionTimer();																// init the mission timer
	init_Ended = true;
}

function Mission_Intialisation_StartGame(){											// --> Function to initialize a mission when a game is starting. Call by Manager_Game.js
	init_Ended = false;
	if(Grp_1_Target){			Mission_Intialisation_Target_Gp1();}
	else if(Grp_1_Rollover){	Mission_Intialisation_Rollover_Gp1();}
	else if(Grp_1_Bumper){		Mission_Intialisation_Bumper_Gp1();}
	else if(Grp_1_Spinner){		Mission_Intialisation_Spinner_Gp1();}
	else if(Grp_1_Hole){		Mission_Intialisation_Hole_Gp1();}

	if(Grp_2_Target){			Mission_Intialisation_Target_Gp2();}
	else if(Grp_2_Rollover){	Mission_Intialisation_Rollover_Gp2();}
	else if(Grp_2_Bumper){		Mission_Intialisation_Bumper_Gp2();}
	else if(Grp_2_Spinner){		Mission_Intialisation_Spinner_Gp2();}
	else if(Grp_2_Hole){		Mission_Intialisation_Hole_Gp2();}

	if(BeginWithKickBack){															// init kickback
		for(var i : int =0;i<obj_Door_Kickback.length;i++){
			Kickback_Door[i].Desactivate_Object();	
		}
		for(i =0;i<obj_Led_Kickback.length;i++){
			Kickback_Led[i].F_ChangeSprite_On();	
		}
	}

   	Step=0;																			// init mission step
   	Step_MultiBall = HowManyTime_Gpr1+1;
	InitMissionTimer();																// init the mission timer
	init_Ended = true;
}

//////// Mission_Intialisation : END ////////


function Init_KickBack_WhenPlayerLoseBall(){									// -> Init kickback when the ball is lost
    for(var i : int =0;i<obj_Door_Kickback.length;i++){
            Kickback_Door[i].Activate_Object();    								// Close kickback
        }
    for(i =0;i<obj_Led_Kickback.length;i++){
        Kickback_Led[i].F_ChangeSprite_Off();    								// Leds switch off
    }
} 

function F_Led_Gpr1_num(num : int){
	return num;
}
function F_Led_Gpr2_num(num : int){
	var tmp : int = 0;
	if(obj_Grp_1.length != obj_Grp_1_Leds.length){
		tmp = obj_Grp_1.length - obj_Grp_1_Leds.length;
	}

	num += obj_Grp_1.length - tmp;
	return num;
}


//// PAUSE the mission (game continue but this mission is on pause) START ///
function Pause_Start(){																// What To Do When Pause START. Call Pause_Mission.js on mission's game object. All the led's missions are switch off
	if(b_PauseMissionMode){										
		b_Pause= true;
		if(obj_Gui_Debug)
			obj_Gui_Debug.GetComponent.<UI.Image>().color = new Color(1,0,0);

		for(var i : int = 0;i<Led_Renderer.length;i++){
			Led_Renderer[i].F_ChangeSprite_Off();				
		}
		if(Led_Mission_InProgress){
			led_Mission_InProgress_.F_ChangeSprite_Off();
		}
		if(Led_Part1_InProgress){
			led_Part1_InProgress_.F_ChangeSprite_Off();
		}
	}
}						
function Pause_Stop() {																// Waht To Do When pause STOP. Call Pause_Mission.js on mission's game object
	if(b_PauseMissionMode){
		if(obj_Gui_Debug)
			obj_Gui_Debug.GetComponent.<UI.Image>().color =new Color(1,1,1);
		b_Pause= false;
		// ---> 6 bis) WRITE HERE what you need to init after Pause
		if(Grp_1_Target){			Pause_Stop_Target_Gpr1();}	
		else if(Grp_1_Rollover){	Pause_Stop_Rollover_Gpr1();}
		else if(Grp_1_Bumper){		Pause_Stop_Bumper_Gpr1();}
		else if(Grp_1_Spinner){		Pause_Stop_Spinner_Gpr1();}
		else if(Grp_1_Hole){		Pause_Stop_Hole_Gpr1();}

		if(Grp_2_Target){			Pause_Stop_Target_Gpr2();}
		else if(Grp_2_Rollover){	Pause_Stop_Rollover_Gpr2();}
		else if(Grp_2_Bumper){		Pause_Stop_Bumper_Gpr2();}
		else if(Grp_2_Spinner){		Pause_Stop_Spinner_Gpr2();}
		else if(Grp_2_Hole){		Pause_Stop_Hole_Gpr2();}

		if(Led_Mission_InProgress){
			if(Led_Mission_InProgress_State == 0)
				led_Mission_InProgress_.F_ChangeSprite_Off();	
			else{
				Led_Mission_InProgress_State = 1;
				led_Mission_InProgress_.led_Part_InProgress_State(1);
				led_Mission_InProgress_.F_ChangeSprite_On();
			}
		}
	}
}
//// PAUSE the mission END ///

//////// FUNCTION WHEN multi-ball id ENDED ////////
// This function is used to initialize a mission that uses the multi-ball
// Multi ball is manage by the manager_Game Object on the hierarchy (see script Manager_Game.js).
// How to start a multi ball :
// 1) call gameManager.F_Mission_MultiBall(missionIndex.F_index(), nbr_of_Ball : int) to start multi ball
// 2) When a multi-ball end the mission receved a message (Mode_MultiBall_Ended()) from manager_Game (search Mission Multi Ball stop on  Manager_Game.js). 
function Mode_MultiBall_Ended(){													// --> Call by manager_Game on the hierachy
	Play_LedAnim_ObjAnim_LCDAnim_Fail();											// Play led animation; object animation or lcd animation							
	if(Mission_Txt.length > 1
	&& Mission_Txt[1]!="")gameManager.Add_Info_To_Array(Mission_Txt_name + "\n" + Mission_Txt[1], 3);// Write Text on LCD Screen

	if(Led_Mission_Complete)
	Led_Mission_Renderer.Led_Mission_Complete("On");								// Switch On the led that indicate the mission is complete	

	Mission_Intialisation();
	Init_Leds_State();																// init Leds states																																
}


////////// UPDATE FUNCTION START /////////
function Update(){																	// --> Update function
	if(!b_Pause){

	if(!_GetButton){																// true if you want input manage by Edit -> Project Settings -> Input
		if(Step < HowManyTime_Gpr1 && Rollover_Type3_Grp_1 && init_Ended){			// Use when Rollover_Type3_Grp_1 is chosen. init_Ended prevent bug when the mission is initialized
			if(Input.GetKeyDown(Input_name_Right) && Rollover_StopMoving){			
		 		Move_Leds_To_Right();}												// Move the led to the right 
			if(Input.GetKeyDown(Input_name_Left) && Rollover_StopMoving){
		 		Move_Leds_To_Left ();}												// Move the led to the left 
	 	}
	 }
	 else{
	 	if(Step < HowManyTime_Gpr1 && Rollover_Type3_Grp_1 && init_Ended){			// Use when Rollover_Type3_Grp_1 is chosen. init_Ended prevent bug when the mission is initialized
			if(Input.GetAxisRaw(Input_name_Right) && !DownRight && Rollover_StopMoving){			
		 		Move_Leds_To_Right();DownRight = true;}									// Move the led to the right 
			if(Input.GetAxisRaw(Input_name_Left)  && !DownLeft && Rollover_StopMoving){
		 		Move_Leds_To_Left ();DownLeft = true;}									// Move the led to the left 

		 	if(Input.GetAxisRaw(Input_name_Right)  == 0 && DownRight){					// Right Move led position only once
		 		DownRight = false;}
		 	if(Input.GetAxisRaw(Input_name_Left)  == 0 && DownLeft){					// Left Move led position only once
		 		DownLeft = false;}

	 	}
	 }

	 if(Rollover_Type3_Grp_1){
	 	for (var i: int = 0; i < Input.touchCount; ++i) {									// --> Touch Screen part
			if(Input.GetTouch(i).position.x > Screen.width*.5
			&& Input.GetTouch(i).position.y < Screen.height*.5){						// know which part of the screen is touched by the player
				if (Input.GetTouch(i).phase == TouchPhase.Began && Rollover_StopMoving){// if touch is detect 		
		 			Move_Leds_To_Right();												// (Lane Change Mission) Move the led to the right 											
				}
			}
			if(Input.GetTouch(i).position.x < Screen.width*.5
			&& Input.GetTouch(i).position.y < Screen.height*.5){						// know which part of the screen is touched by the player
				if (Input.GetTouch(i).phase == TouchPhase.Began && Rollover_StopMoving){// if touch is detect 	
		 			Move_Leds_To_Left ();												// (Lane Change Mission) Move the led to the left 		
				}
			}
		}
	}
			


		if(b_MissionTimer){															// MISSION TIMER
			missionTimer = Mathf.MoveTowards(missionTimer,0,						// Timer progression
			Time.deltaTime);

			var tmp_Timer = Mathf.Round(missionTimer);

			if(tmp_Timer != lastTimerValue)
				gameManager.Add_Info_To_Timer(tmp_Timer.ToString());				// Use 2 for second param to prevent mistake on LCD Screen

			if(missionTimer == 0){													// if missionTimer == 0 the mission is failed
				b_MissionTimer = false;												// stop the timer
				Mission_Fail();														// Mission fail
			}
			lastTimerValue = tmp_Timer;	
		}

		if(b_SkillShot_Timer){														// Skillshot MISSION TIMER
			missionTimer = Mathf.MoveTowards(missionTimer,0,						// Timer progression
			Time.deltaTime);

			tmp_Timer = Mathf.Round(missionTimer);

			if(tmp_Timer != lastTimerValue)
				gameManager.Add_Info_To_Timer(tmp_Timer.ToString());				// Use 2 for second param to prevent mistake on LCD Screen

			if(missionTimer == 0){													// if missionTimer == 0 the mission is failed
				b_SkillShot_Timer = false;											// stop the timer
				Skillshot_Mission_Fail();											// Mission Skillshot fail
			}
			lastTimerValue = tmp_Timer;	
		}

	}
}
////////// UPDATE FUNCTION END /////////


function Pause_Game_Mission(){														// Mission : PAUSE (the scene is on Pause)
	if(!b_Pause){
		b_Pause=true;																// Pause mission : on
		if(sound_.isPlaying){														// If a sound is playing when pause start
			sound_.Pause();															// Pause sound
			a_Sound_is_Playing_When_Pause_Game_Start = true;						// Change state of a_Sound_is_Playing_When_Pause_Game_Start to true
		}
		else{																		// If no sound is playing
			a_Sound_is_Playing_When_Pause_Game_Start = false;						// Change state of a_Sound_is_Playing_When_Pause_Game_Start to true
		}
	}
	else{
		b_Pause=false;																// Pause mission : false
		if(a_Sound_is_Playing_When_Pause_Game_Start){								// a_Sound_is_Playing_When_Pause_Game_Start = true
			sound_.Play();															// Stop to pause the sound
		}
	}
}

function MissionTimer(seconds : int){												// --> Call this function to start the timer.
	missionTimer = seconds;															// Choose the timer duration with seconds : int 
	b_MissionTimer = true;															// Info : When a timer end, the mission is failed
}

function InitMissionTimer(){														// Call this function to initialize the timer
	gameManager.Add_Info_To_Timer("");
	b_MissionTimer = false;
}


function Enable_Skillshot_Mission(){												// --> Call by the script Game_Manager.js on object Game_Manger on the hierarchy. Send when the player start a new ball
	b_Mission_SkillShot = true;														// enable skillshot mission
	if(Led_SkillShot)																// if a led is connected to the mission
		led_SkillShot.F_ChangeSprite_On();											// Switch on the led
	b_Skillshot_OnAir = false;														// Use to prevent the skillshot timer restart if the ball is not correctly ejected from the plunger 
}

function Disable_Skillshot_Mission(){												// --> Call by the script Game_Manager.js on object Game_Manger on the hierarchy. Send when the player lose a new ball
	b_Mission_SkillShot = false;													// Disable skillshot mission
	if(Led_SkillShot)																// if a led is connected to the mission
		led_SkillShot.F_ChangeSprite_Off();											// Switch off the led
	b_Skillshot_OnAir = true;														// Use to prevent the skillshot timer restart if the ball is not correctly ejected from the plunger 
	b_SkillShot_Timer = false;	
	gameManager.Add_Info_To_Timer("");												// init text
	missionTimer = 0;															
}

function Skillshot_Mission(){														// --> Call by the script Spring_Launcher.js on the object Spring on the hierarchy.
	if(b_Mission_SkillShot && !b_Skillshot_OnAir){									// Use to prevent the skillshot timer restart if the ball is not correctly ejected from the plunger				
		F_SkillshotTimer(SkillshotDuration);										// start the skillshot timer
		b_Skillshot_OnAir = true;													// The timer can not start twice
	}
}
function Skillshot_Mission_Complete(){												// --> Skillshot mission is complete
	if(sfx_Skillshot)sound_.PlayOneShot(sfx_Skillshot);
	b_Mission_SkillShot = false;													// disable skillshot mission
	gameManager.Add_Info_To_Array("Skillshot Complete", 3);							// Write a text on LCD Screen
   	gameManager.Add_Score(Skillshot_Points);										// Add Points
	if(Led_SkillShot)																// if a led is connected to the mission
		led_SkillShot.F_ChangeSprite_Off();											// Switch off the led
	b_SkillShot_Timer = false;														// stop the timer
	gameManager.Add_Info_To_Timer("");												// init text
	missionTimer =0;																// init
}
function Skillshot_Mission_Fail(){													// --> Skillshot mission is failed
	if(sfx_Skillshot_Fail)sound_.PlayOneShot(sfx_Skillshot_Fail);
	b_Mission_SkillShot = false;													// disable skillshot mission
	gameManager.Add_Info_To_Array("Skillshot Fail", 3);								// Write a text on LCD Screen
	if(Led_SkillShot)																// if a led is connected to the mission
		led_SkillShot.F_ChangeSprite_Off();											// Switch off the led
	gameManager.Add_Info_To_Timer("");												// init text
}
function F_SkillshotTimer(seconds : int){											// --> Init and start the skillshot timer											
	missionTimer = seconds;															
	b_SkillShot_Timer = true;															
}


function Bonus_text(){															// --> Text on LCD screen when mission is complete
	if(ExtraBall){
		if(Mission_Txt.length > 10 && Mission_Txt[0]!="" && Mission_Txt[7]!="")
	    	gameManager.Add_Info_To_Array(Mission_Txt_name + "\n" + "<size= 20>" 
	    	+ Mission_Txt[0] + "\n" 											// text : Mission Complete
	    	+  Mission_Txt[7]+"</size>", 3);									// text : Extra Ball
	}
	else if(BallSaver){
		if(Mission_Txt.length > 10 && Mission_Txt[0]!="" && Mission_Txt[8]!="")
	    	gameManager.Add_Info_To_Array(Mission_Txt_name + "\n" + "<size= 20>" 
	    	+ Mission_Txt[0] + "\n" 											// text : Mission Complete
	    	+  Mission_Txt[8]+"</size>", 3);									// text : Ball Saver
	}
	else if(Multiplier){
			if(gameManager.F_return_multiplier() <= 10){
				if(Mission_Txt.length > 2 && Mission_Txt[0]!="" && Mission_Txt[2]!="")
					gameManager.Add_Info_To_Array(Mission_Txt_name + "\n" + "<size= 20>" 
					+ Mission_Txt[0] + "\n"										// text : Mission Complete
					+  Mission_Txt[2]  											// text : Multiplier x 
					+ gameManager.F_return_multiplier().ToString()				// text : x
					+"</size>", 3);
			}
			else {																// SUper Bonus if multiplier > 10
				if(Mission_Txt.length > 3 && Mission_Txt[0]!="" && Mission_Txt[3]!=""){
					gameManager.Add_Info_To_Array(Mission_Txt_name + "\n" + "<size= 20>" 
					+ Mission_Txt[0] + "\n"										// text : Mission Complete 
					+ Mission_Txt[3]  + " "									// text : Super Bonus
					+ gameManager.F_return_Mulitplier_SuperBonus().ToString()		
					+"</size>", 3);
						
			}
			}
		
	}
	else if(KickBack){
		if(Mission_Txt.length > 10 && Mission_Txt[0]!="" && Mission_Txt[10]!="")
	    	gameManager.Add_Info_To_Array(Mission_Txt_name + "\n" + "<size= 20>" 
	    	+ Mission_Txt[0] + "\n" 											// text : Mission Complete
	    	+  Mission_Txt[10]+"</size>", 3);									// text : Kickback open
	}
	else {
		if(Mission_Txt.length > 10 && Mission_Txt[0]!="" && Mission_Txt[9]!="")
	    	gameManager.Add_Info_To_Array(Mission_Txt_name + "\n" + "<size= 20>" 
	    	+ Mission_Txt[0] + "\n" + Points									// text : Mission Complete
	    	+  Mission_Txt[9]+"</size>", 3);									// text : Points
	}
}

function F_Random_Bonus(){															// --> if Random_Bonus = true. The player win a random Bonus (ExtraBall,BallSaver,Multiplier,Points Only)
	tmp_random = Random.Range(1,5);

	switch (tmp_random) {
	    case 1:																		// -> ExtraBall	
	    	gameManager.F_Mode_ExtraBall();
			Mission_Complete();		
	    	if(Mission_Txt.length > 10 && Mission_Txt[0]!="" && Mission_Txt[6]!="" && Mission_Txt[7]!="")
	    		gameManager.Add_Info_To_Array(Mission_Txt_name + "\n" + "<size= 20>" 
	    		+ Mission_Txt[0] + "\n" 											// text : Mission Complete
	    		+  Mission_Txt[6]+ "\n" 											// text : Random Bonus 
	    		+  Mission_Txt[7]+"</size>", 3);									// text : Extra Ball
	    	break;
	    case 2:																		// -> BallSaver	
	    	gameManager.F_Mode_Ball_Saver_On(BallSaverDuration);
	    	Mission_Complete();		
	    	if(Mission_Txt.length > 10 && Mission_Txt[0]!="" && Mission_Txt[6]!="" && Mission_Txt[8]!="")
	    		gameManager.Add_Info_To_Array(Mission_Txt_name + "\n" + "<size= 20>" 
	    		+ Mission_Txt[0] + "\n"  											// text : Mission Complete
	    		+  Mission_Txt[6]+ "\n" 											// text : Random Bonus  
	    		+  Mission_Txt[8]+"</size>", 3);									// text : Ball Saver
	    	break;
	    case 3:																		// -> Multiplier	
	    	gameManager.F_Multiplier();
			Mission_Complete();			
			if(gameManager.F_return_multiplier() <= 10 && Mission_Txt[0]!="" && Mission_Txt[6]!="" && Mission_Txt[2]!="")
				if(Mission_Txt.length > 2)
					gameManager.Add_Info_To_Array(Mission_Txt_name + "\n" + "<size= 20>" 
					+ Mission_Txt[0] + "\n"											// text : Mission Complete
					+  Mission_Txt[6]		 										// text : Random Bonus 
					+ "\n" + Mission_Txt[2]  										// text : Multiplier x 
					+ gameManager.F_return_multiplier().ToString()					// text : x
					+"</size>", 3);
			else if(gameManager.F_return_multiplier() >= 12)
				if(Mission_Txt.length > 3 && Mission_Txt[0]!="" && Mission_Txt[6]!="" && Mission_Txt[3]!="")
					gameManager.Add_Info_To_Array(Mission_Txt_name + "\n" + "<size= 20>" 
					+ Mission_Txt[0] + "\n"											// text : Mission Complete 
					+  Mission_Txt[6]	+ "\n"	 									// text : Random Bonus 
					+ Mission_Txt[3]  												// text : Super Bonus
					+ gameManager.F_return_Mulitplier_SuperBonus().ToString()		
					+"</size>", 3);
	    	break;
	    case 4:																		// -> Points Only	
	    	Mission_Complete();											
	    	if(Mission_Txt.length > 10 && Mission_Txt[0]!="" && Mission_Txt[6]!="" && Mission_Txt[9]!="")
	    		gameManager.Add_Info_To_Array(Mission_Txt_name + "\n" + "<size= 20>" 
	    		+ Mission_Txt[0] + "\n" 											// text : Mission Complete
	    		+  Mission_Txt[6]+ "\n" + Points			 						// text : Random Bonus 
	    		+  Points + Mission_Txt[9]+"</size>", 3);							// text : x Points
	    	break;
	}
}


function newTxtArray(){																// --> Init Mission Text : if(Mission_Txt.length == 0) Create text for the mission 
	Mission_Txt = new String[14];
	Mission_Txt[0] = "Mission Complete";
	Mission_Txt[1] = "Mission Failed";
	Mission_Txt[2] = "Multiplier x";
	Mission_Txt[3] = "Super Bonus";
	Mission_Txt[4] = "More x ";
	Mission_Txt[5] = "More x ";
	Mission_Txt[6] = "Random Bonus";
	Mission_Txt[7] = "Extra Ball";
	Mission_Txt[8] = "Ball Saver";
	Mission_Txt[9] = " Points";
	Mission_Txt[10]= "Kickback open";
	Mission_Txt[11]= "Word";
	Mission_Txt[12]= "Jackpot";
	Mission_Txt[13]= "Mission Start";
}



//////// FUNCTION FIRST : START /////////
function first(){																	// --> Initialisation when scene start
	if (obj_Game_Manager == null)														// Connect the Mission to the gameObject : "Manager_Game"
		obj_Game_Manager = GameObject.Find("Manager_Game");

	obj_Led = new GameObject[obj_Grp_1_Leds.length + obj_Grp_2_Leds.length];		// --> Put obj_Grp_1_Leds + obj_Grp_2_Leds inside obj_Led
	for(var l : int=0;l<obj_Grp_1_Leds.length;l++){															
		obj_Led[l] = obj_Grp_1_Leds[l];
	}	
	for(l =0;l<obj_Grp_2_Leds.length;l++){																								
		obj_Led[l+obj_Grp_1_Leds.length] = obj_Grp_2_Leds[l];}		 

	Led_Renderer = new ChangeSpriteRenderer[obj_Led.length];						// --> Connect the Mission to obj_Led[i].<ChangeSpriteRenderer>() component. 
	for(var k : int=0;k<obj_Led.length;k++){															
		Led_Renderer[k] = obj_Led[k].GetComponent.<ChangeSpriteRenderer>();				
	}

	missionIndex = GetComponent.<MissionIndex>();									// --> Connect the Mission to <MissionIndex>() component. 
	gameManager = obj_Game_Manager.GetComponent.<Manager_Game>();					// --> Connect the Mission to <Manager_Game>() component. 

	for(var i : int=0;i<obj_Led.length;i++){
		arr_led_State.push(0);														// Create Array to record the Leds state from obj_Led
	}

	for(i =0;i<obj_Grp_1.length;i++){												// Create Array to record the state of the gameObject inside obj_Grp_1
		arr_obj_Grp_1_State.push(0);
	}

	for(i =0;i<obj_Grp_2.length;i++){												// Create Array ro record the state of the gameObject inside obj_Grp_2
		arr_obj_Grp_2_State.push(0);
	}
						
	if(Led_Mission_Complete)														// Connect the Mission to Led_Mission_Complete <ChangeSpriteRenderer>() component
		Led_Mission_Renderer = Led_Mission_Complete.GetComponent.< ChangeSpriteRenderer>();

	GetComponent.<Manager_Led_Animation>().Init_Obj_Led_Animation(obj_Led);			// Connect automaticaly the leds to the script Manager_Led_Animation on this Mission
	GetComponent.<Pause_Mission>().Init_Obj_Pause_Mission(obj_Led);					// Connect automaticaly the leds to the script Pause_Mission on this Mission

	if(b_SkillShot){																// --> if b_SkillShot = true. This mission is used for the Skillshot.
		var gos : GameObject[];			
		gos = GameObject.FindGameObjectsWithTag("Plunger"); 						 
		for (var go : GameObject in gos)  { 
			go.SendMessage("Connect_Plunger_To_Skillshot_Mission",this.gameObject);	// you need to tell the PLUNGER that is the skillshot mission	Spring_Launcher.js	on gameObject Spring_Launcher on the hierarchy
		} 
			
		gameManager.F_Init_Skillshot_Mission(this.gameObject);						// you need to tell the Manager_Game that is the skillshot mission	 

		if(Led_SkillShot)															// if a led is connected to the mission
			led_SkillShot= Led_SkillShot.GetComponent.<ChangeSpriteRenderer>();		// Access ChangeSpriteRenderer component from Led_SkillShot GameObject
	}

	if(obj_Door_Kickback){															// Init kickback if object is connected to obj_Door_Kickback
		Kickback_Door = new Target[obj_Door_Kickback.length];
		for(i =0;i<obj_Door_Kickback.length;i++){
			Kickback_Door[i] = obj_Door_Kickback[i].GetComponent.<Target>();		// Access Target  component
		}
		Kickback_Led = new ChangeSpriteRenderer[obj_Led_Kickback.length];			
		for(i =0;i<obj_Led_Kickback.length;i++){
			Kickback_Led[i] = obj_Led_Kickback[i].GetComponent.<ChangeSpriteRenderer>();// Access Target  ChangeSpriteRenderer
		}
	}

	if(PlayfieldAnimation)playfieldAnimation = PlayfieldAnimation.GetComponent.<Toys>();// Init if GameObject is connected

																					// --> initialize GameObject mechanics depending on the type of object
	if(Grp_1_Target){																// Grp1 : type : Target														
		F_First_Target_Grp1();
	}
	else if(Grp_1_Rollover){														// Grp1 : type : Rollover	
		Rollover_Grp_1 = new Rollovers[obj_Grp_1.length];
		for(i =0;i<obj_Grp_1.length;i++){															
			Rollover_Grp_1[i] = obj_Grp_1[i].GetComponent.<Rollovers>();								
		}

		if(Rollover_Type3_Grp_1){
			HowManyTime_Gpr1 = obj_Grp_1.length;
		}
	}
	else if(Grp_1_Bumper){															// Grp1 : type : Bumper
		F_First_Bumper_Grp1();
	}
	else if(Grp_1_Spinner){															// Grp1 : type : Spinner	
		F_First_Spinner_Grp1();
	}
	else if(Grp_1_Hole){															// Grp1 : type : Hole
		F_First_Hole_Grp1();
	}

	if(Grp_2_Target){																// Grp2 : type : Target	
		F_First_Target_Grp2();
	}
	else if(Grp_2_Rollover){														// Grp2 : type : Rollover	
		Rollover_Grp_2 = new Rollovers[obj_Grp_2.length];
		for(i =0;i<obj_Grp_2.length;i++){															
			Rollover_Grp_2[i] = obj_Grp_2[i].GetComponent.<Rollovers>();								
		}												
	}	
	else if(Grp_2_Bumper){															// Grp2 : type : Bumper
		F_First_Bumper_Grp2();
	}
	else if(Grp_2_Spinner){															// Grp2 : type : Spinner
		F_First_Spinner_Grp2();
	}
	else if(Grp_2_Hole){															// Grp2 : type : Hole
		F_First_Hole_Grp2();
	}

	if(Led_Mission_InProgress){														// Init the led : Led_Mission_InProgress
		led_Mission_InProgress_ = Led_Mission_InProgress.GetComponent.<ChangeSpriteRenderer>();
		GetComponent.<Pause_Mission>().Init_led_Mission_In_Progress(Led_Mission_InProgress);	
		Led_Mission_InProgress_State = 0;
		led_Mission_InProgress_.led_Part_InProgress_State(0);
	}
	if(Led_Part1_InProgress){														// Init the led : Led_Part1_InProgress
		led_Part1_InProgress_ = Led_Part1_InProgress.GetComponent.<ChangeSpriteRenderer>();
		GetComponent.<Pause_Mission>().Init_led_Part1_In_Progress(Led_Part1_InProgress);
		led_Part1_InProgress_.led_Part_InProgress_State(0);	
		Led_Part1_InProgress_State = 0;
	}

	gameManager_Input = obj_Game_Manager.GetComponent.<Manager_Input_Setting>();	// Access Manager_Input_Setting component from object Manager_Game on the hierarchy 
	Input_name_Left = gameManager_Input.F_flipper_Left();							
	Input_name_Right = gameManager_Input.F_flipper_Right();

	if(Mission_Txt.length == 0){newTxtArray();}										// if(Mission_Txt.length == 0) Create text for the mission 
}
//////// FUNCTION FIRST : END /////////


//////// USED WHEN A LED ANIMATION IS FINISH TO RESTORE THE LAST LED STATE //////// 
function Init_Leds_State(){															// USED WHEN A LED ANIMATION IS FINISH TO RESTORE THE LAST LED STATE
	for(var i : int=0;i<arr_led_State.length;i++){
		if(GetComponent(Pause_Mission).Return_Pause() == false){					// If the mission is not on Pause
			if(arr_led_State[i]==1)Led_Renderer[i].F_ChangeSprite_On();				// Led is on
			else Led_Renderer[i].F_ChangeSprite_Off();								// Led is off
		}
		else{																		// If the Mission is in Pause
			Led_Renderer[i].F_ChangeSprite_Off();									// All the light must be turn off after a Led animation
		}
	}
}

function InitLedMission(){															// Init led that indicate that mission is complete
	if(Led_Mission_Complete)														// This function is called by the Manager_Game.js when player is Game Over
		Led_Mission_Renderer.Led_Mission_Complete("Off");
}




// Here the function for each type of mechanics : Target, rollover, bumper, spinner and hole
// for each type of mechanics there are those function : (exemple target)
// Part_1_Type_Target_Gpr1()
// F_First_Target_Grp1()
// F_First_Target_Grp2()
// Mission_Intialisation_Target_Gp1()
// Pause_Stop_Target_Gpr1()
// Part_2_Type_Target_Gpr2()
// Part_3_Type_Target_Gpr2()
// Mission_Intialisation_Target_Gp2()
// Pause_Stop_Target_Gpr2()

////////////   TARGET SECTION : START //////////////
function Part_1_Type_Target_Gpr1(num : int){	
	if(Step < HowManyTime_Gpr1){															// --> PART 1 : Shoot target Gpr_1 : Steps to be performed by the player before the mission begins
		for(var i : int=0;i<HowManyTime_Gpr1;i++){												
			if(target_Grp_1[i].index_info() == num  && arr_obj_Grp_1_State[i] == 0){		// Target from target_Grp_1 and the target has not been touched
				arr_obj_Grp_1_State[i] = 1;													// Update the state of target from Gpr_1


				if(arr_led_State.length > F_Led_Gpr1_num(i)){								// if the taget as a led attached
					arr_led_State[F_Led_Gpr1_num(i)]= 0;									// You want switch off the leds
					Led_Renderer[F_Led_Gpr1_num(i)].F_ChangeSprite_Off();					// Led : Off	
				}
				Step++;																		// Next step

				if(Target_Order_Grp_1 && Step < HowManyTime_Gpr1){	
					arr_obj_Grp_1_State[Step]= 0;														
					target_Grp_1[Step].Activate_Object();									// Activate the target. Nothing happens if it's a stationary target
					if(obj_Grp_1_Leds.length>Step){											// If a led is attached to the target
						arr_led_State[F_Led_Gpr1_num(Step)]= 1;								// Switch On the led
						Led_Renderer[F_Led_Gpr1_num(Step)].F_ChangeSprite_On();				// Led : On
					}
				}

				if(Mission_Txt.length > 4 && Mission_Txt[4]!=""){							// Write a text on LCD Screen
					gameManager.Add_Info_To_Array(Mission_Txt_name + "\n" + Mission_Txt[4] + (HowManyTime_Gpr1 - Step).ToString() , 3);
				}


				if(Step < HowManyTime_Gpr1)Play_LedAnim_ObjAnim_LCDAnim_Part1();

				if(b_Mission_SkillShot && target_Grp_1[i].index_info() 						// -> If the skill shot is enabled end the player has shot the good target
					== Skillshot_Target_num){				
					Skillshot_Mission_Complete();											// Skill Shot Complete
				}
				break;
			}			
		}	
	}
}

function F_First_Target_Grp1(){	
	target_Grp_1 = new Target[obj_Grp_1.length];
	for(var i : int =0;i<obj_Grp_1.length;i++){															
		target_Grp_1[i] = obj_Grp_1[i].GetComponent.<Target>();								// Connect the Mission to obj_Grp_1[i].GetComponent.<Target>();	 component
	}
	HowManyTime_Gpr1 = obj_Grp_1.length;													// Init the number of target the player need to hit
	if(Target_Type_Stationary){
		Target_Order_Grp_2 = false;
		Target_No_Order_Grp_2 = true;
	}
}

function F_First_Target_Grp2(){	
	target_Grp_2 = new Target[obj_Grp_2.length];
	for(var i : int =0;i<obj_Grp_2.length;i++){															
		target_Grp_2[i] = obj_Grp_2[i].GetComponent.<Target>();								// Connect the Mission to obj_Grp_1[i].GetComponent.<Target>();	 component
	}
	HowManyTime_Gpr2 = obj_Grp_2.length;													// Init the number of target the player need to hit
}

function Mission_Intialisation_Target_Gp1(){
	for(var j : int=0;j<obj_Grp_1.length;j++){												// Init Gpr_1
		if(Target_No_Order_Grp_1){															// -> Target_No_Order_Grp_1 
			arr_obj_Grp_1_State[j]= 0;															
			target_Grp_1[j].Activate_Object();	
		}	
		else if(Target_Order_Grp_1){														// -> Target_Order_Grp_1
			if(j==0){
				arr_obj_Grp_1_State[j]= 0;													// state : 0 (Activate)		
				target_Grp_1[j].Activate_Object();	
			}
			else{
				arr_obj_Grp_1_State[j]= 1;													// state : 1 (Desactivate)		
				target_Grp_1[j].Desactivate_Object();	
			}
		}							
	}
	if(Target_No_Order_Grp_1){																// -> Target_No_Order_Grp_1 	
		for(var i : int = 0;i < obj_Grp_1_Leds.length;i++){									// init obj_Grp_1_Leds state 
		arr_led_State[F_Led_Gpr1_num(i)]= 1;												// Switch on the leds
		if(arr_led_State[F_Led_Gpr1_num(i)] == 1) Led_Renderer[F_Led_Gpr1_num(i)].F_ChangeSprite_On();	// Led : On
		else Led_Renderer[F_Led_Gpr1_num(i)].F_ChangeSprite_Off();										// Led : Off
		}
	}	
	else if(Target_Order_Grp_1){															// -> Target_Order_Grp_1
		for(i = 0;i < obj_Grp_1_Leds.length;i++){											// init obj_Grp_1_Leds state 
			if(i == 0){
				arr_led_State[F_Led_Gpr1_num(0)]= 1;
				Led_Renderer[F_Led_Gpr1_num(0)].F_ChangeSprite_On();						// Led : On
			}
			else{
				arr_led_State[F_Led_Gpr1_num(i)]= 0;										
				Led_Renderer[F_Led_Gpr1_num(i)].F_ChangeSprite_Off();						// Led : Off
			}										
		}
	}

	if(Led_Part1_InProgress){
		Led_Part1_InProgress_State = 1;
		led_Part1_InProgress_.F_ChangeSprite_On();
		led_Part1_InProgress_.led_Part_InProgress_State(1);
	}
}

function Pause_Stop_Target_Gpr1(){															// --> 
  	for(var j : int = 0;j < obj_Grp_1.length;j++){											// Init Gpr_1
		if(arr_obj_Grp_1_State[j] == 1)	target_Grp_1[j].Desactivate_Object();
		else target_Grp_1[j].Activate_Object();										
	}
	for(var i : int = 0;i < obj_Grp_1_Leds.length;i++){										// init obj_Grp_1_Leds state 
		if(arr_led_State[F_Led_Gpr1_num(i)] == 1) Led_Renderer[F_Led_Gpr1_num(i)].F_ChangeSprite_On();	// Led : On
		else Led_Renderer[F_Led_Gpr1_num(i)].F_ChangeSprite_Off();										// Led : Off
	}
	if(Led_Part1_InProgress){																// init Led_Part1_InProgress
		if(Led_Part1_InProgress_State == 0){
			led_Part1_InProgress_.F_ChangeSprite_Off();
		}
		else{
			Led_Part1_InProgress_State = 1;
			led_Part1_InProgress_.led_Part_InProgress_State(1);
			led_Part1_InProgress_.F_ChangeSprite_On();
		}
	}
}

// PART 2
function Part_2_Type_Target_Gpr2(num : int){
	if(Step == HowManyTime_Gpr1){		
		if(b_PauseMissionMode)gameManager.Start_Pause_Mode(missionIndex.F_index());
		for(var i : int = 0;i < obj_Grp_1_Leds.length;i++){							// init obj_Grp_1_Leds state 
			if(KeepLedGrp1OnDuringMission){											// init Led
				arr_led_State[F_Led_Gpr1_num(i)]= 1;										
				Led_Renderer[F_Led_Gpr1_num(i)].F_ChangeSprite_On();
			}
			else{
				arr_led_State[F_Led_Gpr1_num(i)]= 0;										
				Led_Renderer[F_Led_Gpr1_num(i)].F_ChangeSprite_Off();
			}
		}

		if(Led_Part1_InProgress){													// init Led_Part1_InProgress
			Led_Part1_InProgress_State = 0;
			led_Part1_InProgress_.led_Part_InProgress_State(0);
			led_Part1_InProgress_.F_ChangeSprite_Off();
		}
		if(Led_Mission_InProgress){													// init Led_Mission_InProgress
			Led_Mission_InProgress_State = 1;
			led_Mission_InProgress_.led_Part_InProgress_State(1);
			led_Mission_InProgress_.F_ChangeSprite_On();	
		}
		if(b_Mission_Timer || b_Mission_Multi_Timer){MissionTimer(Mission_Time);}	// Init Timer with a value						

		if(multiBall){																// Start multiball if multiBall = true									
			gameManager.F_Mission_MultiBall(missionIndex.F_index(),numberOfBall);
		}

		if(Mission_Txt.length > 13													// text on display
		&& Mission_Txt[13]!="")gameManager.Add_Info_To_Array(Mission_Txt_name + "\n" + Mission_Txt[13],3);

		if(Target_No_Order_Grp_2 || Target_Type_Stationary){						// -> Target_No_Order_Grp_2 || 	Target_Type_Stationary	
			for(var j : int =0;j<obj_Grp_2.length;j++){								// Update the state of target from Gpr_2										
				arr_obj_Grp_2_State[j]= 0;											// Activate the Gpr_2 targets	
				target_Grp_2[j].Activate_Object();	
				if(arr_led_State.length > F_Led_Gpr2_num(j)){
					arr_led_State[F_Led_Gpr2_num(j)]= 1;							// You want switch on the leds
					Led_Renderer[F_Led_Gpr2_num(j)].F_ChangeSprite_On();			// Led : On	
				}									
			}						
		}
		if(Target_Order_Grp_2){														// -> Target_Order_Grp_2
			arr_obj_Grp_2_State[0]= 0;												// state : 1 (Activate)		
			target_Grp_2[0].Activate_Object();	
			if(arr_led_State.length > obj_Grp_1_Leds.length){
				arr_led_State[obj_Grp_1_Leds.length]= 1;							// You want switch on the leds
				Led_Renderer[obj_Grp_1_Leds.length].F_ChangeSprite_On();			// Led : On	
			}	
		}	

		Step++;
		Play_LedAnim_ObjAnim_LCDAnim_Part2();										// Play led animation, object animation or lcd animation
	}
}

// PART 3
function Part_3_Type_Target_Gpr2(num : int){										
	if(Step > HowManyTime_Gpr1 && Step < (HowManyTime_Gpr1 + HowManyTime_Gpr2+1)){
		for(var i : int = 0;i<obj_Grp_2.length;i++){													
			if(target_Grp_2[i].index_info() == num  && arr_obj_Grp_2_State[i] == 0){
				if(b_Mission_Multi_Timer){MissionTimer(Mission_Time);}				// Init Timer with a value

				arr_obj_Grp_2_State[i] = 1;											// Update the state of target from Gpr_2	

				if((Target_No_Order_Grp_2 || Target_Order_Grp_2 || Target_Type_Stationary) && obj_Grp_2_Leds.length > 0){
					if(obj_Grp_1_Leds.length > 0 && arr_led_State.length >= HowManyTime_Gpr1%obj_Grp_1_Leds.length+HowManyTime_Gpr2%obj_Grp_2_Leds.length){					
						arr_led_State[obj_Grp_1_Leds.length+i]= 0;					// You want switch On the leds
						Led_Renderer[obj_Grp_1_Leds.length+i].F_ChangeSprite_Off();	// Led : On	
					}
					else if(obj_Grp_1_Leds.length == 0 && arr_led_State.length >= HowManyTime_Gpr2%obj_Grp_2_Leds.length){								
						arr_led_State[i]= 0;									// You want switch On the leds
						Led_Renderer[i].F_ChangeSprite_Off();					// Led : On	
					}
				}

				Step++;

				if(Target_Order_Grp_2 && Step < (HowManyTime_Gpr1 + obj_Grp_2.length)+1){	// -> if Target_Order_Grp_2 is checked
					arr_obj_Grp_2_State[Step-HowManyTime_Gpr1-1]= 0;														
					target_Grp_2[Step-HowManyTime_Gpr1-1].Activate_Object();				// Activate the target. Nothing happens if it's a stationary target
					if(obj_Grp_2_Leds.length>Step-HowManyTime_Gpr1-1){						// If a led is attached to the target
						arr_led_State[F_Led_Gpr2_num(Step-HowManyTime_Gpr1-1)]= 1;			// Switch On the led
						Led_Renderer[F_Led_Gpr2_num(Step-HowManyTime_Gpr1-1)].F_ChangeSprite_On();	// Led : On
					}
				}

				if(Mission_Txt.length > 5 && Mission_Txt[5]!=""){							// Write a text on LCD Screen
					gameManager.Add_Info_To_Array(Mission_Txt_name + "\n" + Mission_Txt[5] + (HowManyTime_Gpr1+obj_Grp_2.length+1 - Step).ToString() , 3);
				}
				if(Step < (HowManyTime_Gpr1 + HowManyTime_Gpr2))
				Play_LedAnim_ObjAnim_LCDAnim_Part3();										// Play led animation, object animation or lcd animation
				break;
			}							
		}					
	}	
}

// PART INITIALISATION
function Mission_Intialisation_Target_Gp2(){
	if(Led_Mission_InProgress){															// init Led_Mission_InProgress
		led_Mission_InProgress_.F_ChangeSprite_Off();
		Led_Mission_InProgress_State = 0;
		led_Mission_InProgress_.led_Part_InProgress_State(0);
	}

	if(Target_Type_Stationary){															// -> if Target_Type_Stationary
		for(var j : int = 0;j<obj_Grp_2.length;j++){									// Init Gpr_2	
			arr_obj_Grp_2_State[j]= 0;													// state : 1 (desactivate)													
			target_Grp_2[j].Activate_Object();										
		}
	}
	else{																				// -> if Target_No_Order_Grp_2,Target_Order_Grp_2
		for(j = 0;j<obj_Grp_2.length;j++){												// Init Gpr_2	
			arr_obj_Grp_2_State[j]= 1;													// state : 1 (desactivate)													
			target_Grp_2[j].Desactivate_Object();										
		}
	}

	for(j =obj_Grp_1_Leds.length;j<obj_Grp_1_Leds.length+obj_Grp_2_Leds.length;j++){	// Init Gpr_1
		arr_led_State[j]= 0;															// You want switch Off the leds
		Led_Renderer[j].F_ChangeSprite_Off();											// Led : Off	
	}
}


function Pause_Stop_Target_Gpr2(){														// --> 
	if(!Target_Type_Stationary){														// -> if  Target_No_Order_Grp_2,Target_Order_Grp_2
		for(var j : int = 0;j < obj_Grp_2.length;j++){									// Init Gpr_2
			if(arr_obj_Grp_2_State[j] == 1)	{target_Grp_2[j].Desactivate_Object();}
			else target_Grp_2[j].Activate_Object();										
		}
	}
	for(var i : int = 0;i < obj_Grp_2_Leds.length;i++){									// init obj_Grp_1_Leds state 
		if(arr_led_State[i+obj_Grp_1_Leds.length] == 1) Led_Renderer[i+obj_Grp_1_Leds.length].F_ChangeSprite_On();	// Led : On
		else Led_Renderer[i+obj_Grp_1_Leds.length].F_ChangeSprite_Off();										// Led : Off
	}

	if(Led_Mission_InProgress){															// init Led_Mission_InProgress
		if(Led_Mission_InProgress_State == 0){
			led_Mission_InProgress_.F_ChangeSprite_Off();
		}
		else{
			Led_Mission_InProgress_State = 1;
			led_Mission_InProgress_.led_Part_InProgress_State(1);
			led_Mission_InProgress_.F_ChangeSprite_On();
		}
	}
}		
////////////   TARGET SECTION : END //////////////



////////////   ROLLOVER SECTION : START //////////////
function Move_Leds_To_Right(){															// --> use for Rollover_type_3. Leds move from Left to the right when the player press Left Flipper 
	Rollover_StopMoving = false;
	LedTmp = new int[obj_Grp_1.length];
    for(var i : int=0;i<obj_Grp_1.length;i++){							    			// Record the new possition of the leds.
		 LedTmp[i] = arr_led_State[(i+obj_Grp_1.length-1)%obj_Grp_1.length];
    }

    for(i =0;i<LedTmp.length;i++){														// Save the leds state on the array				    
		arr_led_State[i] = LedTmp[i];
    }

    F_LedState();																		// Switch On/Off the leds
}
function Move_Leds_To_Left(){															// --> use for Rollover_type_3. Leds move from Right to the Left when the player press Right Flipper 
	Rollover_StopMoving = false;
	LedTmp = new int[obj_Grp_1.length];

    for(var i : int=0;i<obj_Grp_1.length;i++){							    			// Record the new possition of the leds.
		LedTmp[i] = arr_led_State[(i+1)%obj_Grp_1.length];
    }

    for(i=0;i<LedTmp.length;i++){														// Save the leds state on the array	
		arr_led_State[i] = LedTmp[i];
    }

    F_LedState();																		// Switch On/Off the leds
}
function F_LedState(){																	// --> Use to switch on or switch Off the leds from arr_led_State
	for(var i : int=0;i<obj_Grp_1.length;i++){
		if(arr_led_State[i] == 0){
			Led_Renderer[i].F_ChangeSprite_Off();										// Led : Off							
		}
		else{
			Led_Renderer[i].F_ChangeSprite_On();										// Led : On			
		}
    }
    Rollover_StopMoving = true;
}
function Txt_Rollover_type_3(){															// --> use for Rollover on obj_Gpr1. Display Mission_Txt[11] on LCD screen 
	if(Mission_Txt.length > 11 && obj_Grp_1.length>1 && Mission_Txt[11]!=""){			// -> use for Rollover_type_3.			
		var tmp_Txt : String;
		for(var i : int=0;i<obj_Grp_1.length;i++){							
			if(arr_led_State[i] == 0)													// if led state == 0 the letter is display with this color 
				tmp_Txt += 	"<color=#FF640078>" 
					+ Mission_Txt[11][i] + "</color>";					
			else																		// if led state == 1 the letter is display with this color 
				tmp_Txt += 	"<color=#FF6400FF>" 
					+ Mission_Txt[11][i] + "</color>";		
	    }
		gameManager.Add_Info_To_Array(tmp_Txt, 3); 										// Write a text on LCD Screen	
	}	
	else if(Mission_Txt.length > 11 && obj_Grp_1.length==1){							// -> use for Rollover_No_Order_Grp_1 and Rollover_Order_Grp_1.
		tmp_Txt = "";
		for(i = 0;i<obj_Grp_1_Leds.length;i++){
			if(arr_led_State[i] == 0)													// if led state == 0 the letter is display with this color 
				tmp_Txt += 	"<color=#FF640078>" 
					+ Mission_Txt[11][i] + "</color>";					
			else																		// if led state == 1 the letter is display with this color 
				tmp_Txt += 	"<color=#FF6400FF>" 
					+ Mission_Txt[11][i] + "</color>";		
	    }
		gameManager.Add_Info_To_Array(tmp_Txt, 3); 										// Write a text on LCD Screen	
	}		
}


// PART 1
function Part_1_Type_Rollover_Gpr1(num : int){											// --> Part 1
	if(Step < HowManyTime_Gpr1 ){
		for(var i : int=0;i<obj_Grp_1.length;i++){	
			if(Rollover_Grp_1.length == 1 && obj_Grp_1_Leds.length > 0 					// -> Case 1
				&& Rollover_No_Order_Grp_1 &&  Rollover_Grp_1[i].index_info() == num){ 	
				if(arr_led_State.length > F_Led_Gpr1_num(Step%obj_Grp_1.length)){		// if the rollover as a led attached
					arr_led_State[F_Led_Gpr1_num(Step)]= 1;								// You want switch off the leds
					Led_Renderer[F_Led_Gpr1_num(Step)].F_ChangeSprite_On();				// Led : Off	
				}
				Step++;																	// Next step	

				if(SpecificText)Txt_Rollover_type_3();									// Write a text on LCD Screen
				else if(Mission_Txt.length > 4 && Mission_Txt[4]!=""){					
					gameManager.Add_Info_To_Array(Mission_Txt_name + "\n" 
					+ Mission_Txt[4] + (HowManyTime_Gpr1 - Step).ToString() , 3);
				}

				if(Step < HowManyTime_Gpr1)Play_LedAnim_ObjAnim_LCDAnim_Part1();		// Play led animation, toy animation or lcd animation

				if(b_Mission_SkillShot && Rollover_Grp_1[i].index_info() 				// -> If the skill shot is enabled end the player has shot the good target
					== Skillshot_Target_num){				
						Skillshot_Mission_Complete();									// Skill Shot Complete
				}	
				break;
			}		
			else if(Rollover_No_Order_Grp_1 &&  Rollover_Grp_1[i].index_info() == num){	// -> Case 2
				Step++;																	// Next step	

				if(SpecificText)Txt_Rollover_type_3();									// Write a text on LCD Screen
				else if(Mission_Txt.length > 4 && Mission_Txt[4]!=""){							
					gameManager.Add_Info_To_Array(Mission_Txt_name + "\n" + Mission_Txt[4] + (HowManyTime_Gpr1 - Step).ToString() , 3);
				}


				if(Step < HowManyTime_Gpr1)Play_LedAnim_ObjAnim_LCDAnim_Part1();		// Play led animation, toy animation or lcd animation

				if(b_Mission_SkillShot && Rollover_Grp_1[i].index_info() 				// -> If the skill shot is enabled end the player has shot the good target
					== Skillshot_Target_num){				
						Skillshot_Mission_Complete();									// Skill Shot Complete
				}	
				break;
			}										
			else if(Rollover_Order_Grp_1 												// -> Case 3 
				&&  Rollover_Grp_1[Step%obj_Grp_1.length].index_info() == num){		
				arr_obj_Grp_1_State[i%obj_Grp_1.length] = 1;							

				if(arr_led_State.length > F_Led_Gpr1_num(Step%obj_Grp_1.length)){		// if the rollover as a led attached
					arr_led_State[F_Led_Gpr1_num(Step%obj_Grp_1.length)]= 0;			// You want switch off the leds
					Led_Renderer[F_Led_Gpr1_num(Step%obj_Grp_1.length)].F_ChangeSprite_Off();// Led : Off	
				}
				Step++;																	// Next step

				if(SpecificText)Txt_Rollover_type_3();									// Write a text on LCD Screen
				else if(Mission_Txt.length > 4 && Mission_Txt[4]!=""){	
					gameManager.Add_Info_To_Array(Mission_Txt_name + "\n" 
					+ Mission_Txt[4] + (HowManyTime_Gpr1 - Step).ToString() , 3);
				}
				if(Step < HowManyTime_Gpr1){	
					arr_obj_Grp_1_State[Step%obj_Grp_1.length]= 0;														
					if(obj_Grp_1_Leds.length>Step%obj_Grp_1.length){					// If a led is attached to the target
						arr_led_State[F_Led_Gpr1_num(Step%obj_Grp_1.length)]= 1;		// Switch On the led
						Led_Renderer[F_Led_Gpr1_num(Step%obj_Grp_1.length)].F_ChangeSprite_On();// Led : On
					}
				}
	

				if(Step < HowManyTime_Gpr1)Play_LedAnim_ObjAnim_LCDAnim_Part1();		// Play led animation, toy animation or lcd animation

				if(b_Mission_SkillShot && Rollover_Grp_1[i].index_info() 				// -> If the skill shot is enabled end the player has shot the good target
					== Skillshot_Target_num){				
						Skillshot_Mission_Complete();									// Skill Shot Complete
				}
				break;
			}
			else if(Rollover_Type3_Grp_1 												// -> Case 4 
				&& Rollover_Grp_1[i].index_info() == num && arr_led_State[i]==0){
				if(arr_led_State.length > F_Led_Gpr1_num(Step)){						// if the rollover as a led attached
					arr_led_State[i]= 1;												// You want switch off the leds
					Led_Renderer[i].F_ChangeSprite_On();								// Led : On	
				}
				Step++;																	// Next step	
				if(SpecificText)Txt_Rollover_type_3();									// Write a text on LCD Screen
				else if(Mission_Txt.length > 4 && Mission_Txt[4]!=""){		
					gameManager.Add_Info_To_Array(Mission_Txt_name + "\n" 
					+ Mission_Txt[4] + (HowManyTime_Gpr1 - Step).ToString() , 3);
				}

				if(Step < HowManyTime_Gpr1)Play_LedAnim_ObjAnim_LCDAnim_Part1();		// Play led animation, toy animation or lcd animation

				if(b_Mission_SkillShot && Rollover_Grp_1[i].index_info() 				// -> If the skill shot is enabled end the player has shot the good target
					== Skillshot_Target_num){				
						Skillshot_Mission_Complete();									// Skill Shot Complete
				}	
				break;
			}																																																																																									// Next step
		}
	}
}
function Mission_Intialisation_Rollover_Gp1(){											// --> Rollover : Init Gpr_1
	for(var j : int=0;j<obj_Grp_1_Leds.length;j++){										
		arr_led_State[j]= 0;															// You want switch Off the leds
		Led_Renderer[j].F_ChangeSprite_Off();											// Led : Off	
	}
	if(Led_Part1_InProgress){
		Led_Part1_InProgress_State = 1;
		led_Part1_InProgress_.led_Part_InProgress_State(1);
		led_Part1_InProgress_.F_ChangeSprite_On();
	}

	if(Rollover_Grp_1.length == 1 && Rollover_No_Order_Grp_1){							// --> Rollover_No_Order_Grp_1 	
		for(var i : int = 0;i < obj_Grp_1_Leds.length;i++){								// init obj_Grp_1_Leds state 
			arr_led_State[F_Led_Gpr1_num(i)]= 0;										// You want switch on the leds
			Led_Renderer[F_Led_Gpr1_num(i)].F_ChangeSprite_Off();						// Led : Off
		}
	}	
	else if(Rollover_No_Order_Grp_1){													// --> Rollover_No_Order_Grp_1 	
		for(i = 0;i < obj_Grp_1_Leds.length;i++){										// init obj_Grp_1_Leds state 
			arr_led_State[F_Led_Gpr1_num(i)]= 1;										// You want switch on the leds
			if(arr_led_State[F_Led_Gpr1_num(i)] == 1) Led_Renderer[F_Led_Gpr1_num(i)].F_ChangeSprite_On();	// Led : On
			else Led_Renderer[F_Led_Gpr1_num(i)].F_ChangeSprite_Off();										// Led : Off
		}
	}	
	else if(Rollover_Order_Grp_1){														// --> Rollover_Order_Grp_1
		for(i = 0;i < obj_Grp_1_Leds.length;i++){										// init obj_Grp_1_Leds state 
			if(i == 0){
				arr_led_State[F_Led_Gpr1_num(0)]= 1;
				Led_Renderer[F_Led_Gpr1_num(0)].F_ChangeSprite_On();					// Led : On
			}
			else{
				arr_led_State[F_Led_Gpr1_num(i)]= 0;										
				Led_Renderer[F_Led_Gpr1_num(i)].F_ChangeSprite_Off();					// Led : Off
			}																				
		}
	}
	else if(Rollover_Type3_Grp_1){}
}

function Pause_Stop_Rollover_Gpr1(){												// --> 
  	for(var i : int = 0;i < obj_Grp_1_Leds.length;i++){								// init obj_Grp_1_Leds state 
		if(arr_led_State[F_Led_Gpr1_num(i)] == 1) Led_Renderer[F_Led_Gpr1_num(i)].F_ChangeSprite_On();	// Led : On
		else Led_Renderer[F_Led_Gpr1_num(i)].F_ChangeSprite_Off();										// Led : Off
	}
	if(Led_Part1_InProgress){
		if(Led_Part1_InProgress_State == 0){
			led_Part1_InProgress_.F_ChangeSprite_Off();
		}
		else{
			Led_Part1_InProgress_State = 1;
			led_Part1_InProgress_.led_Part_InProgress_State(1);
			led_Part1_InProgress_.F_ChangeSprite_On();
		}
	}
}


// PART 2
function Part_2_Type_Rollover_Gpr2(num : int){										// --> Rollover Part 2
	if(Step == HowManyTime_Gpr1){
		if(b_PauseMissionMode)gameManager.Start_Pause_Mode(missionIndex.F_index());
		for(var i : int = 0;i < obj_Grp_1_Leds.length;i++){							// init obj_Grp_1_Leds state 
			if(KeepLedGrp1OnDuringMission){											// Keep Led On from obj_Grp1_Leds during mission progress
				arr_led_State[F_Led_Gpr1_num(i)]= 1;										
				Led_Renderer[F_Led_Gpr1_num(i)].F_ChangeSprite_On();
			}
			else{																	// Switch Off leds from obj_Grp1_Leds
				arr_led_State[F_Led_Gpr1_num(i)]= 0;										
				Led_Renderer[F_Led_Gpr1_num(i)].F_ChangeSprite_Off();
			}
		}

		if(Rollover_No_Order_Grp_2 && Rollover_Grp_2.length == 1){					// -> Rollover_No_Order_Grp_2 : Case 1 :  init obj_Grp_2_Leds state 
			for(i = 0;i < obj_Grp_2_Leds.length;i++){								 
				arr_led_State[F_Led_Gpr2_num(i)]= 0;										
				Led_Renderer[F_Led_Gpr2_num(i)].F_ChangeSprite_Off();
			}
		}
		else if(Rollover_No_Order_Grp_2){											// -> Rollover_No_Order_Grp_2 : case 2 : init obj_Grp_2_Leds state 
			for(i = 0;i < obj_Grp_2_Leds.length;i++){								// init obj_Grp_1_Leds state 
				arr_led_State[F_Led_Gpr2_num(i)]= 1;										
				Led_Renderer[F_Led_Gpr2_num(i)].F_ChangeSprite_On();
			}
		}
		else if(Rollover_Order_Grp_2){												// -> Rollover_Order_Grp_2 : case 3 : init obj_Grp_2_Leds state 
			for(i = 0;i < obj_Grp_2_Leds.length;i++){								
				if(i==0){
					arr_led_State[F_Led_Gpr2_num(i)]= 1;										
					Led_Renderer[F_Led_Gpr2_num(i)].F_ChangeSprite_On();
				}
				else{
					arr_led_State[F_Led_Gpr2_num(i)]= 0;										
					Led_Renderer[F_Led_Gpr2_num(i)].F_ChangeSprite_Off();
				}
			}
		}


		if(Led_Part1_InProgress){													// -> init Led_Part1_InProgress
			Led_Part1_InProgress_State = 0;
			led_Part1_InProgress_.led_Part_InProgress_State(0);
			led_Part1_InProgress_.F_ChangeSprite_Off();
		}

		if(Led_Mission_InProgress){													// -> init Led_Mission_InProgress
			Led_Mission_InProgress_State = 1;
			led_Mission_InProgress_.led_Part_InProgress_State(1);
			led_Mission_InProgress_.F_ChangeSprite_On();	

		}
		if(b_Mission_Timer || b_Mission_Multi_Timer){MissionTimer(Mission_Time);}	// -> Init Timer with a value						

		if(multiBall){																// -> Start multiball if multiBall = true									
			gameManager.F_Mission_MultiBall(missionIndex.F_index(),numberOfBall);
			if(Rollover_No_Order_Grp_2){
				for(i = 0;i < obj_Grp_2_Leds.length;i++){							// init obj_Grp_1_Leds state 
					arr_led_State[F_Led_Gpr2_num(i)]= 1;										
					Led_Renderer[F_Led_Gpr2_num(i)].F_ChangeSprite_On();
				}
			}
			else{
				arr_led_State[F_Led_Gpr2_num(0)]= 1;										
				Led_Renderer[F_Led_Gpr2_num(0)].F_ChangeSprite_On();
			}
		}

		if(Mission_Txt.length > 13 && Mission_Txt[13]!="")							// Write a text on LCD Screen
			gameManager.Add_Info_To_Array(Mission_Txt_name + "\n" + Mission_Txt[13],3);

		Step++;																		// Next Step
		Play_LedAnim_ObjAnim_LCDAnim_Part2();										// Play led animation, toy animation or lcd animation
	}
}


// PART 3
function Part_3_Type_Rollover_Gpr2(num : int){										// Part 3 : Rollover
	for(var i : int = 0;i < obj_Grp_2.length;i++){
		if(Step > HowManyTime_Gpr1 && Step <= HowManyTime_Gpr1+HowManyTime_Gpr2 ){
			

			if(multiBall){															// if mode multi ball true
				if(Rollover_No_Order_Grp_2 && Rollover_Grp_2[i].index_info() == num){// Case 1
					if(b_Mission_Multi_Timer){MissionTimer(Mission_Time);}			// Init Timer with a value
					if(Mission_Txt.length > 12 && Mission_Txt[12]!="")				// Write a text on LCD Screen
						gameManager.Add_Info_To_Array(Mission_Txt_name 
						+ "\n" + Mission_Txt[12] + " : " + JackpotPoints, 2);
					gameManager.Add_Score(JackpotPoints);							// Add Points
					if(Step < HowManyTime_Gpr1+HowManyTime_Gpr2 )
						Play_LedAnim_ObjAnim_LCDAnim_Part3();							// Play led animation, toy animation or lcd animation
					break;			
				}	
				else if(Rollover_Order_Grp_2 && Rollover_Grp_2[(Step_MultiBall-1-HowManyTime_Gpr1)%obj_Grp_2.length].index_info() == num){	// Case 2
					if(b_Mission_Multi_Timer){MissionTimer(Mission_Time);}																	// Init Timer with a value	
					if(obj_Grp_2_Leds.length>(Step_MultiBall-1-HowManyTime_Gpr1)%obj_Grp_2.length){											// if the rollover as a led attached
						arr_led_State[obj_Grp_1_Leds.length+(Step_MultiBall-1-HowManyTime_Gpr1)%obj_Grp_2.length]= 0;						// You want switch off the leds
						Led_Renderer[obj_Grp_1_Leds.length+(Step_MultiBall-1-HowManyTime_Gpr1)%obj_Grp_2.length].F_ChangeSprite_Off();		// Led : Off	
					}
					Step_MultiBall++;												// Next step
					if(Mission_Txt.length > 12 && Mission_Txt[12]!="")				// Write a text on LCD Screen
						gameManager.Add_Info_To_Array(Mission_Txt_name 
						+ "\n" + Mission_Txt[12] + " : " + JackpotPoints, 2);
					gameManager.Add_Score(JackpotPoints);							// Add Points

					if(obj_Grp_2_Leds.length>(Step_MultiBall-1-HowManyTime_Gpr1)%obj_Grp_2.length){
						arr_led_State[obj_Grp_1_Leds.length+(Step_MultiBall-1-HowManyTime_Gpr1)%obj_Grp_2.length]= 1;						// Switch On the led
						Led_Renderer[obj_Grp_1_Leds.length+(Step_MultiBall-1-HowManyTime_Gpr1)%obj_Grp_2.length].F_ChangeSprite_On();		// Led : On
					}

					if(Step < HowManyTime_Gpr1+HowManyTime_Gpr2 )
						Play_LedAnim_ObjAnim_LCDAnim_Part3();							// Play led animation, toy animation or lcd animation
					break;	
				}
			}
			else{																	// --> if mode multi ball = false
				if(Rollover_Grp_2.length == 1 && Rollover_No_Order_Grp_2 			// -> case 1
					&&  Rollover_Grp_2[(Step-1-HowManyTime_Gpr1)%obj_Grp_2.length].index_info() == num){	// -> if there is only one rollover on Rollover_Grp_2. 
					if(b_Mission_Multi_Timer){MissionTimer(Mission_Time);}									// Init Timer with a value
					if(obj_Grp_2_Leds.length>(Step-1-HowManyTime_Gpr1)){									// if the rollover as a led attached
						arr_led_State[obj_Grp_1_Leds.length+(Step-1-HowManyTime_Gpr1)]= 1;					// You want switch off the leds
						Led_Renderer[obj_Grp_1_Leds.length+(Step-1-HowManyTime_Gpr1)].F_ChangeSprite_On();	// Led : Off	
					}
					Step++;															// Next step

					if(Mission_Txt.length > 5 && Mission_Txt[5]!=""){				// Write a text on LCD Screen
						gameManager.Add_Info_To_Array(Mission_Txt_name + "\n" 
						+ Mission_Txt[5] + (HowManyTime_Gpr1+HowManyTime_Gpr2+1 - Step).ToString() , 3);
					}

					if(Step < HowManyTime_Gpr1+HowManyTime_Gpr2 )
						Play_LedAnim_ObjAnim_LCDAnim_Part3();							// Play led animation, toy animation or lcd animation
					break;	
				}	
				else if(Rollover_No_Order_Grp_2 && Rollover_Grp_2[i].index_info() == num){	// -> case 2
					if(b_Mission_Multi_Timer){MissionTimer(Mission_Time);}					// Init Timer with a value
					Step++;																	// Next step

					if(Mission_Txt.length > 5 && Mission_Txt[5]!=""){						// Write a text on LCD Screen
						gameManager.Add_Info_To_Array(Mission_Txt_name + "\n" 
						+ Mission_Txt[5] + (HowManyTime_Gpr1+HowManyTime_Gpr2+1 - Step).ToString() , 3);
					}

					if(Step < HowManyTime_Gpr1+HowManyTime_Gpr2 )
						Play_LedAnim_ObjAnim_LCDAnim_Part3();							// Play led animation, toy animation or lcd animation
					break;			
				}										
				else if(Rollover_Order_Grp_2 &&  Rollover_Grp_2[(Step-1-HowManyTime_Gpr1)%obj_Grp_2.length].index_info() == num){	// -> case 3	
					if(b_Mission_Multi_Timer){MissionTimer(Mission_Time);}															// Init Timer with a value	
					if(obj_Grp_2_Leds.length>(Step-1-HowManyTime_Gpr1)%obj_Grp_2.length){											// if the rollover as a led attached
						arr_led_State[obj_Grp_1_Leds.length+(Step-1-HowManyTime_Gpr1)%obj_Grp_2.length]= 0;							// You want switch off the leds
						Led_Renderer[obj_Grp_1_Leds.length+(Step-1-HowManyTime_Gpr1)%obj_Grp_2.length].F_ChangeSprite_Off();		// Led : Off	
					}
					Step++;															// Next step

					if(Mission_Txt.length > 5 && Mission_Txt[5]!=""){				// Write a text on LCD Screen
						gameManager.Add_Info_To_Array(Mission_Txt_name + "\n" 
						+ Mission_Txt[5] + (HowManyTime_Gpr1+HowManyTime_Gpr2+1 - Step).ToString() , 3);
					}
											// Play led animation, toy animation or lcd animation

					if(obj_Grp_2_Leds.length>(Step-1-HowManyTime_Gpr1)%obj_Grp_2.length){
						arr_led_State[obj_Grp_1_Leds.length+(Step-1-HowManyTime_Gpr1)%obj_Grp_2.length]= 1;					// Switch On the led
						Led_Renderer[obj_Grp_1_Leds.length+(Step-1-HowManyTime_Gpr1)%obj_Grp_2.length].F_ChangeSprite_On();	// Led : On
					}

					if(Step < HowManyTime_Gpr1+HowManyTime_Gpr2 )
						Play_LedAnim_ObjAnim_LCDAnim_Part3();							// Play led animation, toy animation or lcd animation
					break;	
				}
			}
		}
	}
}


// PART INITIALISATION
function Mission_Intialisation_Rollover_Gp2(){										// --> Init Rollover Grp2
	if(Led_Mission_InProgress){														// init Led_Mission_InProgress
		led_Mission_InProgress_.F_ChangeSprite_Off();
		led_Mission_InProgress_.led_Part_InProgress_State(0);
		Led_Mission_InProgress_State = 0;
	}

	for(var j : int=obj_Grp_1_Leds.length;j<obj_Grp_1_Leds.length+obj_Grp_2_Leds.length;j++){	
		arr_led_State[j]= 0;														// You want switch Off the leds
		Led_Renderer[j].F_ChangeSprite_Off();										// Led : Off	
	}
}


function Pause_Stop_Rollover_Gpr2(){												// -->
   	for(var i : int = 0;i < obj_Grp_2_Leds.length;i++){								
		if(arr_led_State[F_Led_Gpr2_num(i)] == 1) Led_Renderer[F_Led_Gpr2_num(i)].F_ChangeSprite_On();	// Led : On
		else Led_Renderer[F_Led_Gpr2_num(i)].F_ChangeSprite_Off();										// Led : Off
	}
	if(Led_Mission_InProgress){														// init Led_Mission_InProgress
		if(Led_Mission_InProgress_State == 0){
			led_Mission_InProgress_.F_ChangeSprite_Off();
		}
		else{
			Led_Mission_InProgress_State = 1;
			led_Mission_InProgress_.led_Part_InProgress_State(1);
			led_Mission_InProgress_.F_ChangeSprite_On();
		}
	}	
}
////////////   ROLLOVER SECTION : END //////////////



////////////   BUMPER SECTION : START //////////////

// PART 1
function Part_1_Type_Bumper_Gpr1(num : int){													// --> Bumper Section Part 1
	for(var i : int = 0;i < obj_Grp_1.length;i++){			
		if(Bumper_Grp_1[i].index_info() == num){
			if(Step < HowManyTime_Gpr1){
				if(arr_led_State.length >= HowManyTime_Gpr1 && obj_Grp_1_Leds.length > 0 ){		// if the Bumper as leds attached
					arr_led_State[Step]= 1;														// You want switch On the leds
					Led_Renderer[Step].F_ChangeSprite_On();										// Led : On	
				}

				Step++;																			// Next step

				if(Mission_Txt.length > 4 && Mission_Txt[4]!=""){								// Write a text on LCD Screen
						gameManager.Add_Info_To_Array(Mission_Txt_name + "\n" + Mission_Txt[4] + (HowManyTime_Gpr1 - Step).ToString() , 3);
				}

				if(Step < HowManyTime_Gpr1)Play_LedAnim_ObjAnim_LCDAnim_Part1();				// Play led animation, toy animation or lcd animation

				if(b_Mission_SkillShot && Bumper_Grp_1[i].index_info() 							// -> If the skill shot is enabled end the player has shot the good target
					== Skillshot_Target_num){
						Skillshot_Mission_Complete();	
				}
			}
		}
	}
}

function F_First_Bumper_Grp1(){																	// --> Init Bumper Grp1
	Bumper_Grp_1 = new Bumper_js[obj_Grp_1.length];
		for(var i : int =0;i<obj_Grp_1.length;i++){															
		Bumper_Grp_1[i] = obj_Grp_1[i].GetComponent.<Bumper_js>();								// Connect the Mission to obj_Grp_1[i].GetComponent.<Bumper_js>();	 component
	}
}
function F_First_Bumper_Grp2(){																	// --> Init Bumper Grp2
	Bumper_Grp_2 = new Bumper_js[obj_Grp_2.length];
		for(var i : int =0;i<obj_Grp_2.length;i++){															
		Bumper_Grp_2[i] = obj_Grp_2[i].GetComponent.<Bumper_js>();								// Connect the Mission to obj_Grp_1[i].GetComponent.<Bumper_js>();	 component
	}
}

function Mission_Intialisation_Bumper_Gp1(){													// Init Led Mission
	for(var j : int=0;j<obj_Grp_1_Leds.length;j++){												// Init Gpr_1
		arr_led_State[j]= 0;																	// You want switch Off the leds
		Led_Renderer[j].F_ChangeSprite_Off();													// Led : Off	
	}
	if(Led_Part1_InProgress){																	// init Led_Part1_InProgress
		Led_Part1_InProgress_State = 1;
		led_Part1_InProgress_.led_Part_InProgress_State(1);
		led_Part1_InProgress_.F_ChangeSprite_On();
	}
}

function Pause_Stop_Bumper_Gpr1(){																// --> 
  	for(var i : int = 0;i < obj_Grp_1_Leds.length;i++){											// init obj_Grp_1_Leds state 
		if(arr_led_State[F_Led_Gpr1_num(i)] == 1) Led_Renderer[F_Led_Gpr1_num(i)].F_ChangeSprite_On();	// Led : On
		else Led_Renderer[F_Led_Gpr1_num(i)].F_ChangeSprite_Off();										// Led : Off
	}
	if(Led_Part1_InProgress){																	// init Led_Part1_InProgress
		if(Led_Part1_InProgress_State == 0){
			led_Part1_InProgress_.F_ChangeSprite_Off();
		}
		else{
			Led_Part1_InProgress_State = 1;
			led_Part1_InProgress_.led_Part_InProgress_State(1);
			led_Part1_InProgress_.F_ChangeSprite_On();
		}
	}
}

// PART 2
function Part_2_Type_Bumper_Gpr2(num : int){													// --> Bumper Part 2
	if(Step == HowManyTime_Gpr1){
		if(b_PauseMissionMode)gameManager.Start_Pause_Mode(missionIndex.F_index());				// Pause Mission
		for(var i : int = 0;i < obj_Grp_1_Leds.length;i++){										// init obj_Grp_1_Leds state 
			if(KeepLedGrp1OnDuringMission){														// Keep Led Grp1 On During Mission if true
				arr_led_State[F_Led_Gpr1_num(i)]= 1;										
				Led_Renderer[F_Led_Gpr1_num(i)].F_ChangeSprite_On();
			}
			else{
				arr_led_State[F_Led_Gpr1_num(i)]= 0;										
				Led_Renderer[F_Led_Gpr1_num(i)].F_ChangeSprite_Off();
			}
		}

		if(Led_Part1_InProgress){																// init Led_Part1_InProgress
			Led_Part1_InProgress_State = 0;
			led_Part1_InProgress_.led_Part_InProgress_State(0);
			led_Part1_InProgress_.F_ChangeSprite_Off();
		}
		if(Led_Mission_InProgress){																// init Led_Mission_InProgress
			Led_Mission_InProgress_State = 1;
			led_Mission_InProgress_.led_Part_InProgress_State(1);
			led_Mission_InProgress_.F_ChangeSprite_On();	
		}
		if(b_Mission_Timer || b_Mission_Multi_Timer){MissionTimer(Mission_Time);}				// Init Timer with a value						

		if(multiBall){																			// Start multiball if multiBall = true									
			gameManager.F_Mission_MultiBall(missionIndex.F_index(),numberOfBall);
		}

		if(Mission_Txt.length > 13																// Write a text on LCD Screen
		&& Mission_Txt[13]!="")gameManager.Add_Info_To_Array(Mission_Txt_name + "\n" + Mission_Txt[13],3);

		Step++;
		Play_LedAnim_ObjAnim_LCDAnim_Part2();
	}
}


// PART 3
function Part_3_Type_Bumper_Gpr2(num : int){													// Bumper Part 3
	for(var i : int = 0;i < obj_Grp_2.length;i++){
		if(Bumper_Grp_2[i].index_info() == num){
			if(Step > HowManyTime_Gpr1 && Step < (HowManyTime_Gpr1 + HowManyTime_Gpr2+1)){	
			if(b_Mission_Multi_Timer){MissionTimer(Mission_Time);}								// Init Timer with a value
				if(obj_Grp_2_Leds.length>(Step-1-HowManyTime_Gpr1)){							// if the rollover as a led attached
					arr_led_State[obj_Grp_1_Leds.length+(Step-1-HowManyTime_Gpr1)]= 1;			// You want switch off the leds
					Led_Renderer[obj_Grp_1_Leds.length+(Step-1-HowManyTime_Gpr1)].F_ChangeSprite_On();	// Led : Off	
				}

				Step++;																			// Next step

				if(Mission_Txt.length > 5 && Mission_Txt[5]!=""){								// Write a text on LCD Screen
					gameManager.Add_Info_To_Array(Mission_Txt_name + "\n" + Mission_Txt[5] + (HowManyTime_Gpr1+HowManyTime_Gpr2+1 - Step).ToString() , 3);
				}

				if(Step < (HowManyTime_Gpr1 + HowManyTime_Gpr2))
				Play_LedAnim_ObjAnim_LCDAnim_Part3();											// Play led animation, toy animation or lcd animation

				break;
			}
		}
	}
}

// PART INITIALISATION
function Mission_Intialisation_Bumper_Gp2(){													// --> Init Leds Mission Bumper
	if(Led_Mission_InProgress){																	// init Led_Mission_InProgress
		led_Mission_InProgress_.F_ChangeSprite_Off();
		Led_Mission_InProgress_State = 0;
		led_Mission_InProgress_.led_Part_InProgress_State(0);
	}

	for(var j : int=obj_Grp_1_Leds.length;j<obj_Grp_1_Leds.length+obj_Grp_2_Leds.length;j++){	// init Led
		arr_led_State[j]= 0;																	// You want switch Off the leds
		Led_Renderer[j].F_ChangeSprite_Off();													// Led : Off	
	}
}


function Pause_Stop_Bumper_Gpr2(){																// --> 
   	for(var i : int = 0;i < obj_Grp_2_Leds.length;i++){											// init obj_Grp_1_Leds state 
		if(arr_led_State[F_Led_Gpr2_num(i)] == 1) Led_Renderer[F_Led_Gpr2_num(i)].F_ChangeSprite_On();	// Led : On
		else Led_Renderer[F_Led_Gpr2_num(i)].F_ChangeSprite_Off();										// Led : Off
	}
	if(Led_Mission_InProgress){																	// init Led_Mission_InProgress
		if(Led_Mission_InProgress_State == 0){
			led_Mission_InProgress_.F_ChangeSprite_Off();
		}
		else{																					 
			Led_Mission_InProgress_State = 1;
			led_Mission_InProgress_.led_Part_InProgress_State(1);
			led_Mission_InProgress_.F_ChangeSprite_On();
		}
	}	
}



////////////   SPINNER SECTION : START //////////////
// PART 1
function Part_1_Type_Spinner_Gpr1(num : int){												// --> Spinner Part 1

	for(var i : int = 0;i < obj_Grp_1.length;i++){			
		if(Spinner_Grp_1[i].index_info() == num){
			if(Step < HowManyTime_Gpr1 ){
				if(arr_led_State.length >= HowManyTime_Gpr1 && obj_Grp_1_Leds.length > 0 ){	// if the Spinner as leds attached
					arr_led_State[Step]= 1;													// You want switch On the leds
					Led_Renderer[Step].F_ChangeSprite_On();						// Led : On	
				}
				Step++;																		// Next step

				if(Mission_Txt.length > 4 && Mission_Txt[4]!=""){							// Write a text on LCD Screen
					gameManager.Add_Info_To_Array(Mission_Txt_name + "\n" 
					+ Mission_Txt[4] + (HowManyTime_Gpr1 - Step).ToString() , 3);
				}
				
				if(Step < HowManyTime_Gpr1)Play_LedAnim_ObjAnim_LCDAnim_Part1();			// Play led animation, toy animation or lcd animation

				if(b_Mission_SkillShot && Spinner_Grp_1[i].index_info() 					// -> If the skill shot is enabled end the player has shot the good target
					== Skillshot_Target_num){
						Skillshot_Mission_Complete();	
				}
			}
		}
	}
}

function F_First_Spinner_Grp1(){															// init Spinner Grp1
	Spinner_Grp_1 = new Spinner_LapCounter[obj_Grp_1.length];
		for(var i : int =0;i<obj_Grp_1.length;i++){															
		Spinner_Grp_1[i] = obj_Grp_1[i].GetComponent.<Spinner_LapCounter>();				// Connect the Mission to obj_Grp_1[i].GetComponent.<Target>();	 component
	}
}	
function F_First_Spinner_Grp2(){															// init Spinner Grp2
	Spinner_Grp_2 = new Spinner_LapCounter[obj_Grp_2.length];
		for(var i : int =0;i<obj_Grp_2.length;i++){															
		Spinner_Grp_2[i] = obj_Grp_2[i].GetComponent.<Spinner_LapCounter>();				// Connect the Mission to obj_Grp_1[i].GetComponent.<Target>();	 component
	}
}

function Mission_Intialisation_Spinner_Gp1(){												// Init Mission Led Grp1
	for(var j : int=0;j<obj_Grp_1_Leds.length;j++){											// Init Gpr_1
		arr_led_State[j]= 0;																// You want switch Off the leds
		Led_Renderer[j].F_ChangeSprite_Off();												// Led : Off	
	}
	if(Led_Part1_InProgress){																// init Led_Part1_InProgress
		Led_Part1_InProgress_State = 1;
		led_Part1_InProgress_.led_Part_InProgress_State(1);
		led_Part1_InProgress_.F_ChangeSprite_On();
	}
}

function Pause_Stop_Spinner_Gpr1(){															// --> 
  	for(var i : int = 0;i < obj_Grp_1_Leds.length;i++){										// init obj_Grp_1_Leds state 
		if(arr_led_State[F_Led_Gpr1_num(i)] == 1) Led_Renderer[F_Led_Gpr1_num(i)].F_ChangeSprite_On();	// Led : On
		else Led_Renderer[F_Led_Gpr1_num(i)].F_ChangeSprite_Off();										// Led : Off
	}
	if(Led_Part1_InProgress){																// init Led_Part1_InProgress
		if(Led_Part1_InProgress_State == 0){
			led_Part1_InProgress_.F_ChangeSprite_Off();
		}
		else{
			Led_Part1_InProgress_State = 1;
			led_Part1_InProgress_.led_Part_InProgress_State(1);
			led_Part1_InProgress_.F_ChangeSprite_On();
		}
	}
}

// PART 2
function Part_2_Type_Spinner_Gpr2(num : int){												// --> Part 2
	if(Step == HowManyTime_Gpr1){
		if(b_PauseMissionMode)gameManager.Start_Pause_Mode(missionIndex.F_index());
		for(var i : int = 0;i < obj_Grp_1_Leds.length;i++){									// init obj_Grp_1_Leds state 
			if(KeepLedGrp1OnDuringMission){													// Keep Led Grp1 On During Mission if true
				arr_led_State[F_Led_Gpr1_num(i)]= 1;										
				Led_Renderer[F_Led_Gpr1_num(i)].F_ChangeSprite_On();
			}
			else{
				arr_led_State[F_Led_Gpr1_num(i)]= 0;										
				Led_Renderer[F_Led_Gpr1_num(i)].F_ChangeSprite_Off();
			}
		}

		if(Led_Part1_InProgress){															// init Led_Part1_InProgress
			Led_Part1_InProgress_State = 0;
			led_Part1_InProgress_.led_Part_InProgress_State(0);
			led_Part1_InProgress_.F_ChangeSprite_Off();
		}
		if(Led_Mission_InProgress){															// init Led_Mission_InProgress
			Led_Mission_InProgress_State = 1;
			led_Mission_InProgress_.led_Part_InProgress_State(1);
			led_Mission_InProgress_.F_ChangeSprite_On();	
		}
		if(b_Mission_Timer || b_Mission_Multi_Timer){MissionTimer(Mission_Time);}			// Init Timer with a value						

		if(multiBall){																		// Start multiball if multiBall = true									
			gameManager.F_Mission_MultiBall(missionIndex.F_index(),numberOfBall);
		}

		if(Mission_Txt.length > 13 && Mission_Txt[13]!="")									// Write a text on LCD Screen
		gameManager.Add_Info_To_Array(Mission_Txt_name + "\n" 
		+ Mission_Txt[13],3);

		Step++;																				// Next step
		Play_LedAnim_ObjAnim_LCDAnim_Part2();												// Play led animation, toy animation or lcd animation
	}
}



// PART 3
function Part_3_Type_Spinner_Gpr2(num : int){												// Part 3

	for(var i : int = 0;i < obj_Grp_2.length;i++){
		if(Spinner_Grp_2[i].index_info() == num){
			//Debug.Log(Spinner_Grp_2[i].index_info() + " : " + num);
			if(Step > HowManyTime_Gpr1 && Step < (HowManyTime_Gpr1 + HowManyTime_Gpr2+1)){	
				if(b_Mission_Multi_Timer){MissionTimer(Mission_Time);}						// Init Timer with a value
				if(obj_Grp_2_Leds.length>(Step-1-HowManyTime_Gpr1)){						// if the spinner as a led attached
					arr_led_State[obj_Grp_1_Leds.length+(Step-1-HowManyTime_Gpr1)]= 1;		// You want switch off the leds
					Led_Renderer[obj_Grp_1_Leds.length+(Step-1-HowManyTime_Gpr1)].F_ChangeSprite_On();// Led : On	
				}

				Step++;																		// Next step

				if(Mission_Txt.length > 5 && Mission_Txt[5]!=""){							// Write a text on LCD Screen
					gameManager.Add_Info_To_Array(Mission_Txt_name + "\n" 
					+ Mission_Txt[5] + (HowManyTime_Gpr1+HowManyTime_Gpr2+1 - Step).ToString() , 3);
				}

				if(Step < (HowManyTime_Gpr1 + HowManyTime_Gpr2))
				Play_LedAnim_ObjAnim_LCDAnim_Part3();										// Play led animation, toy animation or lcd animation

				break;
			}
		}
	}
}

// PART INITIALISATION	
function Mission_Intialisation_Spinner_Gp2(){												// --> Init Leds Mission Grp2
	if(Led_Mission_InProgress){																// init Led_Mission_InProgress
		led_Mission_InProgress_.F_ChangeSprite_Off();
		Led_Mission_InProgress_State = 0;
		led_Mission_InProgress_.led_Part_InProgress_State(0);
	}

	for(var j : int=obj_Grp_1_Leds.length;j<obj_Grp_1_Leds.length+obj_Grp_2_Leds.length;j++){// Init 
		arr_led_State[j]= 0;																// You want switch Off the leds
		Led_Renderer[j].F_ChangeSprite_Off();												// Led : Off	
	}
}


function Pause_Stop_Spinner_Gpr2(){															// --> 
   	for(var i : int = 0;i < obj_Grp_2_Leds.length;i++){										// init obj_Grp_1_Leds state 
		if(arr_led_State[F_Led_Gpr2_num(i)] == 1) Led_Renderer[F_Led_Gpr2_num(i)].F_ChangeSprite_On();	// Led : On
		else Led_Renderer[F_Led_Gpr2_num(i)].F_ChangeSprite_Off();										// Led : Off
	}
	if(Led_Mission_InProgress){																// init Led_Mission_InProgress
		if(Led_Mission_InProgress_State == 0){
			led_Mission_InProgress_.F_ChangeSprite_Off();
		}
		else{
			Led_Mission_InProgress_State = 1;
			led_Mission_InProgress_.led_Part_InProgress_State(1);
			led_Mission_InProgress_.F_ChangeSprite_On();
		}
	}	
}

////////////   HOLE SECTION : START //////////////
// PART 1
function Part_1_Type_Hole_Gpr1(num : int){
	for(var i : int = 0;i < obj_Grp_1.length;i++){			
		if(Hole_Grp_1[i].index_info() == num){
			if(Step < HowManyTime_Gpr1 ){
				if(arr_led_State.length >= HowManyTime_Gpr1 && obj_Grp_1_Leds.length > 0 ){								// if the Rollover as leds attached
					arr_led_State[Step]= 1;									// You want switch On the leds
					Led_Renderer[Step].F_ChangeSprite_On();					// Led : On	
				}
				Step++;																		// Next step

				if(Mission_Txt.length > 4 && Mission_Txt[4]!=""){							// Write a text on LCD Screen
					gameManager.Add_Info_To_Array(Mission_Txt_name + "\n" + Mission_Txt[4] + (HowManyTime_Gpr1 - Step).ToString() , 3);
				}


				if(Step < HowManyTime_Gpr1)Play_LedAnim_ObjAnim_LCDAnim_Part1();

				if(b_Mission_SkillShot && Hole_Grp_1[i].index_info() 						// -> If the skill shot is enabled end the player has shot the good target
					== Skillshot_Target_num){
						Skillshot_Mission_Complete();	
				}
			}
		}
	}
}

function F_First_Hole_Grp1(){
	Hole_Grp_1 = new Hole[obj_Grp_1.length];
		for(var i : int =0;i<obj_Grp_1.length;i++){															
		Hole_Grp_1[i] = obj_Grp_1[i].GetComponent.<Hole>();								// Connect the Mission to obj_Grp_1[i].GetComponent.<Target>();	 component
	}
}
function F_First_Hole_Grp2(){
	Hole_Grp_2 = new Hole[obj_Grp_2.length];
		for(var i : int =0;i<obj_Grp_2.length;i++){															
		Hole_Grp_2[i] = obj_Grp_2[i].GetComponent.<Hole>();								// Connect the Mission to obj_Grp_1[i].GetComponent.<Target>();	 component
	}
}

function Mission_Intialisation_Hole_Gp1(){
	for(var j : int=0;j<obj_Grp_1_Leds.length;j++){										// Init Gpr_1
		arr_led_State[j]= 0;									// You want switch Off the leds
		Led_Renderer[j].F_ChangeSprite_Off();					// Led : Off	
	}
	if(Led_Part1_InProgress){
		Led_Part1_InProgress_State = 1;
		led_Part1_InProgress_.led_Part_InProgress_State(1);
		led_Part1_InProgress_.F_ChangeSprite_On();
	}
}

function Pause_Stop_Hole_Gpr1(){												// --> 
  	for(var i : int = 0;i < obj_Grp_1_Leds.length;i++){								// init obj_Grp_1_Leds state 
		if(arr_led_State[F_Led_Gpr1_num(i)] == 1) Led_Renderer[F_Led_Gpr1_num(i)].F_ChangeSprite_On();	// Led : On
		else Led_Renderer[F_Led_Gpr1_num(i)].F_ChangeSprite_Off();										// Led : Off
	}
	if(Led_Part1_InProgress){
		if(Led_Part1_InProgress_State == 0){
			led_Part1_InProgress_.F_ChangeSprite_Off();
		}
		else{
			Led_Part1_InProgress_State = 1;
			led_Part1_InProgress_.led_Part_InProgress_State(1);
			led_Part1_InProgress_.F_ChangeSprite_On();
		}
	}
}

// PART 2
function Part_2_Type_Hole_Gpr2(num : int){
	if(Step == HowManyTime_Gpr1){
		if(b_PauseMissionMode)gameManager.Start_Pause_Mode(missionIndex.F_index());

		for(var i : int = 0;i < obj_Grp_1_Leds.length;i++){								// init obj_Grp_1_Leds state 
			if(KeepLedGrp1OnDuringMission){
				arr_led_State[F_Led_Gpr1_num(i)]= 1;										
				Led_Renderer[F_Led_Gpr1_num(i)].F_ChangeSprite_On();
			}
			else{
				arr_led_State[F_Led_Gpr1_num(i)]= 0;										
				Led_Renderer[F_Led_Gpr1_num(i)].F_ChangeSprite_Off();
			}
		}

		if(Led_Part1_InProgress){
			Led_Part1_InProgress_State = 0;
			led_Part1_InProgress_.led_Part_InProgress_State(0);
			led_Part1_InProgress_.F_ChangeSprite_Off();
		}

		if(Led_Mission_InProgress){
			Led_Mission_InProgress_State = 1;
			led_Mission_InProgress_.led_Part_InProgress_State(1);
			led_Mission_InProgress_.F_ChangeSprite_On();	
		}
		if(b_Mission_Timer || b_Mission_Multi_Timer){MissionTimer(Mission_Time);}	// Init Timer with a value						

		if(multiBall){																// Start multiball if multiBall = true									
			gameManager.F_Mission_MultiBall(missionIndex.F_index(),numberOfBall);
		}

		if(Mission_Txt.length > 13
		&& Mission_Txt[13]!="")gameManager.Add_Info_To_Array(Mission_Txt_name + "\n" + Mission_Txt[13],3);

		Step++;
		Play_LedAnim_ObjAnim_LCDAnim_Part2();
	}
}


// PART 3
function Part_3_Type_Hole_Gpr2(num : int){
	for(var i : int = 0;i < obj_Grp_2.length;i++){
		if(Hole_Grp_2[i].index_info() == num){
			if(Step > HowManyTime_Gpr1 && Step < (HowManyTime_Gpr1 + HowManyTime_Gpr2+1)){	
				if(b_Mission_Multi_Timer){MissionTimer(Mission_Time);}				// Init Timer with a value

				if(obj_Grp_2_Leds.length>(Step-1-HowManyTime_Gpr1)){											// if the rollover as a led attached
					arr_led_State[obj_Grp_1_Leds.length+(Step-1-HowManyTime_Gpr1)]= 1;							// You want switch off the leds
					Led_Renderer[obj_Grp_1_Leds.length+(Step-1-HowManyTime_Gpr1)].F_ChangeSprite_On();			// Led : Off	
				}

				Step++;																		// Next step

				if(Mission_Txt.length > 5 && Mission_Txt[5]!=""){							// Write a text on LCD Screen
					gameManager.Add_Info_To_Array(Mission_Txt_name + "\n" + Mission_Txt[5] + (HowManyTime_Gpr1+HowManyTime_Gpr2+1 - Step).ToString() , 3);
				}

				if(Step < (HowManyTime_Gpr1 + HowManyTime_Gpr2))
				Play_LedAnim_ObjAnim_LCDAnim_Part3();
				break;
			}
		}
	}
}

// PART INITIALISATION
function Mission_Intialisation_Hole_Gp2(){
	if(Led_Mission_InProgress){
		led_Mission_InProgress_.F_ChangeSprite_Off();
		Led_Mission_InProgress_State = 0;
		led_Mission_InProgress_.led_Part_InProgress_State(0);
	}

	for(var j : int=obj_Grp_1_Leds.length;j<obj_Grp_1_Leds.length+obj_Grp_2_Leds.length;j++){										// Init Gpr_1
		arr_led_State[j]= 0;									// You want switch Off the leds
		Led_Renderer[j].F_ChangeSprite_Off();					// Led : Off	
	}
}


function Pause_Stop_Hole_Gpr2(){												// --> 
   	for(var i : int = 0;i < obj_Grp_2_Leds.length;i++){										// init obj_Grp_1_Leds state 
		if(arr_led_State[F_Led_Gpr2_num(i)] == 1) Led_Renderer[F_Led_Gpr2_num(i)].F_ChangeSprite_On();	// Led : On
		else Led_Renderer[F_Led_Gpr2_num(i)].F_ChangeSprite_Off();										// Led : Off
	}
	if(Led_Mission_InProgress){
		if(Led_Mission_InProgress_State == 0){
			led_Mission_InProgress_.F_ChangeSprite_Off();
		}
		else{
			Led_Mission_InProgress_State = 1;
			led_Mission_InProgress_.led_Part_InProgress_State(1);
			led_Mission_InProgress_.F_ChangeSprite_On();
		}
	}	
}



//////////////////////////// HOLE SCTION : END


//////// FUNCTION TO PLAY AN ANIMATION ON THE LCD SCREEN ////////
function Play_LCD_Screen_Animation(num : int){
	var gos : GameObject[];			
	gos = GameObject.FindGameObjectsWithTag("Led_animation"); 						// Find all game objects with tag Led_animation
	for (var go : GameObject in gos)  { 
		Destroy(go);																// You could play only one animation
	} 
	Instantiate(obj_Anim_On_Led_Display[num]);										// Play animation
}


// Play Led animation, Object Animation and LCD animation for each part of the mission
function Play_LedAnim_ObjAnim_LCDAnim_Part1(){
	if(LCD_AnimNumPart1 != -1 && obj_Anim_On_Led_Display.length > LCD_AnimNumPart1)										// Play animation if an animation is affected
		Play_LCD_Screen_Animation(LCD_AnimNumPart1); 
	if(LED_Anim_Num_Part1!=-1)gameManager.PlayMultiLeds(LED_Anim_Num_Part1);	
	if(PlayfieldAnimation && PF_AnimNumPart1!=-1)playfieldAnimation.PlayAnimationNumber(PF_AnimNumPart1);
	if(sfx_Part1){sound_.clip = sfx_Part1;sound_.Play();}
}
function Play_LedAnim_ObjAnim_LCDAnim_Part2(){
	if(LCD_AnimNumPart2 != -1 && obj_Anim_On_Led_Display.length > LCD_AnimNumPart2)										// Play animation if an animation is affected
		Play_LCD_Screen_Animation(LCD_AnimNumPart2); 
	if(LED_Anim_Num_Part2!=-1)gameManager.PlayMultiLeds(LED_Anim_Num_Part2);	
	if(PlayfieldAnimation && PF_AnimNumPart2!=-1)playfieldAnimation.PlayAnimationNumber(PF_AnimNumPart2);
	if(sfx_Part2){sound_.clip = sfx_Part2;sound_.Play();}
}
function Play_LedAnim_ObjAnim_LCDAnim_Part3(){
	if(LCD_AnimNumPart3 != -1 && obj_Anim_On_Led_Display.length > LCD_AnimNumPart3)										// Play animation if an animation is affected
		Play_LCD_Screen_Animation(LCD_AnimNumPart3); 
	if(LED_Anim_Num_Part3!=-1)gameManager.PlayMultiLeds(LED_Anim_Num_Part3);	
	if(PlayfieldAnimation && PF_AnimNumPart3!=-1)playfieldAnimation.PlayAnimationNumber(PF_AnimNumPart3);
	if(sfx_Part3){sound_.clip = sfx_Part3;sound_.Play();}
}
function Play_LedAnim_ObjAnim_LCDAnim_Complete(){
	if(LCD_AnimNumComplete != -1 && obj_Anim_On_Led_Display.length > LCD_AnimNumComplete)								// Play animation if an animation is affected
		Play_LCD_Screen_Animation(LCD_AnimNumComplete); 
	if(LED_Anim_Num_Complete!=-1)gameManager.PlayMultiLeds(LED_Anim_Num_Complete);	
	if(PlayfieldAnimation && PF_AnimNumComplete!=-1)playfieldAnimation.PlayAnimationNumber(PF_AnimNumComplete);
	if(sfx_Complete){sound_.clip = sfx_Complete;sound_.Play();}
}
function Play_LedAnim_ObjAnim_LCDAnim_Fail(){
	if(LCD_AnimNumFail != -1 && obj_Anim_On_Led_Display.length > LCD_AnimNumFail)										// Play animation if an animation is affected
		Play_LCD_Screen_Animation(LCD_AnimNumFail); 
	if(LED_Anim_Num_Fail!=-1)gameManager.PlayMultiLeds(LED_Anim_Num_Fail);	
	if(PlayfieldAnimation && PF_AnimNumFail!=-1)playfieldAnimation.PlayAnimationNumber(PF_AnimNumFail);
	if(sfx_Fail){sound_.clip = sfx_Fail;sound_.Play();}
}


function F_InputGetButton(){														// use Edit -> Project Settings -> Input for Flippers
	_GetButton = true;
}
