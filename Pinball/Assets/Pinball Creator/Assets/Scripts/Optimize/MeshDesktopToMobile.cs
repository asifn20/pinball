// MeshDesktopToMobile.cs : Description : Switch material and models between mobile and desktop version
using UnityEngine;
using System.Collections;
#if (UNITY_EDITOR)
using UnityEditor;
#endif
using System.Collections.Generic;

[RequireComponent(typeof(MeshFilter))]
[RequireComponent(typeof(MeshRenderer))]
[ExecuteInEditMode]
public class  MeshDesktopToMobile : MonoBehaviour {
	#if (UNITY_EDITOR)
	[Header("Choose Models and Materials folder")]
	public string FolderDesktopModels = "Assets/Pinball Creator/Assets/Models/Models_Desktop/"; 
	public string FolderMobileModels = "Assets/Pinball Creator/Assets/Models/Models_Mobile/"; 
	public string FolderDesktopMaterials = "Assets/Pinball Creator/Assets/Materials/Global/Materials_Desktop/"; 
	public string FolderMobileMaterials = "Assets/Pinball Creator/Assets/Materials/Global/Materials_Mobile/"; 


	public void F_newMesh(int value){										// --> choose between mobile and desktop mesh 
		if(value == 0)
			newMesh(FolderDesktopModels);
		else
			newMesh(FolderMobileModels);
	}

	public void newMesh(string newPath){									// --> Change all the mesh of the object 
		MeshFilter[] _Children = GetComponentsInChildren<MeshFilter>();			// Find all the children with MeshFilter component

		for(int i = 0; i < _Children.Length; i++){
			if( _Children[i].gameObject.GetComponent<Renderer>() ==  null)		// Ignore if no renederer
				continue;
			if( _Children[i].GetComponent<MeshFilter>().sharedMesh ==  null)	// Ignore if no meshfilter
				continue;

			Mesh t = AssetDatabase.LoadAssetAtPath(newPath +  _Children[i].GetComponent<MeshFilter>().sharedMesh.name + ".fbx", typeof(Mesh)) as Mesh;	// Mesh Path

			if(t != null){
				_Children[i].GetComponent<MeshFilter>().sharedMesh =t;			// Change the mesh
			}
		}

	}

	public void F_newMaterial(int value){									// --> choose between mobile and desktop material 
		if(value == 0)
			newMaterial(FolderDesktopMaterials);						
		else
			newMaterial(FolderMobileMaterials);
	}

	public void newMaterial(string newPath){								// --> Change all the material of the object 
		MeshFilter[] _Children = GetComponentsInChildren<MeshFilter>();			// Find all the children with MeshFilter component

		for(int i = 0; i < _Children.Length; i++){
			if( _Children[i].gameObject.GetComponent<Renderer>() ==  null)		// Ignore if no renederer
				continue;
			if( _Children[i].GetComponent<Renderer>().sharedMaterial ==  null)	// Ignore if no meshfilter
				continue;

			Material t = AssetDatabase.LoadAssetAtPath(newPath +  _Children[i].GetComponent<Renderer>().sharedMaterial.name + ".mat", typeof(Material)) as Material; // Mesh Path

			if(t != null){
				_Children[i].GetComponent<Renderer>().sharedMaterial =t;		// Change the material
			}
		}
	}

	#endif
}
