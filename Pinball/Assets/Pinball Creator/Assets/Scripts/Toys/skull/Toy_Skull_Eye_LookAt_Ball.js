// Toy_Skull_Eye_LookAt_Ball.js : Descripton : Skull eyes follow the ball
#pragma strict


var pos_X : boolean = true;
var pos_Y : boolean = true;
var pos_Z : boolean = true;

var Ball : Transform;
private var Ball_Speed : float;

var b_follow : boolean = true;

var target_Fixed : Transform;

function Update () {
	if(b_follow){
		if(Ball != null && Ball.transform.localPosition.z < -13.3){		// Look at ball depending the ball position
			transform.LookAt(Ball);
		}
		else{
			var targetObj = GameObject.FindGameObjectWithTag("Ball");
			if(targetObj != null){
				Ball = targetObj.transform;
			}
		}
	}
	else{
		transform.LookAt(target_Fixed);
	}

}
