// Manager_Led_Animation : Description : 
#pragma strict
import System;
import System.Collections.Generic;

private var obj_Game_Manager	: GameObject;
private var gameManager			: Manager_Game;

var obj_Led 					: GameObject[];
private var Led_Renderer 		: ChangeSpriteRenderer[];

class List_Led_Pattern
{
     var pattern : String[];
}
var list_Led_Pattern 			: List_Led_Pattern[] = new List_Led_Pattern[1];

private var Led_Anim_isPlaying 	: boolean = false;
var timeBetweenTwoLight 		: float = .1;
private var Timer				: float;
private var target				: float = 0;
private var count				: int = 0;
private var tmp_Last_State		: String;  
private var isPlaying_Pattern	: int;
@Header ("Led Animation associated with a mission")	
var b_Mission 					: boolean = true;				// If it is a mission = true	//
@Header ("Led Animation associated with a Group_Led")	
var b_Leds_Grp 					: boolean = false;				// If it is a animation = true // 
@Header ("Led Animation associated only with the Group_Leds_Missions")	
var b_Mission_Leds_Grp 			: boolean = false;				// Use only for the led animation that indicate if missions are complete or not
@Header ("Led Animation associated only with Mission Led_Mission_InProgress and Led_Part1_InProgress")	
var b_Mission_Leds_Mission_Part : boolean = false;		
@Header ("Led Animation associated only with the Group_Leds_ExtraBall_BallSaver")	
var b_extraBall_or_BallSaver 	: boolean = false;				// Special condition for extraBall and BallSaver Leds. ExtraBall and ballSaver are manage by the Manager_Game.js script
@Header ("Led Animation associated only with the Group_Leds_Multiplier")	
var b_Multiplier 				: boolean = false;				// Special condition for Multiplier. Multipiler is manage by the Manager_Game.js script


private var b_Pause 			: boolean = false; 
private var TimeScale					: float;

function Start () {
	if (obj_Game_Manager == null)																		// Connection with the gameObject : "Manager_Game"
		obj_Game_Manager = GameObject.Find("Manager_Game");

	if(obj_Game_Manager!=null)
	gameManager = obj_Game_Manager.GetComponent.<Manager_Game>();	

	TimeScale = Time.timeScale;
	target += timeBetweenTwoLight*TimeScale;
}

function Update () {
	//if(Input.GetKeyDown("t")){Play_New_Pattern(2);}

	if(Led_Anim_isPlaying && !b_Pause){
		Timer = Mathf.MoveTowards(Timer,target,Time.deltaTime);
		if(Timer == target && count < list_Led_Pattern[isPlaying_Pattern].pattern.length){				// PLay anmtion Pattern : If pause game the animation could be paused
			Animation_Leds(isPlaying_Pattern);
			count ++;
			target += timeBetweenTwoLight*TimeScale;
		}
		if(count == list_Led_Pattern[isPlaying_Pattern].pattern.length){								// Play the last element of the pattern
			if(Timer == target){
				count ++;
			}
			if(count == (list_Led_Pattern[isPlaying_Pattern].pattern.length+1)){						// Init Animation
				//Debug.Log("End of the animation : " + this.name);
				if(obj_Game_Manager!=null)gameManager.checkGlobalAnimationEnded();
				count = 0;target = 0;Timer = 0;Led_Anim_isPlaying = false;								// Init script
				if(b_Mission /*&& !loop*/){
					SendMessage("Init_Leds_State");														// Init Led Object with the mission's scripts
				}
				else if(b_extraBall_or_BallSaver && obj_Game_Manager!=null){														// Special Condition to initialize the BallSaver and Extraball leds after a pattern. 	
					if(gameManager.b_ExtraBall)Led_Renderer[0].F_ChangeSprite_On();						// We check BallSaver and ExtraBall states directly from Manager_Game.js script
					else Led_Renderer[0].F_ChangeSprite_Off();											

					if(gameManager.b_Ball_Saver && obj_Game_Manager!=null)Led_Renderer[1].F_ChangeSprite_On();
					else Led_Renderer[1].F_ChangeSprite_Off();
				}
				else if(b_Multiplier){	
					init_Multiplier_Leds();																// Special Condition to initialize the Multiplier leds  
				}
				else if(b_Leds_Grp){
					for(var j : int = 0;j<obj_Led.length;j++){
						
						//Led_Renderer[j].F_ChangeSprite_Off();											// Switch off the leds
					}
				}
				else if(b_Mission_Leds_Grp){
					for(j = 0;j<obj_Led.length;j++){
						if(Led_Renderer[j].Led_Mission_State())
							Led_Renderer[j].F_ChangeSprite_On();										// Switch on the leds
						else
							Led_Renderer[j].F_ChangeSprite_Off();										// Switch off the leds	
					}
				}
				else if(b_Mission_Leds_Mission_Part){
					for(j = 0;j<obj_Led.length;j++){
						if(Led_Renderer[j].F_led_Part_InProgress_State() == 1)
							Led_Renderer[j].F_ChangeSprite_On();										// Switch on the leds
						else
							Led_Renderer[j].F_ChangeSprite_Off();										// Switch off the leds	
					}
				}


				for(var i : int = 0;i<obj_Led.length;i++){
					Led_Renderer[i].F_On_Blink_Switch();												// Start Blinking the light
				}

			}
		}


	}
}

function Animation_Leds(num : int){
	Led_Anim_isPlaying = false;
	isPlaying_Pattern = num;

   	for(var j : int = 0;j< obj_Led.length;j++){
   		var tmp = list_Led_Pattern[num].pattern[count][j];
   		if(tmp == "1")
   			Led_Renderer[j].F_ChangeSprite_On();
    	else
    		Led_Renderer[j].F_ChangeSprite_Off();
   	}
    Led_Anim_isPlaying = true;
}




function Play_New_Pattern(num : int){														// CALL THIS FUNCTION TO PLAY A NEW PATTERN
	if(!b_Pause){
		for(var i : int = 0;i<obj_Led.length;i++){
			Led_Renderer[i].F_Off_Blink_Switch();												// Stop Blinking each light
		}

		count = 0;target = 0;Timer = 0;Led_Anim_isPlaying = false;	
		Animation_Leds(num);
	}
}


function Pause_Anim(){
	if(!b_Pause)Start_Pause_Anim();
	else Stop_Pause_Anim();
}

function Stop_Pause_Anim(){b_Pause=false;}
function Start_Pause_Anim(){b_Pause=true;}

function Init_Obj_Led_Animation(tmp_obj_Led : GameObject[]){
	if(obj_Led.length == 0){
		obj_Led = new GameObject[tmp_obj_Led.length];
		obj_Led = tmp_obj_Led;
	}

	Led_Renderer = new ChangeSpriteRenderer[obj_Led.length];
	for(var k : int = 0;k<obj_Led.length;k++){
		if(obj_Led[k] != null)Led_Renderer[k] = obj_Led[k].GetComponent.<ChangeSpriteRenderer>();		
	}


	if(list_Led_Pattern[0].pattern.length == 0){
		list_Led_Pattern[0].pattern = new String[obj_Led.length*2+1];

		for(var j : int = 0;j< obj_Led.length*2+1;j++){
			var temp_string : String; 
			for(var i : int = 0;i< obj_Led.length;i++){
				if(j< obj_Led.length*2){
					if(j%obj_Led.length == i)
						temp_string += "1";
					else
						temp_string += "0";
				}
				else{
					temp_string += "0";
				}
			}
			list_Led_Pattern[0].pattern[j] = temp_string;
   		}

	}
}


function init_Multiplier_Leds(){																		// Special Condition to initialize the Multiplier leds  
	if(obj_Game_Manager!=null){
		var tmp_multi : int = gameManager.multiplier;														// We check Multiplier states directly from Manager_Game.js script 
		tmp_multi = tmp_multi*.5;
		if(tmp_multi < 1){																					// multiplier = 1 so all the leds are switch off
			for(var i : int = 0;i< obj_Led.length;i++){
				Led_Renderer[i].F_ChangeSprite_Off();	
			}
		}
		else{
			for(var j : int = 0;j < obj_Led.length;j++){													// if multiplier is greater than 1 
				if(j < tmp_multi)																			// if tmp_multi = 1, switch on the first led, tmp_multi = 2, switch on the first two leds ...,
					Led_Renderer[j].F_ChangeSprite_On();	
				else
					Led_Renderer[j].F_ChangeSprite_Off();	
			}
		}
	}
}

function HowManyAnimation(){
return list_Led_Pattern.length;
}																												