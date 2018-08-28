// Toys.js : Description : This script is used to play animation with animator or use Particle system.
#pragma strict

private var anim				: Animator;										// Access Animator Component
private var MoveHash			: int = Animator.StringToHash("b_Move");		// access parameter from Animator
private var NumberHash			: int = Animator.StringToHash("number");		// access parameter from Animator
private var MoveStateHash_1 	: int = Animator.StringToHash("Base.Move_1");	// access state from Animator
private var MoveStateHash_2 	: int = Animator.StringToHash("Base.Move_2");	// access state from Animator
private var MoveStateHash_3 	: int = Animator.StringToHash("Base.Move_3");	// access state from Animator
private var MoveStateHash_4 	: int = Animator.StringToHash("Base.Move_4");	// access state from Animator
private var MoveStateHash_5 	: int = Animator.StringToHash("Base.Move_5");	// access state from Animator

@Header ("Object with animation")
var Mode_Animator				: boolean = true;								// True if the object use animation
@Header ("Particle System")
var Mode_Particle 				: boolean = false;								// True if the object use Particle system
private var _particleSystem 	: ParticleSystem;								// access Component
private var _Particle 			: ParticleSystem.EmissionModule;   				// access Component
private var ParticleEnable		: boolean = false;								// use to manage Particle Pause Mode		
private var timer				: float;										// use with variable ParticleTime
@Header ("Emission duration")
var ParticleTime				: float;										// Duration of Particle emission
@Header ("Play a sound")
var sfx							: AudioClip;									// if a sound is connected a sound is played when animation or Particle system start
private var _source 			: AudioSource;									// Access audio component

private var Mode_Pause			: boolean = false;								// Use to pause animation or Particle system

@Header ("Play ParticleSystem or Animation when ball is OnTriggerEnter")
var _trigger					: boolean = false;								// If you want to start Particle system or animation when ball Is	On Trigger Enter		
private var Box					: BoxCollider;									// Access Component Box Collider
@Header ("Animation Number")
var _trigger_animation_number	: int = 0;										// Choose animation number if _trigger = true



function Start () {																// --> Start
	_source = GetComponent.<AudioSource>();										// Access Audiosource Component
	 if(Mode_Animator)anim = GetComponent.<Animator>();							// Access ANimator Component if needed
	 if(Mode_Particle){														// Access Particle system component if needed
	 	_particleSystem = gameObject.GetComponent(ParticleSystem);
	   _Particle = _particleSystem.emission;
	 }

	 if(_trigger){
	 	Box = GetComponent.<BoxCollider>();
	 	Box.enabled = true;
	 }
}

function Update () {															// --> Update
	if(!Mode_Pause){															// Mode Pause = false
		if(Mode_Animator){														// 
		 	var stateInfo : AnimatorStateInfo = anim.GetCurrentAnimatorStateInfo(0);	// know what animation is active
		    if(stateInfo.fullPathHash == MoveStateHash_1
		    || stateInfo.fullPathHash == MoveStateHash_2 
		    || stateInfo.fullPathHash == MoveStateHash_3 
		    || stateInfo.fullPathHash == MoveStateHash_4  
		    || stateInfo.fullPathHash == MoveStateHash_5 )
		    {
				anim.SetBool(MoveHash, false);									// init parameter
				anim.SetInteger(NumberHash, 0);									// init parameter
		    }
	    }

		if(Mode_Particle && ParticleEnable){									// Play Particle system
	       	timer = Mathf.MoveTowards(timer,ParticleTime,Time.deltaTime);

	       	if(timer == ParticleTime){	
				ParticleEnable = false;
				_Particle.enabled = false;
				timer = 0;
			}
		}
	}
}

function PlayAnimation(){														// Play an animation. This function is not used
	if(anim.GetBool(MoveHash) == false){
		anim.SetBool(MoveHash, true);											// if anim is not playing.
	}
}

function PlayAnimationNumber(num : int){										// Play animation with number of the animation.
	if(Mode_Particle){
		timer = 0;
		ParticleEnable = true;
	    _particleSystem.Play();
   		_Particle.enabled = true;
	}
	else{
		switch(num){
			case 0:											// Play Anim state : Move_1
				if(anim.GetBool(MoveHash) == false){
					anim.SetBool(MoveHash, true);			// if anim is not playing.
					anim.SetInteger(NumberHash, 1);
				}
				break;
			case 1:											// Play Anim state : Move_2
				if(anim.GetBool(MoveHash) == false){
					anim.SetBool(MoveHash, true);			// if anim is not playing.
					anim.SetInteger(NumberHash, 2);
				}
				break;
			case 2:											// Play Anim state : Move_3
				if(anim.GetBool(MoveHash) == false){
					anim.SetBool(MoveHash, true);			// if anim is not playing.
					anim.SetInteger(NumberHash, 3);
				}
				break;
			case 3:											// Play Anim state : Move_4
				if(anim.GetBool(MoveHash) == false){
					anim.SetBool(MoveHash, true);			// if anim is not playing.
					anim.SetInteger(NumberHash, 4);
				}
				break;
			case 4:											// Play Anim state : Move_5
				if(anim.GetBool(MoveHash) == false){
					anim.SetBool(MoveHash, true);			// if anim is not playing.
					anim.SetInteger(NumberHash, 5);
				}
				break;
		}
	}
	if(sfx){												// Play a sound
		_source.clip = sfx;
		_source.Play();
	}
}


function PlayIdle(){										// Play an animation.
}


function OnTriggerEnter(other : Collider){					// --> OnTriggerEnter : Use If Box Collider = true. 
	if(other.transform.tag == "Ball"){
		if(Mode_Animator){					
			PlayAnimationNumber(_trigger_animation_number);	// Play animation
		}
		if(Mode_Particle){									// patricule emission
			timer = 0;
			ParticleEnable = true;
	    	_particleSystem.Play();
   			_Particle.enabled = true;

		}
		if(sfx){											// Play a sound
			_source.clip = sfx;
			_source.Play();
		}
	}
}


function Pause_Anim(){										// --> Pause Animation
	if(Mode_Animator){
	   	if(anim.speed==0)Stop_Pause_Anim();
    	else Start_Pause_Anim();
		if(_source.isPlaying)_source.Pause();
		else _source.UnPause();
	}
	if(Mode_Particle){
		PauseParicule();
	}

}

function PauseParicule(){									// --> Pause Particle system
	if(Mode_Pause){
		Mode_Pause = false;
		if(_particleSystem.isPaused)_particleSystem.Play();
		_source.UnPause();
	}
	else{	
		Mode_Pause = true;
		if(_particleSystem.isPlaying)_particleSystem.Pause();
		if(_source.isPlaying)_source.Pause();
	}
}


function Stop_Pause_Anim(){									// --> Stop Pause animation
	if(Mode_Animator)anim.speed = 1;
}
function Start_Pause_Anim(){								// --> Start Pause Animation
	if(Mode_Animator)anim.speed = 0;
}