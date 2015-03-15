Three.js Object to Object Raycasting Read Me
===

### The Issue

Given an asymmetrical 3D asset, is it possible to determine if two test objects are both simultaneously in close proximity or even inside the asset.
The directional rays of the two test object should be pointing toward each other.
   
## Demos

[Object to Object Raycasting R2]( http://abantech.github.io/interaction-studies/threejs-object-to-object-raycasting/r2/threejs-object-to-object-raycasting.html )

* Bi-directional

Notes

* Make certain the directional vector is pointing the correct way. Set the directional vector start point is the object being pointed at ( the remote object) and then subtract the position of the object doing the pointing.
* There's usually no need to set near and far unless there is a very large number of objects.

[Object to Object Raycasting R1]( http://abantech.github.io/interaction-studies/threejs-object-to-object-raycasting/r1/threejs-object-to-object-raycasting.html )

* Single direction
