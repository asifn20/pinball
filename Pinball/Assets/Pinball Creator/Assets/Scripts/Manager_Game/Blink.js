// Blink : Description : Make the Led you want blinking . 
// Blink.js allows to keep synchronyzed Leds on the playfield.

// How it work : On the Inspector, check the box "B_Blinking" on every Led you want to blink. 
// Then when game start this script (Blink.js) automaticaly connects all the leds with B_Blinking = true; 
#pragma strict

var Blink_Time_ms 					: float = .2;											// You could choose the blinking time
private var Timer 					: float = 0;											// variable used to create a timer on the update function														
private var target 					: float = 0;											// variable used to create a timer on the update function	

private var changeSpriteRenderer	: ChangeSpriteRenderer[];								// Used to access ChangeSpriteRenderer components from each Led object
private var b_Blink 				: boolean = false;										// true if changeSpriteRenderer.length>0

private var TimeScale				: float;												// used to access Time.timeScale;	

var b_Pause_Blinking 				: boolean = false;										// Used when the game is on pause : Pause_Game.


function Start () {
	TimeScale = Time.timeScale;																
	Blink_Time_ms *= TimeScale;																//  a second stay a second even if you change Time.timeScale


	var gos = GameObject.FindGameObjectsWithTag("Blink"); 									// find the leds with the tag "Blink" that should blink
	changeSpriteRenderer = new ChangeSpriteRenderer[gos.length];
	var tmp_count : int = 0;
	for (var go : GameObject in gos)  { 	
		changeSpriteRenderer[tmp_count] = go.GetComponent.<ChangeSpriteRenderer>();			// accessing ChangeSpriteRenderer components from each Led object
		tmp_count++;
	}

	if(changeSpriteRenderer.length > 0)b_Blink = true;
}



function Update () {
	if(b_Blink && !b_Pause_Blinking){
		Timer = Mathf.MoveTowards(Timer,target,Time.deltaTime);								// Here the timer to know if the leds must be On or Off
		if(Timer == target && Blink_Time_ms == target){										// On : 
			for(var i : int =0; i<changeSpriteRenderer.length; i++){
				changeSpriteRenderer[i].F_ChangeSprite_On_Blink();							// Led On
			}
			target = 0;
		}
		else if(Timer == target && 0 == target){											// Off : 
			target = Blink_Time_ms;
			for(var j : int =0; j<changeSpriteRenderer.length; j++){
				changeSpriteRenderer[j].F_ChangeSprite_Off_Blink();							// Led Off
			}
		}
	}
}



function Pause_Blinking(){																	// This function is called by Manager_Game.js (line 355) when you want to pause the game
	if(b_Pause_Blinking) b_Pause_Blinking = false;											// Pause stop
	else b_Pause_Blinking = true;															// Pause start
}