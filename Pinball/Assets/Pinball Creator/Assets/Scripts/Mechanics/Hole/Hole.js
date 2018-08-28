// Hole.js : Description : Manage table mechanic. When a ball enter on collision with this object this ball is respawn to an other position.
// 1) It is possible to choose the time before the ball go to the respawn point.
// 2) It is possible to choose the time before adding a force to the ball.
// 3) It is possible to choose the direction of the ball when a force is added. The direction is chosen by the direction of ''Spawn'' gameObject (vecteur Forward ''z'').
// 4) If you want to create kickback it is possible. See the prefab Kickback on Project folder.
#pragma strict
@Header ("Choose a unique ID")
var index						: int;								// Choose an index. Used to be recognized by a mission.
@Header ("Connect here the mission that use this object")
var Parent_Manager				: GameObject[];						// Connect here the missions that used this object.
var functionToCall				: String = "Counter";				// Call a function when OnCollisionEnter -> true;

private var rb 					: Rigidbody;						// Access to the rigidbody of this object

@Header ("Time Before the ball go to the respawn position")
var Part_1_TimeToRespawn		: float = 2;						// Time Before the ball go to the respawn position
private var tmp_Time 			: float = 0;					
private var b_Part_1 			: boolean = true;

@Header ("Time Before a force is added to the ball")
var Part_2_TimeBeforeAddingForce: float = 0;						// Time to wait before adding force to the ball after the respawn			
private var tmp_Time_2 			: float = 0;
private var b_Part_2 			: boolean = true;
@Header ("Force you want to add")
var Explosion_force 			: float = 5;						// Force added to the ball
var randomForce					: float = 0;			
@Header ("Position when ball respawn. Default : below the hole")
var RespawnDir					: Vector3 = Vector3(0,-1,0);		// position relative to the object Spawn
@Header ("add a led")										
var obj_Led						: GameObject;						// It is possible to add a led. Usefull for kickback
private var led_Renderer 		: ChangeSpriteRenderer;

@Header ("Kickback")
var Mission_Kickback			: boolean = false;					// use to create a kickback mission if true
var KickbackLedAnimation		: int = 0;							// Choose Led ANimation if it's a kickback mission
@Header ("Door for Kickback")
var obj_Target					: GameObject;						// Add a drop target here 
private var target		 		: Target;
@Header ("The time until the door closes")
var Part_3_TimeBeforeActivateObjTarget: float = .5;					// Time to wait before Activate obj_Target			
private var tmp_Time_3 			: float = 0;					
private var b_Part_3 			: boolean = true;

private var Spawn 				: Transform;						// Use to know where to spawn the ball
private var tmp_Ball 			: GameObject;

@Header ("Sound Fx")
var Sfx_Load_Ball				: AudioClip;						// Play when the ball enter the hole
var Sfx_Ball_Respawn			: AudioClip;						// Play when the ball respawn
var Sfx_Shoot_Ball				: AudioClip;						// Play when force is added to the ball
private var sound_				: AudioSource;						// Access AudioSource component 

@Header ("Points added when the ball enter the hole")
var Points						: int = 0;							// Points when the object is hitting 
private var obj_Game_Manager	: GameObject;						// 
private var gameManager			: Manager_Game;						// access to the script Manager_Game.js on gameObject Manager_Game on the hierarchy
@Header ("Toy connected to the bumper")
var Toy_Enter					: GameObject;						// Connect a toy or particule system
private var toyEnter			: Toys;
var AnimNunEnter				: int = 0;							// Choose the animation you want to play
var Toy_Exit					: GameObject;
private var toyExit				: Toys;								// Connect a toy or particule system
var AnimNunExit					: int = 0;							// Choose the animation you want to play

private var Box_Col				: BoxCollider; 

private var Pause 				: boolean = false;

function Start(){																			// --> Function Start
	Box_Col = GetComponent.<BoxCollider>();
	sound_ = GetComponent.<AudioSource>();													// Access AudioSource component 
	obj_Game_Manager = GameObject.Find("Manager_Game");										// Find Manager_Game gameObject
	if(obj_Game_Manager!=null)
	gameManager = obj_Game_Manager.GetComponent.<Manager_Game>();							// access to the script Manager_Game.js on gameObject Manager_Game on the hierarchy

	if(obj_Led)led_Renderer = obj_Led.GetComponent.<ChangeSpriteRenderer>();				// obj_Led != null Access ChangeSpriteRenderer component 
	if(obj_Target)target = obj_Target.GetComponent.<Target>();								// obj_Target != null Access Target component 

	var tmp = this.GetComponentsInChildren.<Transform>();									// Find Spawn Transform. WARNING Don't move spawn gameObject outside the Hole GameObject.
	for (var child : Transform in tmp) {
		if (child.name == "Spawn_Hole"){Spawn = child;}
	}
	if(Toy_Enter)toyEnter = Toy_Enter.GetComponent.<Toys>();								// Access component Toys from Toy_Enter
	if(Toy_Exit)toyExit = Toy_Exit.GetComponent.<Toys>();									// Access component Toys from Toy_Exit 
}

function OnCollisionEnter(collision: Collision) {											// --> OnCollisionEnter
	if(collision.transform.tag == "Ball" && rb == null){									//	OnCollisionEnter with a ball and There is no ball in the hole actualy
			if(Mission_Kickback){
				Box_Col.isTrigger = true;
				if(obj_Game_Manager!=null)
				gameManager.PlayMultiLeds(KickbackLedAnimation);							// Choose Led ANimation if it's a kickback mission
			}
			tmp_Ball = collision.gameObject;													

			rb = tmp_Ball.GetComponent.<Rigidbody>();
			rb.isKinematic = true;																// rb become kinematic
			rb.position = transform.position;
			rb.rotation = Quaternion.identity;
															
			if(!sound_.isPlaying && Sfx_Load_Ball)sound_.PlayOneShot(Sfx_Load_Ball);		// Play sound : Sfx_Load_Ball

			b_Part_1 = false;																	// start the first phase
			if(obj_Led)led_Renderer.F_ChangeSprite_Off();										// switch off the led					

			if(Parent_Manager.length > 0){											
				for(var j : int = 0;j<Parent_Manager.length;j++){
					Parent_Manager[j].SendMessage(functionToCall,index);						// Call Parents Mission script
				}
			}
			if(obj_Game_Manager!=null){
				gameManager.F_Mode_BONUS_Counter();													// Add +1 to the Bonus counter. Manage by the Manager_Game game object on the hierarchy
				gameManager.Add_Score(Points);														// Add points. Manage by the Manager_Game game object on the hierarchy
			}
			if(Toy_Enter)toyEnter.PlayAnimationNumber(AnimNunEnter);							// Play Toy if connected
			tmp_Ball.GetComponent.<Ball>().OnHole();											// The ball is in the hole
	}
}

function Update(){	
	if(!Pause){																					// --> Update function
		if(!b_Part_1){																			// Part 1 : Part Before the ball go to the respawn position
			if(!Mission_Kickback){
			tmp_Ball.transform.position = 														// the ball disappears into the ground
				Vector3.MoveTowards(tmp_Ball.transform.position,
				transform.position + Vector3.down * .023 ,Time.deltaTime*0.4);
			}

			if(tmp_Ball.transform.position == transform.position + Vector3.down * .023 || Mission_Kickback){			// The ball has disappeared
				tmp_Time = Mathf.MoveTowards(tmp_Time,Part_1_TimeToRespawn,						
					Time.deltaTime);
				if(tmp_Time == Part_1_TimeToRespawn){											// Wait for Part_1_TimeToRespawn
					tmp_Time = 0;
					b_Part_1 = true;
					b_Part_2 = false;															// Start Part 2
					if(!Mission_Kickback){														// if it's not a kickback mission
						tmp_Ball.transform.position = Spawn.position + RespawnDir * .023;		// the ball go to his spawn position
						rb.velocity  = Vector3(0,0,0);											
						if(Sfx_Ball_Respawn)sound_.PlayOneShot(Sfx_Ball_Respawn);				// play a sound : Sfx_Ball_Respawn
					}
				}
			}
		}

		if(!b_Part_2){																			// Part 1 : Part before adding force to the ball after the respawn
			tmp_Ball.transform.position 												
				= Vector3.MoveTowards(tmp_Ball.transform.position,
			Spawn.position, Time.deltaTime*0.4);	

			if(tmp_Ball.transform.position == Spawn.position){									// the ball appears into the ground
				tmp_Time_2 = Mathf.MoveTowards(tmp_Time_2,										
				Part_2_TimeBeforeAddingForce,Time.deltaTime);

				if(tmp_Time_2 == Part_2_TimeBeforeAddingForce){									// Wait for Part_2_TimeBeforeAddingForce
					tmp_Time_2 = 0;
					b_Part_2 = true;
					Ball_AddForceExplosion();													// Add a force to the ball
					if(Mission_Kickback)b_Part_3 = false;										// if it is kickback mission start Part 3
				}
			}
		}

		if(!b_Part_3){																			// Time to wait before you close the door
			tmp_Time_3 = Mathf.MoveTowards(tmp_Time_3,Part_3_TimeBeforeActivateObjTarget,
				Time.deltaTime);
			if(tmp_Time_3 == Part_3_TimeBeforeActivateObjTarget){								// Wait for Part_3_TimeBeforeActivateObjTarget			
				tmp_Time_3 = 0;
				b_Part_3 = true;
				if(obj_Target)target.Activate_Object();											// Close the door
				if(Mission_Kickback)Box_Col.isTrigger = false;
			}
		}
	}
}

function Ball_AddForceExplosion(){															// --> function to add a force to the ball
	rb.isKinematic = false;																	// 
	var tmp_randomForce : float = Random.Range(0,randomForce);
	rb.AddForce(Spawn.transform.forward*(Explosion_force+tmp_randomForce), ForceMode.VelocityChange);			// add a force
	rb = null;																				// A new ball could enter to the hole
	if(Explosion_force>0){																	// if a force is added to the ball 
		if(Sfx_Shoot_Ball)sound_.PlayOneShot(Sfx_Shoot_Ball);								// play a sound : Sfx_Shoot_Ball
	}
	if(Toy_Exit)toyExit.PlayAnimationNumber(AnimNunExit);									// Play Toy if connected
	tmp_Ball.GetComponent.<Ball>().OutsideHole();											// The ball is not in the hole
}

function index_info(){																		// return the index of the Hole. Use by the mission
	return index;
}

function F_Pause(){																			// Pause the hole
if(!Pause)Pause = true;
else Pause = false;
}

function initHole(){																		// Use by Game_Manager function InitGame_GoToMainMenu()
b_Part_1 = true;
b_Part_2 = true;
b_Part_3 = true;
rb = null;
}