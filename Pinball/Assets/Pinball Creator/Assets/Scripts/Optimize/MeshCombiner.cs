// MeshCombiner.cs Description : Combine meshes for a selected group
using UnityEngine;
using System.Collections;
#if (UNITY_EDITOR)
using UnityEditor;
#endif
using System.Collections.Generic;

[RequireComponent(typeof(MeshFilter))]										// Automaticaly add this component
[RequireComponent(typeof(MeshRenderer))]									// Automaticaly add this component
public class  MeshCombiner : MonoBehaviour {
	#if (UNITY_EDITOR)

	[Header ("01 Choose the material folder")]
	public string _path= "Assets/Pinball Creator/Assets/Materials/Global/Materials_Desktop/";		// Choose the material folder 
	[Header ("02 Choose a gameObject to combine (All the children will be combine)")]
	public GameObject obj;													// Combine all the mesh from this gameOBject
	[Header ("03 Choose Tag (Object with these tags are not combine)")]
	public string[] arrtags;												// Choose gameObject with  that you don't want to be combine 
	[Header ("04 After the Combine process, delete gameObject with material that are not used")]
	public bool DeleteUnusedMaterial = true;

	[Header ("Children Only : Put here the material you want to use")]
	public Material mat;													// Put here a material. This gameObject combine all the gameobject with this material. Assign material only for children of obj


	// Use this for initialization
	public void CombineMeshes () {											// -> Combine all the maesh with a specif material.
		Quaternion oldRot =   obj.transform.rotation;						// Save the original position and rotation of obj
		Vector3 oldPos =   obj.transform.position;
		bool OneMesh = false;												// This variable is used to know if there is at least one mesh to combine

		obj.transform.rotation = Quaternion.identity;						// Init position to zero
		obj.transform.position = Vector3.zero;								// Init position to Vector3(0,0,0)

		MeshFilter[] filters = obj.GetComponentsInChildren<MeshFilter>();	// Find all the children with MeshFilter component

		Debug.Log(name + " is combining " + filters.Length + " meshes");


		Mesh finalMesh = new Mesh();										// Create the new mesh

		CombineInstance[] combiners = new CombineInstance[filters.Length];	// Struct used to describe meshes to be combined using Mesh.CombineMeshes.


		for(int i = 0; i < filters.Length; i++){							// Check all the children
			if(filters[i].transform ==  obj.transform)						// Do not select the parent himself
				continue;
			if(filters[i].gameObject.GetComponent<Renderer>() ==  null)		// Check if there is Renderer component
				continue;
			bool checkTag = false;											
			for(int j = 0; j < arrtags.Length; j++){						// Check tag to know if you need to ignore this gameobject 
				if(filters[i].gameObject.tag ==  arrtags[j]){
					checkTag = true;
				}
			}


			if(mat == filters[i].gameObject.GetComponent<Renderer>().sharedMaterial && !checkTag	// Add this gameObject to the combiner
				&& filters[i].gameObject.GetComponent<Renderer>().enabled){
						combiners[i].subMeshIndex = 0;
						combiners[i].mesh = filters[i].sharedMesh;
						combiners[i].transform = filters[i].transform.localToWorldMatrix;
						filters[i].gameObject.GetComponent<Renderer>().enabled = false;
						OneMesh = true;
			}
		}



		finalMesh.CombineMeshes(combiners);						// Combine the new mesh
		GetComponent<MeshFilter>().sharedMesh = finalMesh;		// Create the new Mesh Filter
		GetComponent<Renderer>().material = mat;				// ADd the good material



		transform.rotation = oldRot;							// Move the object at his original position
		transform.position = oldPos;

		obj.transform.rotation = oldRot;
		obj.transform.position = oldPos;

		if(!OneMesh){											// If there is nothing to combine delete the object
			gameObject.SetActive(false);
			GetComponent<MeshFilter>().sharedMesh = null;
			if(DeleteUnusedMaterial)Object.DestroyImmediate(gameObject);
		}
		else{
			UnwrapParam param = new UnwrapParam();				// enable lightmap
			UnwrapParam.SetDefaults( out param );
			Unwrapping.GenerateSecondaryUVSet( finalMesh, param );

		}
	}


	public void ResetCombineMeshes () {														// -> Reset combine mesh
		MeshFilter[] filters = obj.GetComponentsInChildren<MeshFilter>();					// Find all the children with MeshFilter component

		for(int i = 0; i < filters.Length; i++){
			if(filters[i].transform == transform)											// Ignore parent
				continue;
			if(filters[i].gameObject.GetComponent<Renderer>() ==  null)						// Ignore if no Renderer component
				continue;

			bool checkTag = false;											
			for(int j = 0; j < arrtags.Length; j++){						// Check tag to know if you need to ignore this gameobject 
				if(filters[i].gameObject.tag ==  arrtags[j]){
					checkTag = true;
				}
			}

			if(mat == filters[i].gameObject.GetComponent<Renderer>().sharedMaterial && !checkTag){		// if it is the goos material
				filters[i].gameObject.GetComponent<Renderer>().enabled = true;				// Enable renderer
			}
		}
		GetComponent<MeshFilter>().sharedMesh = null;										// Mesh filter == null
		transform.rotation = Quaternion.identity;											// iit rotation	
		transform.position = Vector3.zero;													// init position
	}

	public void CombineAllMeshes(){													// --> Combine all the mesh with the qsame material
		MeshFilter[] all = GetComponentsInChildren<MeshFilter>();							// Find all the children with MeshFilter component
		if(all.Length > 1){
			for(int i = 0; i < all.Length; i++){
				if(all[i].transform ==  transform)											// Ignore parent
					continue;
				all[i].GetComponent<MeshCombiner>().CombineMeshes();
			}
		}
		else{
			Debug.Log("Need child to work");
		}
	}

	public void ResetAllCombineMeshes () {											// --> Use by the parent Reset all the children
		Transform[] all = GetComponentsInChildren<Transform>();						// Find all the children with Transform component

		foreach(Transform t in transform){												// Activate all child
			t.gameObject.SetActive(true);
		}

		for(int i = 0; i < all.Length; i++){
			if(all[i].transform ==  transform)
				continue;
			all[i].GetComponent<MeshCombiner>().ResetCombineMeshes();					// Call this function to the children
		}
	}

	public void SelectAGroup(){													// Update Children parameter						
		foreach(Transform t in transform){											// Activate all child
			t.GetComponent<MeshCombiner>().ChooseGroup(obj);						// Call this function to the children
		}
		UpdateTag();
	}

	public void ResetGroup(){													// Update Children parameter
		GetComponent<MeshCombiner>().ChooseGroup(null);
		foreach(Transform t in transform){											// Activate all child
			t.GetComponent<MeshCombiner>().ChooseGroup(null);						// Call this function to the children
		}
	}

	public void ChooseGroup(GameObject newObj){									// Update Children parameter
		obj = newObj;
	}
	public void ChooseTag(string[] newTag){
		arrtags = newTag;
	}

	public void UpdateTag(){													// Update Children parameter
		foreach(Transform t in transform){											// Activate all child
			t.GetComponent<MeshCombiner>().ChooseTag(arrtags);
		}
		UpdateDeleteUnusedMaterial();
	}

	public void UpdateDeleteUnusedMaterial(){
		foreach(Transform t in transform){							// Activate all child
			t.GetComponent<MeshCombiner>().F_DeleteUnusedMaterial(DeleteUnusedMaterial);
		}
	}
	public void F_DeleteUnusedMaterial(bool value){
		DeleteUnusedMaterial = value;
	}

	public void UpdateMaterial(){
		foreach(Transform t in transform){							// Activate all child
			t.GetComponent<MeshCombiner>().F_UpdateMaterial(_path);
		}
		SelectAGroup();		
	}
	public void F_UpdateMaterial(string newPath){
		Material t = AssetDatabase.LoadAssetAtPath(newPath 
				+  mat.name + ".mat", typeof(Material)) as Material;

		if(t != null){
			mat =t;
		}
	}

	#endif
}
