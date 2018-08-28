// Project_Settings.js : Description : Use to init the global Time paramaters and Physics parameters of the game
#pragma strict

@Header ("Edit->Project Settings->Time")	
var init_FixedTimestep 			: float = 0.002;
var init_MaximumAllowedTime 	: float = 0.03333333;
var init_TimeScale 				: float = 1;

@Header ("Edit->Project Settings->Physics")
var init_Gravity				: Vector3 = Vector3(0,-9.81,0);
var init_BounceTreshold			: float = 0.05;
var init_SleepThreshold			: float = 0.01;
var init_DefaultContactOffset	: float = .0025;
var init_SolverIterationCount	: float = 7;

function Awake () {
	// init Time param
	Time.fixedDeltaTime 		= init_FixedTimestep;
	Time.maximumDeltaTime		= init_MaximumAllowedTime;
	Time.timeScale 				= init_TimeScale;
	// init Physics param
	Physics.gravity				= init_Gravity;
	Physics.bounceThreshold 	= init_BounceTreshold;
	Physics.sleepThreshold		= init_SleepThreshold;
	Physics.defaultContactOffset= init_DefaultContactOffset;
	Physics.defaultSolverIterations= init_SolverIterationCount;
}
