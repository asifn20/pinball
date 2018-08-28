// ChangeSpriteRenderer : Description : Used to change the renderer of a led
#pragma strict
var On									: boolean = false;
var b_Blinking							: boolean = false;

private var rend						: Renderer;

private var Timer 						: float = 0;				// Variable used when you call Function Led_On_With_Timer(value : float
private var tmp_Time 					: float = 0;
private var b_Led_On_With_Timer			: boolean = true;


@Header ("Led Emission")
var Emission_Off_						: Color = Color(0,0,0);
var Emission_On							: Color = Color(1,1,1);


@Header ("Connect point Light to Led")	
var obj_Light 							: Light;
private var lightComp					: Light;

private var b_Led_Mission				: boolean = false;			// Use to know the state of Mission's leds.
private var b_Led_Part_InProgress		: int = 0;			// Use to know the state of Mission Led_Part1_InProgress.

private var ledSwitchOff 				: LedSwitchOff;			// Use For Slingshot and bumper to switch of the light.Call LedSwitchOff.js on the same gameObject


function Awake(){
	if(b_Blinking)this.transform.tag = "Blink"; 					// this tag is use by the script Blink.js on Manager_Game on the hierachy. 
}
	
function Start(){													// --> Init Led

	ledSwitchOff = GetComponent.<LedSwitchOff>(); 

	rend = GetComponent.<Renderer>();								// access component

	if(obj_Light)lightComp = obj_Light.GetComponent.<Light>();		// access component

	if(On){	
		if(obj_Light)lightComp.enabled = true;
			rend.material.SetColor ("_EmissionColor",Emission_On);
		}
		else {
			if(obj_Light)lightComp.enabled = false;
			rend.material.SetColor ("_EmissionColor",Emission_Off_);
		}
}



function F_ChangeSprite_On() {										//--> Switch On the led
		On = true;
		if(obj_Light)lightComp.enabled = true;
		rend.material.SetColor ("_EmissionColor",Emission_On);
}

function F_ChangeSprite_Off() {										//--> Switch Off the led
		On = false;
		if(obj_Light)lightComp.enabled = false;
		rend.material.SetColor ("_EmissionColor",Emission_Off_);
}


function F_ChangeSprite_On_Blink() {								// --> Led Blinking
	if(On && b_Blinking){
		if(obj_Light)lightComp.enabled = true;
		rend.material.SetColor ("_EmissionColor",Emission_On);
	}
}
	
function F_ChangeSprite_Off_Blink() {								// --> Led Blinking
	if(On && b_Blinking){
		if(obj_Light)lightComp.enabled = false;
		rend.material.SetColor ("_EmissionColor",Emission_Off_);
	}
}

function F_On_or_Off(){return On;}									// return if led is switch On or off

function F_On_Blink_Switch(){b_Blinking = true;}					//	used in Manager_Led_Animation become you don't want the light blinking when we play a Led animation pattern
	
function F_Off_Blink_Switch(){b_Blinking = false;}					//	used in Manager_Led_Animation become you don't want the light blinking when we play a Led animation pattern
	


function Led_On_With_Timer(value : float){							// Function call to enable the led during a few time
	Timer = value;													// Init the timer
	if(ledSwitchOff != null)
		ledSwitchOff.Timer_Led();
	else
		b_Led_On_With_Timer = false;									// Start the timer

	F_ChangeSprite_On();											// Switch On the led

}

function Led_Mission_Complete(switch_ : String){					// This function is only called by a mission after the player lose a ball. If the mission is complete the led will be switch On
	if(switch_ == "On"){
		F_ChangeSprite_On();
		b_Led_Mission = true;										// Use to know the state of Mission's leds. The mission corresponding to this led is complete.
	}
	else{
		F_ChangeSprite_Off();
		b_Led_Mission = false;										// Use to know the state of Mission's leds. The mission corresponding to this led is not complete.
	}
}

function Led_Mission_State(){										// Call by the script Manager_Led_Animation.js
	return b_Led_Mission;
}

function led_Part_InProgress_State(value : int){
	b_Led_Part_InProgress = value;
}

function F_led_Part_InProgress_State(){
	return b_Led_Part_InProgress;
}