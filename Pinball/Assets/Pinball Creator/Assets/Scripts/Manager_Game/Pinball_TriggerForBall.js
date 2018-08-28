// Pinball_TriggerForBall.js : Description : Detect when a ball is lost : Use by Out_Hole_TriggerDestroyBall gameObject on the hierarchy
#pragma strict

private var obj_Game_Manager: GameObject;											// Manager_Game GameObject
private var gameManager		: Manager_Game;											// access Manager_Game component from Manager_Game GameObject on the hierarchy

function Start(){																	// --> Function Start
	if (obj_Game_Manager == null)													// Connect the Mission to the gameObject : "Manager_Game"
		obj_Game_Manager = GameObject.Find("Manager_Game");

	gameManager = obj_Game_Manager.GetComponent.<Manager_Game>();					// Access Manager_Game gameComponent from obj_Game_Manager
}

function OnTriggerEnter (other : Collider) {										// --> Function OnTriggerEnter
	if(other.transform.tag == "Ball"){												// If it's a ball 
		gameManager.gamePlay(other.gameObject);										// Send Message to the obj_Game_Manager.  
	}
}
