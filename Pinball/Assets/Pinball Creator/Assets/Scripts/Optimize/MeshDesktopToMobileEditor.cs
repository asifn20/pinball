// MeshDesktopToMobileEditor.cs : Description : use to create button on MeshDesktopToMobile.cs
#if (UNITY_EDITOR)
using UnityEngine;
using UnityEditor;
using System.Collections;


[CustomEditor (typeof(MeshDesktopToMobile))]
public class MeshDesktopToMobileEditor : Editor {

	public override void OnInspectorGUI(){
		DrawDefaultInspector();
		MeshDesktopToMobile mc = target as MeshDesktopToMobile;

	GUILayout.Label("Material Path",EditorStyles.boldLabel);
	if(GUILayout.Button("Validation")){
		mc.F_newMaterial(0);
	}
	GUILayout.Label("");
		GUILayout.Label("Switch Models",EditorStyles.boldLabel);
		if(GUILayout.Button("Mobile to Desktop")){
			mc.F_newMesh(0);
		}
		if(GUILayout.Button("Desktop to Mobile")){
			mc.F_newMesh(1);
		}
		GUILayout.Label("");
		GUILayout.Label("Switch Materials",EditorStyles.boldLabel);
		if(GUILayout.Button("Mobile to Desktop")){
			mc.F_newMaterial(0);
		}
		if(GUILayout.Button("Desktop to Mobile")){
			mc.F_newMaterial(1);
		}
	}
}
#endif