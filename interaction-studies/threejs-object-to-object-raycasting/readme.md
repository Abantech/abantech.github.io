Three.js Object to Object Raycasting Read Me
===

### The Issue

Given an asymmetrical 3D asset, is it possible to determine if two test objects are both simultaneously in close proximity 
such that a ray drawn between the geometric centers of the objects would lay entirely inside the asset.
The directional rays of the two test object should be pointing toward each other.
   
## Demos

[Object to Object Raycasting R3]( http://abantech.github.io/interaction-studies/threejs-object-to-object-raycasting/r2/threejs-object-to-object-raycasting.html )

* 2015-03-19 ~ A work in progress
* The asymmetrical 3D asset is now created using the convex geometry script
	* When random object slider id dragged, object wiggles and rotates 
* The two test objects are now rotatable
* As the test objects are rotated a line is drawn and updated between the test objects

Note: This release has not updated the ray caster routine in any way. Thus no 'touches' are currently being identified. The next release will have an update on ray casting.

[Object to Object Raycasting R2]( http://abantech.github.io/interaction-studies/threejs-object-to-object-raycasting/r2/threejs-object-to-object-raycasting.html )

* Bi-directional

Notes

* Make certain the directional vector is pointing the correct way. Set the directional vector start point is the object being pointed at ( the remote object) and then subtract the position of the object doing the pointing.
* There's usually no need to set near and far unless there is a very large number of objects.

[Object to Object Raycasting R1]( http://abantech.github.io/interaction-studies/threejs-object-to-object-raycasting/r1/threejs-object-to-object-raycasting.html )

* Single direction
