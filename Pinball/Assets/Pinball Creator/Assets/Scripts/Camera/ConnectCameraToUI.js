// ConnectCameraToUI.js : Description : This script is used to connect the gameObject UI_Cam to the UI_Cam Object on the hierarchy
#pragma strict

function Start () {
	var tmp :  GameObject = GameObject.Find("Cam_UI");
	if(tmp != null){
	var tmp_Cam : Camera = GameObject.Find("Cam_UI").GetComponent.<Camera>();		// Find the camera

	GetComponent.<Canvas>().worldCamera = tmp_Cam;									// Connect the gameObject UI_Cam to the UI_Cam Object
	}
}
