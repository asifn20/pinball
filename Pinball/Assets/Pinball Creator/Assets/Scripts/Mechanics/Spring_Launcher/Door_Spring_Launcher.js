// Door_Spring_Launcher.js : Description : Open and lock the door to the spring launcher
#pragma strict

var obj_Door 		: GameObject;
var b_Exit			: boolean = true;

function OnTriggerExit (other : Collider) {						// Function use by the Door_Exit object;
	if(other.tag == "Ball" && b_Exit){							// Lock the door
		transform.localPosition.y = 0;
		GetComponent.<Collider>().isTrigger = false;			
	}
}

function OnTriggerEnter (other : Collider) {					// Function used by Object "Anti_Bug" if the ball go back to the spring launcher
	if(other.tag == "Ball" && !b_Exit){							// Open the door
		obj_Door.transform.localPosition.y = -1;				
		obj_Door.GetComponent.<Collider>().isTrigger = true;
	}
}


