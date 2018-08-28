//CollisionSound.js : Description : Play a sound when something enter on collision whese this object
#pragma strict

@Header ("-> Hit Sound")	
var a_hit						: AudioClip;							// sound to play
private var Hit_audio			: AudioSource;							// roll AudioSource Component
var volumMax 					: float = .1;							// volume to play
@Header ("-> Flipper Case")	
var b_Flipper					: boolean = false;						// true if this object is a flipper
var Flipper						: GameObject;							// Connect the flipper

function Start () {
	if(!b_Flipper)
		Hit_audio = GetComponent.<AudioSource>();						// Access <AudioSource>() Component; if Hit sound is selected on the inspector
	else
		Hit_audio = Flipper.GetComponent.<AudioSource>();		
}


function OnCollisionEnter(collision: Collision) {						// -> On Collision Enter 
	if (collision.relativeVelocity.magnitude){
		Hit_audio.volume = collision.relativeVelocity.magnitude*.25;
		if(Hit_audio.volume > volumMax)
			Hit_audio.volume = volumMax;
		if(a_hit)Hit_audio.clip = a_hit;
		Hit_audio.Play();
	}
}