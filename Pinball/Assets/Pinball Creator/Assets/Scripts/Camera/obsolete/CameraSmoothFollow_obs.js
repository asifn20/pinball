// CameraSmoothFollow.js : Description : script on object named Pivot_Cam on the hierarchy. Manage Camera movement in association with Camera_Movement.js on Main Camera on the hierarchy
// 
#pragma strict

private var smoothTime 				: float= 10;			// value to make the camera movement smoothly
private var distance 				: float= 4; 			// distance between transform.position, tmp_Target.position

@Header ("Cam 1")											// --> Cam 1 move up and Down
var Target_Fixed_Cam_1				: Transform;			// the camera target when ball < Max_Pos_Y_Cam_1 value
var Target_Vertical_Cam_1			: Transform;			// the camera target when ball > Max_Pos_Y_Cam_1 value
var Max_Pos_Y_Cam_1					: float = 0.25;			// Max Movement for the camera. value between 0 to 1
var SpeedCam_1 						: float = 100;			// smooth mcamera movement  ref 50

@Header ("Cam 2")											// --> Cam 2 move forward and backward
var Target_Fixed_Cam_2				: Transform;			// the camera target when ball < Max_Pos_Y_Cam_2 value
var Target_Horizontal_Cam_2			: Transform;			// the camera target when ball > Max_Pos_Y_Cam_2 value
var Max_Pos_Y_Cam_2					: float = 0.75;			//  Max Movement for the camera. value between 0 to 1
var SpeedCam_2 						: float = 100;			// smooth mcamera movement ref 2

@Header ("Cam 3")											// --> Cam 3 is fixe 
var Target_Fixed_Cam_3				: Transform;			// Cam 3 : camera target 
var SpeedCam_3 						: float = 100;			// smooth mcamera movement ref 100
@Header ("Cam 4")											// --> Cam 4 is fixe 
var Target_Fixed_Cam_4				: Transform;			// Cam 4 : camera target
var SpeedCam_4 						: float = 100;			// smooth mcamera movement ref 100

@Header ("Plunger")											// --> Plunger Cam is fixe 
var Target_Plunger					: Transform;			// Plunger Cam target ref 100
var SpeedCam_Punger 				: float = 100;			// smooth mcamera movement


private var tmp_Target				: Transform;			// temporary target that camera must reach
private var Move_Camera				: boolean = false;		// know if the camera could move

@Header ("Object that follow the ball")
var obj_Follow_Ball					: GameObject;			// Object that follow the ball on scene
var Ball 							: Transform;			// Ball GameObject on scene

private var b_follow 				: boolean = true;		// if obj_Follow_Ball follow a ball on playfield
var InitPos							: Vector3;				// Position when b_follow = false
private var rb_obj_Follow_Ball		: Rigidbody;			// rigidbody for the obj_Follow_Ball
private var lastPosZ				: float;				// save obj_Follow_Ball.transform.position.z 
private var Up						: boolean = false;		// The ball goes to the back of the playfield


private var limit					: float = 10;			// obj_Follow_Ball.transform.localPosition.z > limit the camera follow the ball. use for Cam 1 and Cam 2
private var speed 					: float = 1;			// movement speed for the camera

private var Plunger_Activate 		: boolean = false;		// know if the ball is in the plunger		
private var Cam_Style 				: float = 0;			// 0 : Cam1 	1 : Cam2	4 : Cam3 and Cam4	5 : Cam Plunger		8 : Animation Cam when Game Start 

private var b_ChangeCamera_Position : boolean = false;		// Know if we are switching between two camera	
private var TargetPosY 				: float ;				// Y position that the camera must move forward
private var TargetPosZ 				: float ;				// Z position that the camera must move forward

// The next 3 vairables are used to move the camera to a new Camera position.
private var t 						: float;	
private var startPosition 			: Transform;			
private var target 					: Transform;

private var PlayerChangeTheCamera 	: boolean = false;		//	Know if the player change the camera view

private var T_Position 				: boolean = false;

private var b_PauseMode				: boolean = false;		// Use to pause camera movement


function Start(){
	rb_obj_Follow_Ball = GetComponent.<Rigidbody>();									// access rigidbody component						
}


function Update(){																		// --> UPDATE Function
	if(!b_PauseMode){																	// if The game is not on pause
		if(b_follow){																	// --> obj_Follow_Ball follow the ball on playfield
			if(Ball != null){															// IF there is a ball on playfield
				obj_Follow_Ball.transform.position.y = Ball.position.y;					// obj_Follow_Ball follow the ball
				obj_Follow_Ball.transform.position.z = Ball.position.z;
			}
			else{																		// ELSE. Check if there is ball on playfield
				var targetObj = GameObject.FindGameObjectWithTag("Ball");
				if(targetObj != null){													// if true
					Ball = targetObj.transform;
					if(Ball != null)													
						rb_obj_Follow_Ball = Ball.GetComponent.<Rigidbody>();			
				}
			}
		}
		else{																			// IF false. 
			obj_Follow_Ball.transform.position.y = InitPos.y;							// obj_Follow_Ball go to his init position
			obj_Follow_Ball.transform.position.z = InitPos.z;
		}

		if(Ball != null){
			if(lastPosZ > obj_Follow_Ball.transform.position.z){						// --> know if the ball is going to go down
				if(lastPosZ >= obj_Follow_Ball.transform.position.z + .1){				// ball is going to go down
					Up = false;
					lastPosZ = obj_Follow_Ball.transform.position.z;
				}
			}
			else{																		 // ball is going to go up
				Up = true;
				lastPosZ = obj_Follow_Ball.transform.position.z;
			}
		}

		Target_Vertical_Cam_1.transform.localPosition.y 								// Normalize Target_Vertical_Cam_1 Movement. Target_Vertical_Cam_1 follow obj_Follow_Ball
			= Max_Pos_Y_Cam_1*(obj_Follow_Ball.transform.localPosition.y - 0) /(2-0); 
		Target_Horizontal_Cam_2.transform.localPosition.y 								// Normalize Target_Horizontal_Cam_2 Movement. Target_Horizontal_Cam_2 follow obj_Follow_Ball
			= Max_Pos_Y_Cam_2*(obj_Follow_Ball.transform.localPosition.y - 0) /(2-0); 
	}
}

function LateUpdate () {   																// --> LateUpdate is called after all Update functions have been called. A follow camera should always be implemented in LateUpdate because it tracks objects that might have moved inside Update.
	if(!b_PauseMode){																	// if The game is not on pause
		if(!b_ChangeCamera_Position){
			if(Cam_Style != 5){															// The camera change occurs only when the ball is not in the launcher
				if (Cam_Style == 0){													// --> Cam 1
					if(obj_Follow_Ball.transform.localPosition.z > limit){				// Camera Move Up and Down
						Move_Camera = true;
						speed = 0;
						tmp_Target = Target_Vertical_Cam_1;
					}
					else{
						Move_Camera = false;
						speed = 0;
						if(T_Position){													// use if you want to mofify the camera position															
							transform.position.y = tmp_Target.position.y;
							transform.position.z = tmp_Target.position.z;
							transform.rotation = Quaternion.Lerp(startPosition.rotation, target.rotation, t);
						}
						else{
							tmp_Target.position.y = TargetPosY;							// Camera_Pivot Target position you want to target
				    		tmp_Target.position.z = TargetPosZ;
				    	}
					}
				}
				else if (Cam_Style == 1){												// --> Cam 2 Camera Move Forward Backward
					if(obj_Follow_Ball.transform.localPosition.z > limit && Up){
						Move_Camera = true;
						tmp_Target = Target_Horizontal_Cam_2;
						smoothTime = 2*20;
						speed = 0;
					}
					else {
						smoothTime = 2;
						Move_Camera = false;
						if(T_Position){													// use if you want to mofify the camera position						
							transform.position.y = tmp_Target.position.y;
							transform.position.z = tmp_Target.position.z;
							transform.rotation = Quaternion.Lerp(startPosition.rotation, target.rotation, t);
						}
						else{
							tmp_Target.position.y = TargetPosY;							// Camera_Pivot Target position you want to target
				    		tmp_Target.position.z = TargetPosZ;
				    	}
						speed = Mathf.MoveTowards(speed,2,Time.deltaTime*3);
					}
				}
			}

		    if(	tmp_Target != null)															
				distance = Vector3.Distance( transform.position, tmp_Target.position) ;	// Calculate the distance between transform.position and tmp_Target.position

			if(Cam_Style == 1){															// --> Cam 2 Movement
				transform.position = Vector3.Slerp( transform.position, 
				Vector3(
					transform.position.x,
					tmp_Target.position.y,
					tmp_Target.position.z
				),
				(2+speed*speed*20)*(Time.fixedDeltaTime * smoothTime)
				);
			}
			else if(Cam_Style != 8 && Cam_Style != 5 ){									// --> Cam 1 Movement	
				transform.position = Vector3.Slerp( transform.position, 
				Vector3(
					transform.position.x,
					tmp_Target.position.y,
					tmp_Target.position.z
				),
				(Time.fixedDeltaTime * smoothTime)
				);
			}
		}
		else if(Cam_Style != 8){																	// --> Move the camera when the player change the camera view
			t += Time.deltaTime/1;
			transform.position.y = Mathf.Lerp(startPosition.position.y, TargetPosY, t);				// Change the camera position
			transform.position.z = Mathf.Lerp(startPosition.position.z, TargetPosZ, t);
			transform.rotation = Quaternion.Lerp(startPosition.rotation, target.rotation, t);		// Change camera rotation
			if(Mathf.Round(transform.position.y*1000000) == Mathf.Round(TargetPosY*1000000) 		
				&& Mathf.Round(transform.position.z*1000000) == Mathf.Round(TargetPosZ*1000000) ){ 	// Wait until the camera reach his new position
				b_ChangeCamera_Position = false;													// the camera reach his new position
				PlayerChangeTheCamera = false;
			}
			if(obj_Follow_Ball.transform.localPosition.z > limit && Cam_Style != 4 
				&& !PlayerChangeTheCamera){	 														// Use to prevent bug when the player change camera view and the ball > limit
				b_ChangeCamera_Position = false;
			}
		}
	}
}

function Plunger(CamView : int){									// --> Call by Camera_Movement.js on Main Camera GameObject on the hierarchy. Ball Enter the plunger
	Plunger_Activate = true;
	newTarget(CamView);												// Change the camera view
}
function ExitPlunger(CamView : int){								// --> Call by Camera_Movement.js on Main Camera GameObject on the hierarchy. Ball Exit the plunger
	Plunger_Activate = false;
	newTarget(CamView);												// Change the camera view
}



function Player_Change_Camera(CamView : int){						// --> Call by Camera_Movement.js on Main Camera GameObject on the hierarchy. Ball Enter the plunger
	PlayerChangeTheCamera = true;
	newTarget(CamView );											// Change the camera view
}	

function newTarget(CamView : int){									// --> Call by Camera_Movement.js on Main Camera GameObject on the hierarchy.
	switch (CamView) {
	    case 1:
	    	if(!Plunger_Activate){									// -> Cam 1 : Camera Move Up and Down
	    		Cam_Style 				= 0;	
			    smoothTime 				= SpeedCam_1;//50;
			    limit 					= 7;						// obj_Follow_Ball.transform.localPosition.z > limit the camera follow the ball. use for Cam 1 and Cam 2
			    tmp_Target 				= Target_Fixed_Cam_1;
			    b_ChangeCamera_Position = true;
			   	TargetPosY 				= -6.269754;				// Y : Camera_Pivot Target position we want to target
			    TargetPosZ 				= -13.92712;				// Z : Camera_Pivot Target position we want to target
			    t 						= 0;						// 	The next 3 variables are used to move the camera to the next Camera view	
			    startPosition 			= transform;
			    target 					= Target_Fixed_Cam_1;

		   	}
	    	break;
		case 2:
			if(!Plunger_Activate){									// -> Cam 2 : Camera Move Forward Backward
				Cam_Style 				= 1;
			    smoothTime 				= SpeedCam_2;//2;
			    limit 					= 7;
			    tmp_Target 				= Target_Fixed_Cam_2;
			    b_ChangeCamera_Position = true;
			    TargetPosY			 	= -6.263788;				// Y : Camera_Pivot Target position we want to target
			    TargetPosZ 				= -13.91756;				// Z : Camera_Pivot Target position we want to target
			    t 						= 0;
			    startPosition 			= transform;
			    target 					= Target_Fixed_Cam_2;
		    }
	    	break;
		case 3:
			if(!Plunger_Activate){									// -> Cam 3 : Camera Fixe
		    	Cam_Style 				= 4;
			    smoothTime				= SpeedCam_3;//100;
			    tmp_Target 				= Target_Fixed_Cam_3;
			    b_ChangeCamera_Position = true;
			    TargetPosY 				= -5.957438;				// Y : Camera_Pivot Target position we want to target
			    TargetPosZ 				= -14.18113;				// Z : Camera_Pivot Target position we want to target
			    t 						= 0;
			    startPosition 			= transform;
			    target 					= Target_Fixed_Cam_3;
		    }
	    	break;
		case 4:
			if(!Plunger_Activate){									// -> Cam 4 : Camera Fixe
		    	Cam_Style 				= 4;
			    smoothTime				= SpeedCam_3;//100;
			    tmp_Target 				= Target_Fixed_Cam_4;
			    b_ChangeCamera_Position = true;
			    TargetPosY		 		= -5.36744;					// Y : Camera_Pivot Target position we want to target
			    TargetPosZ 				= -14.16112;				// Z : Camera_Pivot Target position we want to target
			    t 						= 0;	
			    startPosition 			= transform;
			    target 					= Target_Fixed_Cam_4;
		    }
	    	break;


		case 5:														// -> Cam Plunger
				Cam_Style 				= 5;
		    	smoothTime 				= SpeedCam_4;//100;
			    tmp_Target 				= Target_Plunger;
		    	b_ChangeCamera_Position = true;
			    TargetPosY 				= -6.172;					// Y : Camera_Pivot Target position we want to target
			    TargetPosZ 				= -14.374;					// Z : Camera_Pivot Target position we want to target
			    t = 0;
			    startPosition 			= transform;
			    target 					= Target_Plunger;
	    	break;	



		case 6:
			if(!Plunger_Activate){									// Use For MultiBall Mode.  Same Param as Case 4
		    	Cam_Style 				= 4;
			    smoothTime				= SpeedCam_Punger;//100;
			    tmp_Target 				= Target_Fixed_Cam_4;
			    b_ChangeCamera_Position = true;
			    TargetPosY 				= -5.36744;					// Y : Camera_Pivot Target position we want to target
			    TargetPosZ				= -14.16112;				// Z : Camera_Pivot Target position we want to target
			    t 						= 0;
			    startPosition 			= transform;
			    target 					= Target_Fixed_Cam_4;
		    }
	    	break;  

		case 8:
		   	Cam_Style 					= 8;						// -> Cam Animation when game start
	    	break;  
	}	
}


function ChangeSmoothTimeWhenBallIsLost(){}					
function ChangeSmoothTimeInit(){									
}	

function F_Camera_Move_Enable(){Move_Camera = true;}
function F_Camera_Move_Disable(){Move_Camera = false;}

function StartPauseMode(){b_PauseMode=true;}
function StopPauseMode(){b_PauseMode=false;}

function FocusCam(value : int){
// I create this function because the new version of this script use it
}