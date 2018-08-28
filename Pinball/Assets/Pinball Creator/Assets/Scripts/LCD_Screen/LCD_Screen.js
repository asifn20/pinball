// LCD_Screen : Description : LCD : Choose the LCD Screen position relative to object cam. Usefull when screen resolution change.
#pragma strict

var Screen_Position_X 	: float = 0.15; 						// LCD Screen Position. 0 = left Corner. 	1 = Right Corner  
var Screen_Position_Y 	: float = .9; 							// LCD Screen Position. 0 = bottom Corner. 	1 = Up Corner  
var Screen_Position_Z	: float = 8.5; 							// LCD Screen Position. 0 = bottom Corner. 	1 = Up Corner  

var cam					: Camera;								// The reference Camera
var MainCam				: CameraSmoothFollow;
var LCD_Screen			: GameObject;

private var OneTime : boolean = true;

function Start() {
	if(Screen.width < Screen.height)
		OneTime = false;
	else
		OneTime = true;

	LCD_Screen.transform.position = cam.ViewportToWorldPoint(				// --> Choose the LCD Screen position relative to object cam
		Vector3(Screen_Position_X,Screen_Position_Y,Screen_Position_Z)); 		// Transforms position from viewport space into world space.

	var tmp : GameObject = GameObject.Find("Pivot_Cam");

	MainCam = tmp.GetComponent.<CameraSmoothFollow>();
}


function Update(){
		if(Screen.width < Screen.height && (MainCam.F_ReturnLastCam() == 3 || MainCam.F_ReturnLastCam() == 4)){
			LCD_Screen.transform.position = cam.ViewportToWorldPoint(				// --> Choose the LCD Screen position relative to object cam
				Vector3(.5,.94,Screen_Position_Z)); 		// Transforms position from viewport space into world space.

			if(OneTime){
				LCD_Screen.SetActive(true);
				OneTime = false;
			}
		}
		else if(Screen.width < Screen.height && MainCam.F_ReturnLastCam() != 3 && MainCam.F_ReturnLastCam() != 4){
			LCD_Screen.transform.position = cam.ViewportToWorldPoint(				// --> Choose the LCD Screen position relative to object cam
				Vector3(.5,Screen_Position_Y,Screen_Position_Z)); 		// Transforms position from viewport space into world space.
			
			if(!OneTime){
				LCD_Screen.SetActive(false);
				OneTime = true;
			}
		}
		else if(Screen.width > Screen.height){
			LCD_Screen.transform.position = cam.ViewportToWorldPoint(				// --> Choose the LCD Screen position relative to object cam
				Vector3(Screen_Position_X,Screen_Position_Y,Screen_Position_Z)); 		// Transforms position from viewport space into world space.
			if(OneTime){
				LCD_Screen.SetActive(true);
				OneTime = false;
			}
		}
}