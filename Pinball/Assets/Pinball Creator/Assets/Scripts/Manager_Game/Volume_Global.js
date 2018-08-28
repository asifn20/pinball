// Volume_Global : Description : Use on AudioListener on the hierarchy to manage global scene volume
#pragma strict

var Volume_Global : float = 1;				// Set the vulume needed

function Start () {
	AudioListener.volume = Volume_Global;
}

function ChangeVolume(vol : float) {		// Call this function if you want to change the global volume
	AudioListener.volume = vol;
}

