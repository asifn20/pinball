// gizmo.js : Description : Draw gizmo on object. Just put the script on the object you want
#pragma strict

var GizmoColor 	: Color = Color (1,0,0,.5);					// Choose on the inspector the color
var GizmoSize	: Vector3 = Vector3 (.025,.025,.025);		// Choose on the Inspector the gizmo size

function OnDrawGizmos() {		
	Gizmos.color = GizmoColor;								
	Gizmos.DrawCube (transform.position, GizmoSize);
}