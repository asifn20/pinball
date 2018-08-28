// Gate.js : Description : Manage Gate mechanic : 
#pragma strict

var b_Trigger_Open 	: boolean = true;	// True if it is the trigger that open the gate. False if it is the trigger that close the door

var obj_Gate		: GameObject;		// COnnect the gate
private var target	: Target;			// 


function Start () {								
	target = obj_Gate.GetComponent.<Target>();	// Access Target compenent
}

function OnTriggerEnter (other : Collider) {	// -> On trigger Enter
	if(other.transform.tag == "Ball"){			// If it is a ball
		if(b_Trigger_Open){						// If it is the trigger taht open the gate
			target.Desactivate_Object();
		}
		else{									// if it the trigger that close the gate
			target.Activate_Object();
		}
	}
}
