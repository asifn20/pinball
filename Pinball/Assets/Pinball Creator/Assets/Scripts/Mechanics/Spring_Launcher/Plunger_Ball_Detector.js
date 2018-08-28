// Plunger_Ball_Detector.js : Description : Use to know if a ball is on the launcher
var obj_Spring 			: GameObject;
var spring_Launcher		: Spring_Launcher;
var rb_Ball 			: Rigidbody;

var Ball_Collision 		: boolean = false;

function Start(){
	spring_Launcher = obj_Spring.GetComponent.<Spring_Launcher>();
}

function OnCollisionStay(collision: Collision) {					// Ball is on the launcher
	if(collision.transform.tag == "Ball"){
		rb_Ball = collision.transform.GetComponent.<Rigidbody>();
		spring_Launcher.BallOnPlunger(rb_Ball);
		Ball_Collision = true;
	}
}


function OnCollisionExit(collision: Collision){						// Ball exit the launcher
	if(collision.transform.tag == "Ball"){
		//Debug.Log(collision.transform.name);
		rb_Ball = null;
		spring_Launcher.BallOnPlunger(rb_Ball);
		Ball_Collision = false;
	}
}


function ReturnCollision(){
	return Ball_Collision;
}