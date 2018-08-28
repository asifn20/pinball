// UI_Debug_Led : Description : use to test leds patterns
#pragma strict

var Gui_Txt_Timer				:  UI.Text;						// Connect a UI.Text

private var obj_Game_Manager	: GameObject;					// Represent Object Manager_Game on the hierarchy
private var missionIndex		: MissionIndex;					// Used to Access Mission_Index component (You find Mission_Index.js on each Mission)
private var gameManager			: Manager_Game;					// Used to Access Manager_Game component (You find Manager_Game.js on Manager_Game object on the hierachy)

private var anim				: int;
@Header ("-> Leds Group (Mission, group of leds)")
var Group_Led					: boolean = false;				// true if you want to test a group leds.
var Obj_Grp						: GameObject;					// Connect the group of leds
private var obj_Grp				: Manager_Led_Animation;
@Header ("-> Global Pattern (Manage by Manager_Game)")
var Global_Led					: boolean = false;				// true if you want to test global pattern using more than one group of leds

private var cmpt				:  int = 0;
private var HowManyAnim			: int;



function Start () {
	if(Global_Led){
		if (obj_Game_Manager == null)									// Connect the Mission to the gameObject : "Manager_Game"
			obj_Game_Manager = GameObject.Find("Manager_Game");
		gameManager = obj_Game_Manager.GetComponent.<Manager_Game>();	// --> Connect the Mission to <Manager_Game>() component. 
		HowManyAnim = gameManager.HowManyAnimation();
	}
	if(Group_Led){
		obj_Grp = Obj_Grp.GetComponent.<Manager_Led_Animation>();
		HowManyAnim = obj_Grp.HowManyAnimation();
	}

	Gui_Txt_Timer.text = cmpt.ToString();
}

function PlayLedAnim () {
	if(Global_Led)
		gameManager.PlayMultiLeds(cmpt);
	if(Group_Led)
		obj_Grp.Play_New_Pattern(cmpt);
}

function _PressButton() {
	cmpt++;
	cmpt = cmpt%HowManyAnim;
	Gui_Txt_Timer.text = cmpt.ToString();
}
