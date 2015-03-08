/// <reference path="../../Libs/THREEJS/three.min.js" />
/// <reference path="../Controls/FirstPersonControls.js" />
/// <reference path="../FrameActions.js" />

var fingerAdjacencyAngleThreshold = 12

function isHandInAirplaneMode(hand) {
    //Airplane mode = if the index, middle, and ring are together while the thumb and pinky are stretched out
    if (typeof (hand) != 'undefined')
        return (
            fingersExtendedAndAdjacent(hand.indexFinger, hand.middleFinger) &&
            fingersExtendedAndAdjacent(hand.middleFinger, hand.ringFinger) &&
            !fingersExtendedAndAdjacent(hand.thumb, hand.indexFinger) &&
            !fingersExtendedAndAdjacent(hand.ringFinger, hand.pinky)
            )
    else
        return false;
}

var fingersExtendedAndAdjacent = function (finger1, finger2)
{
    return finger1.extended && finger2.extended && finger1.angleToFinger(finger2) < fingerAdjacencyAngleThreshold;
}

//not using this right now because I cannot get it to work correctly
var firstPersonControlsNav = function (frame) {
    var hand, pitchAng, yawAng;

    if (frame.hands.length >= 1 ||
        //TODO: make it so that it's either hand
        isHandInAirplaneMode(frame.hand[0])) {
            
        hand = frame.hands[0];

        if (hand) {
            controls.freeze = false;

            //if ( frame.pointables.length <= 1) {
            yawAng = Math.atan2(hand.direction[0], -hand.direction[1]);
            if (yawAng < 0) {
                yawAng = -500 * (Math.PI + yawAng);
                yawAng = THREE.Math.clamp(yawAng, -1000, 0.1);

            } else if (yawAng > 0) {
                yawAng = 500 * (Math.PI - yawAng);
                yawAng = THREE.Math.clamp(yawAng, 0.1, 1000);
            }
            controls.mouseX = yawAng;

            pitchAng = -900 * Math.atan2(hand.direction[1], -hand.direction[2]);
            controls.mouseY = pitchAng;

            var tmp = (controls.freeze) ? 'class=red' : '';

            info.innerHTML = info.txt + 'freeze: <scan ' + tmp + '>' + controls.freeze + '</scan> lookSpeed: ' + controls.lookSpeed.toFixed(3) + ' movementSpeed:  ' + controls.movementSpeed
            + '<br>' +
            'hand.x: ' + hand.stabilizedPalmPosition[0].toFixed(0) + ' hand.y: ' + hand.stabilizedPalmPosition[1].toFixed(0) + ' hand.z: ' + hand.stabilizedPalmPosition[2].toFixed(0)
            + '<br>' +
            'pitchAng: ' + pitchAng.toFixed(2) + ' yawAng: ' + yawAng.toFixed(2) 
            + '<br>' +
            'pitchAng: ' + hand.pitch().toFixed(2) + ' yawAng: ' + hand.yaw().toFixed(2) + ' rollAng:' + hand.roll().toFixed(2);
                
            //} else {
            // yawAng = 0;
            //}

            /*
            //The code below is what makes it just sink through the floor...
            //Removing this for now until I could figure out the other issues with the code above

            if (frame.pointables.length > 1) {
                if (hand.stabilizedPalmPosition[2] < 0) {
                    controls.moveForward = true;
                    controls.moveBackward = false;
                } else {
                    controls.moveBackward = true;
                    controls.moveForward = false;
                }

                if (hand.stabilizedPalmPosition[1] > 150) {
                    controls.moveUp = true;
                    controls.moveDown = false;
                } else {
                    controls.moveDown = true;
                    controls.moveUp = false;
                }

                if (hand.stabilizedPalmPosition[0] > 0) {
                    controls.moveRight = true;
                    controls.moveLeft = false;
                } else {
                    controls.moveLeft = true;
                    controls.moveRight = false;
                }
            } else {
                controls.moveBackward = false;
                controls.moveForward = false;
                controls.moveLeft = false;
                controls.moveRight = false;
                controls.moveUp = false;
                controls.moveDown = false;
            }

            */
        }
    }
    else {
        controls.freeze = true;
        //if (info)
        //{
        //    info.innerHTML = info.txt + 'CONTROLS FROZEN';
        //}
            
    }
}

var navigationPlate, navigationStartPosition

var updateNavigationControls = function (makeVisible, originPosition) {
    if (typeof (navigationPlate) == 'undefined')
    {
        //TODO: make this 3 concentric cylinders (all translucent) so that the user can see what segment they are on
        var geometry = new THREE.CylinderGeometry(15, 15, 1, 32);
        var material = new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 });
        navigationPlate = new THREE.Mesh(geometry, material);

        window.scene.add(navigationPlate);

        var furthestArrowDistance = 12
        var arrowColors = [0xff0000, 0xffa500, 0xffff00];

        addDirectionArrows(navigationPlate, new THREE.Vector3(1, 0, 0), furthestArrowDistance, arrowColors);
        addDirectionArrows(navigationPlate, new THREE.Vector3(-1, 0, 0), furthestArrowDistance, arrowColors);
        addDirectionArrows(navigationPlate, new THREE.Vector3(0, 0, 1), furthestArrowDistance, arrowColors);
        addDirectionArrows(navigationPlate, new THREE.Vector3(0, 0, -1), furthestArrowDistance, arrowColors);
    }

    if (originPosition)
    { 
        navigationPlate.position.copy(originPosition);
        navigationPlate.translateY(-5);
        navigationPlate.translateZ(-30);
    }

    navigationPlate.visible = makeVisible;
}

function addDirectionArrows(container, directionVector, maxLength, colorHexArray)
{
    var count = colorHexArray.length;
    var segmentSize = maxLength / count;

    for (var i = 1; i <= count; i++)
    {
        var location = new THREE.Vector3().copy(directionVector);
        location.multiplyScalar(segmentSize * i);
        
        container.add(new THREE.ArrowHelper(directionVector, location, segmentSize, colorHexArray[i-1], i, 0.4));
    }
}

var distanceDetents = 30, segments = 4

//For moving left and right (not turning)
var getLateralDistanceSegment = function (handPalmLocation, originPosition)
{   
    var segment = ((handPalmLocation.x - originPosition.x) / distanceDetents).toFixed(0);
    return THREE.Math.clamp(segment, -1 * segments * distanceDetents, segments * distanceDetents)
}

//For moving up and down
var getLongitudinalDistanceSegment = function (handPalmLocation, originPosition)
{  
    var segment = ((handPalmLocation.y - originPosition.y) / distanceDetents).toFixed(0);
    return THREE.Math.clamp(segment, -1 * segments * distanceDetents, segments * distanceDetents)
}

//For moving forward & back
var getDirectionalDistanceSegment = function (handPalmLocation, originPosition)
{   
    var segment = ((handPalmLocation.z - originPosition.z) / distanceDetents).toFixed(0);
    return THREE.Math.clamp(segment, -1 * segments * distanceDetents, segments * distanceDetents)
}

var getTurnAngleSegment = function (handDirection) {
    //TODO: figure out the difference between the angle of where the hand is pointing 
    //relative to the angle formed between the palm and a ray that is parellel to 
    //the ray extending from the camera center (do not use distance!)

    //TODO: should return 0,1,2, or 3 only
}

var createReferenceCubes = function () {
    var geometry = new THREE.BoxGeometry(15, 15, 15);
    var material = new THREE.MeshLambertMaterial({ color: 0xccccff })
    //.MeshLambertMaterial({ color: 0xffffff, shading: THREE.FlatShading });

    for (var i = 0; i < 8; i++) {
        var mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = (Math.random() - 0.5) * 250;
        mesh.position.y = -40;
        mesh.position.z = (Math.random() - 0.5) * 200;
        //			mesh.updateMatrix();
        //			mesh.matrixAutoUpdate = false;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        window.scene.add(mesh);
    }
}

    createReferenceCubes();

var customNUINav = function(frame) {
    //TODO: make it so that it's either hand

    var message = info.txt
    var hand = frame.hands[0];

    controls.moveState.right = 0;
    controls.moveState.up = 0;
    controls.moveState.back = 0;

    if (typeof (hand) != 'undefined')
    {
        message = message + "<br>" +
        "Hands detected = " + frame.hands.length
        + "<br>" +
        "index Extended = " + hand.indexFinger.extended
        + "<br>" + 
        "middleFinger Extended = " + hand.middleFinger.extended
        + "<br>" + 
        "ringFinger Extended = " + hand.middleFinger.extended
        + "<br>" + 
        "pinky Extended = " + hand.pinky.extended

        var cam = window.camera;

        var enableControls = (frame.hands.length >= 1 && isHandInAirplaneMode(hand))

        if (enableControls) {

            //var camPosition = cam.position;
            navigationStartPosition = new THREE.Vector3(cam.position.x, cam.position.y - 20, cam.position.z - 200)

            var handOrigin = new THREE.Vector3().fromArray(hand.palmPosition);
            var moveSpeedDamping = 20;

            var moveLat = getLateralDistanceSegment(handOrigin, navigationStartPosition) * moveSpeedDamping;
            var moveLon = getLongitudinalDistanceSegment(handOrigin, navigationStartPosition) * moveSpeedDamping;
            var moveDir = (getDirectionalDistanceSegment(handOrigin, navigationStartPosition) - 1) * moveSpeedDamping;

            message = message + "<br>AIRPLANE MODE DETECTED" + "<br>" + "Segments (lat, long, dist) = (" + moveLat + ", " + moveLon + ", " + moveDir + ")"

            if (manualMovementMode)
            {//for debugging purposes, turn on manualMovementMode to see what happens when the camera is translated manually
                window.camera.translateX(moveLat);
                window.camera.translateY(moveLon);
                window.camera.translateZ(moveDir);
            }
            else
            {
                controls.moveState.right = moveLat;
                controls.moveState.up = moveLon;
                controls.moveState.back = moveDir;
            }
        }

        updateNavigationControls(enableControls, cam.position);
    }
    else
    {
        message = message + "NOT in airplane mode<br>" + 
            "to fly around, extend all fingers and keep only the index, middle, and ring fingers together - thumb and index stretching out like (backswept) airplane wings";
        if (!manualMovementMode)
            controls.freeze = true;

        updateNavigationControls(false);
    }

    controls.updateMovementVector();

    info.innerHTML = message;
}

frameActions.RegisterAction("NavigateViaNUI", customNUINav);