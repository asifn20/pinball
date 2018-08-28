// Manager_Grp_Leds.js : Description : Init a group of leds
#pragma strict

var obj_Led 					: GameObject[];		// Connect Leds you want on this group

function Start () {									// --> Init
	GetComponent.<Manager_Led_Animation>().Init_Obj_Led_Animation(obj_Led);	// Init Script Manager_Led_Animation.js
}


