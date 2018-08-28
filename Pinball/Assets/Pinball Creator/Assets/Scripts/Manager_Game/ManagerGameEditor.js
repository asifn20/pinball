#if (UNITY_EDITOR)
@CustomEditor(Manager_Game)
class TestOnInspector extends Editor {
	override function OnInspectorGUI () {
		var mc: Manager_Game = target as Manager_Game;
		DrawDefaultInspector();
		GUILayout.Label("New Game UI Position");
		if(GUILayout.Button("v1 (Obsolete)")){
			mc.NewValueForUi(0);
		}
		if(GUILayout.Button("v 1.5")){
			mc.NewValueForUi(1);
		}
	}
}
#endif