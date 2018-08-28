//MeshCombinerEditor : use with MeshComnier.cs
#if (UNITY_EDITOR)
using UnityEngine;
using UnityEditor;
using System.Collections;

[CustomEditor (typeof(MeshCombiner))]
public class MeshCombinerEditor : Editor {

	public override void OnInspectorGUI(){
		DrawDefaultInspector();

		MeshCombiner mc = target as MeshCombiner;

		GUILayout.Label("");
		GUILayout.Label("Step 1 : Update MeshCombine parameters");
		if(GUILayout.Button("Update")){
			mc.UpdateMaterial();
		}

		GUILayout.Label("Step 2 : Combine Meshes");
		if(GUILayout.Button("Combine")){
			mc.CombineAllMeshes();
		}
			
		GUILayout.Label("");
		GUILayout.Label("Init");
		if(GUILayout.Button("Update")){
			mc.UpdateMaterial();
		}
		if(GUILayout.Button("Reset")){
			mc.ResetAllCombineMeshes();
		}

	}

}
#endif