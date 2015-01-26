Abantech Read Me
===
[Web Page View]( http://abantech.github.io/index.html )  
[Source Code View]( https://github.com/abantech/abantech.github.io/ )

Mission:  
All about natural interaction in 3D...

Demo: [Sphere Drawing Simulator]( http://abantech.github.io/sphere-drawing-simulator.html )  
Source code: [Sphere Drawing Simulator]( https://github.com/Abantech/abantech.github.io/tree/master/ClientSideJSForLeap )

Demo: [NI 3D prototype workspace]( http://abantech.github.io/NI3DPrototype/main.html )  
Source Code: [NI 3D prototype workspace]( https://github.com/Abantech/abantech.github.io/tree/master/NI3DPrototype )
Updated: 
Greg ~ 2015-01-24 - Fixed issues with intersection with new shape menu button, now showing simple create of cube (and rotation) after 750ms delay. Still some issues (not a *real* button press yet, see comments under isButtonPressed function)
James ~ 2015-01-25 - 
- Added LEAPToSceneConverter that reorients the leap hand tracking based on where the camera is looking so that, even if the camera moved, rotated, or zoomed (in or out) within the scene (say by using orbitcontrols), the hand is still in the right location, direction, and scale. 
- Added MathHelper and GestureTimer utilities
- Updated how HandActions work so that they now have both an 'action' and 'options' which can be used to set up how a specific gesture works
- Added a PinchHandGesture that implements that selectively fires off the onBeginGesture, onGesture, or onEndGesture depending on what state the pinch is in

***

Demo: [Three.js Leap Wearable]( http://abantech.github.io/threejs-leap-wearable/r1/threejs-leap-wearable.html )  
Source code: [Three.js Leap Wearable( https://github.com/Abantech/abantech.github.io/blob/master/threejs-leap-wearable )
Added: Theo ~ 2015-01-25 ~ First pass at a Leap Wearable. Left arm only.

Demo: [Three.js Leap-Enabled Template]( http://abantech.github.io/threejs-leap-enabled-template/r1/threejs-leap-enabled-template.html )  
Source code: [Three.js Leap-Enabled Template]( https://github.com/Abantech/abantech.github.io/blob/master/threejs-leap-enabled-template/ )
Added: Theo ~ 2015-01-24 ~ Minimum rig to get Three.js and Leap device playing together

Demo: [Three.js Mouseover]( http://abantech.github.io/threejs-mouseover/r1/threejs-mouseover.html )  
Source code: [Three.js Leap-Enabled Template]( https://github.com/Abantech/abantech.github.io/blob/master/threejs-mouseover/ )
Added: Theo ~ 2015-01-24 ~ Minimum rig to get Three.js to get raycasting (finding the object under the cursor) going from camera position

Demo: [Three.js Object to Object Raycasting]( http://abantech.github.io/threejs-object-to-object-raycasting/r1/threejs-object-to-object-raycasting.html )  
Source code: [Three.js Object to Object Raycasting]( https://github.com/Abantech/abantech.github.io/blob/master/threejs-object-to-object-raycasting/ )
Added: Theo ~ 2015-01-24 ~ Minimum rig to get Three.js to get raycasting going from any two object in a scene

Demo: [Three.js FingerOver Leap-Enabled]( http://abantech.github.io/threejs-mouseover-leap-enabled/r1/threejs-mouseover-leap-enabled.html )  
Source code: [Three.js FingerOver Leap-Enabled]( https://github.com/Abantech/abantech.github.io/blob/master/threejs-mouseover-leap-enabled/ )
Updated: Theo ~ 2015-01-25 ~ Minimum rig to get Three.js to highlight object a Leap finger is pointing at. Also begins to be a game for Leo. 

***

Demo: [Item Touched Add Handles]( http://abantech.github.io/item-touched-add-handles/r1/item-touched-add-handles-r1.html )  
Source code: [Item Touched Add Handles]( https://github.com/Abantech/abantech.github.io/blob/master/item-touched-add-handles/r1/item-touched-add-handles-r1.html )  
Added: Theo ~ 2015-01-22


***

See Also

[UI Functions Google Spreadsheet]( https://docs.google.com/a/abantech.net/spreadsheets/d/1skBOHfMX3LZ_gv2S56IFMq_Ht_X6t1KnvRIzo_ihxXQ/edit#gid=1786159030 )


