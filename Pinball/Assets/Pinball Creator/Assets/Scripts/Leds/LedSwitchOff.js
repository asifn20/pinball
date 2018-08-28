// LedSwitchOff.js Description : Use to switch off leds on bumpers and singshot
#pragma strict

private var Led					: ChangeSpriteRenderer;
private var tmp_Time 			: float = 0;
var Timer 						: float = .2;
private var b_Led_On_With_Timer : boolean = true;

function Start () {
	Led = GetComponent.<ChangeSpriteRenderer>();
}

function Timer_Led(){
	b_Led_On_With_Timer = false;
}

function Update(){											
	if(!b_Led_On_With_Timer){										// Used with the function Led_On_With_Timer(value : float)							
		tmp_Time = Mathf.MoveTowards(tmp_Time,Timer,
			Time.deltaTime);
		if(tmp_Time == Timer){										// if time is finish we init the time an switch off the Led 						
			b_Led_On_With_Timer = true;
			//Timer = 0;
			tmp_Time = 0;
			Led.F_ChangeSprite_Off();
		}
	}
}