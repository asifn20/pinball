// Spinner_Trigger : Description : Use to know the direction of the ball
#pragma strict

var obj_Spinner 				: GameObject;							// Connect to the object spinner in the hierachy
private var spinner				: Spinner_Rotation;						// Access component
private var dir					: int = 0;								// Know the direction of the ball



function Start () {
	spinner = obj_Spinner.GetComponent.<Spinner_Rotation>();			// access component
}

function OnTriggerEnter (other : Collider) {							// When the ball enter the trigger
	if(other.transform.tag == "Ball"){
		var rb : Rigidbody = other.GetComponent.<Rigidbody>();		
		spinner.Spin(rb.velocity.magnitude*dir);						// Send the velocity and the direction of the ball
	}
}


function FixedUpdate(){													// Save the direction of the ball
	var fwd = transform.InverseTransformDirection (Vector3.forward);
	var hit : RaycastHit;
	if (Physics.Raycast (transform.position, fwd , hit, 10) &&  hit.transform.tag == "Ball") {
		dir = 1;
	}
	else if (Physics.Raycast (transform.position, -fwd , hit, 10) &&  hit.transform.tag == "Ball") {
		dir = -1;
	}
}