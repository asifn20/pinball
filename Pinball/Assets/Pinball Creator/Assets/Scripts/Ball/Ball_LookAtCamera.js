// Ball_LookAtCamera : Description : Use to create a fake light effect on the ball for mobile version
#pragma strict
var target 	: GameObject;

function Start () {
	target = GameObject.FindWithTag("MainCamera");		// Find Main camera on the hierarchy
}

function Update () {
	if(target)transform.LookAt(target.transform);				// This gameObject look at the camera
}