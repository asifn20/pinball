// Anim_On_LCD.js : Description : Manage Animation you could put on LCD Screen. Play Pause and destroy gameObject. 
#pragma downcast 

private var obj_Manager : GameObject;		
private	var anim		: Animator;


function Start(){
	anim = GetComponent.<Animator>();
}

function DestoyAnimGameobject () {				// Destroy animation
	Destroy (gameObject);
}

function Pause_Anim(){							// Pause animation
   	if(anim.speed==0)Stop_Pause_Anim();
   	else Start_Pause_Anim();  
}

function Stop_Pause_Anim(){						// Stop
	anim.speed = 1;
}
function Start_Pause_Anim(){					// Start
	anim.speed = 0;
}

function PlayAnimation () {}

function StopAnimation(){}

function Mission_End_Fail(){
	obj_Manager.SendMessage("Mission_Fail");
}

function MissionStartLCDMobile(){
	var obj_LCDMobile : GameObject = GameObject.Find("LCD_Content");
	if(obj_LCDMobile)this.transform.SetParent(obj_LCDMobile.transform);
}