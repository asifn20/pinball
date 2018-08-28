// MutilBall.js : Description : This script manage how to eject ball when Mutli ball is activated. 
#pragma strict

var index				: int;
var obj_Game_Manager	: GameObject;
private var gameManager	: Manager_Game;
var Gestionnaire_Parent	: GameObject[];
var functionToCall		: String = "Counter";			// Call a function when OnCollisionEnter -> true;

var Spawn 				: Transform;
var Spawn_tmp 			: Transform;
var tmp_Ball 			: GameObject;

var s_Load_Ball			: AudioClip;
var s_Shoot_Ball		: AudioClip;
private var source		: AudioSource;
var rb : Rigidbody;

var Time_Part_1 		: float = 2;					// Respawn Timer 
private var tmp_Time 	: float = 0;
private var b_Part_1 	: boolean = true;

var Slingshot_force 	: float = 4;

var Time_Part_2 		: float = 0;					// Time to wait before adding force to the ball after the respawn			
private var tmp_Time_2 	: float = 0;
private var b_Part_2 	: boolean = true;

var Kickback			: boolean = false;

var obj_Door			: GameObject;

var Time_Part_3 		: float = .5;					// Time to wait before adding force to the ball after the respawn			
private var tmp_Time_3 	: float = 0;
private var b_Part_3 	: boolean = true;

var obj_Led				: GameObject;

var ball_Number			: int = 3;
var counter				: int = 0;
private var Box			: BoxCollider;

private var Pause 		: boolean = false;
private var pivotCam 	: CameraSmoothFollow;			// access component CameraSmoothFollow. Use to avoid that the camera move too harshly when the ball respawn on the plunger  



function Start(){
	Box = GetComponent.<BoxCollider>();
	source = GetComponent.<AudioSource>();
	if (obj_Game_Manager == null)														// Connect the Mission to the gameObject : "Manager_Game"
		obj_Game_Manager = GameObject.Find("Manager_Game");
	if (obj_Game_Manager != null)
	gameManager = obj_Game_Manager.GetComponent.<Manager_Game>();	

	var tmp : GameObject  = GameObject.Find("Pivot_Cam");
	if(tmp)pivotCam = tmp.GetComponent.<CameraSmoothFollow>();	// Access Component CameraSmoothFollow from the main camera
}

function OnCollisionEnter(collision: Collision) {	
	if(collision.transform.tag == "Ball"){
		tmp_Ball = collision.gameObject;
		rb = tmp_Ball.GetComponent.<Rigidbody>();
		if(!Kickback){
			rb.isKinematic = true;
			tmp_Ball.transform.position = Spawn.position;
		}
		b_Part_1 = false;
		if(obj_Led)obj_Led.GetComponent(ChangeSpriteRenderer).F_ChangeSprite_Off();

		if(Gestionnaire_Parent.length > 0){
			for(var j : int = 0;j<Gestionnaire_Parent.length;j++){
				Gestionnaire_Parent[j].SendMessage(functionToCall,index);			// Call Parents Mission script
			}
		}
	}
}

function Update(){
	if(!Pause){
		if(!b_Part_1){													// Respawn Timer 
			tmp_Time = Mathf.MoveTowards(tmp_Time,Time_Part_1,
				Time.deltaTime);
			if(tmp_Time == Time_Part_1){								
				tmp_Time = 0;
				b_Part_1 = true;
				b_Part_2 = false;
				if(!Kickback)
					Ball_Respawn();
			}
		}

		if(!b_Part_2){													// Time to wait before adding force to the ball after the respawn
			tmp_Time_2 = Mathf.MoveTowards(tmp_Time_2,Time_Part_2,
				Time.deltaTime);
			if(tmp_Time_2 == Time_Part_2){						
				tmp_Time_2 = 0;
				b_Part_2 = true;
				Ball_AddForceExplosion();
			}
		}
	}
}

function Ball_Respawn(){
	
	rb.velocity  = Vector3(0,0,0);	
	tmp_Ball.transform.position = Spawn.position;
	rb.isKinematic = false;
}

function Ball_AddForceExplosion(){
	rb.AddForce(Spawn.transform.forward*Slingshot_force, ForceMode.VelocityChange);	
	if(Slingshot_force>0){
		source.clip = s_Shoot_Ball;
		source.Play();
	}
	if(pivotCam)pivotCam.ChangeSmoothTimeInit();			// Call CameraSmoothFollow.js
}

function KickBack_MultiOnOff(){
	if(Box.isTrigger) Box.isTrigger= false;
	else Box.isTrigger = true;
}

function F_Pause(){
if(!Pause)Pause = true;
else Pause = false;
}


function initHole(){		// Use by Game_Manager function InitGame_GoToMainMenu()
b_Part_1 = true;
b_Part_2 = true;
Box.isTrigger = true;
rb = null;
}