/// <reference path="../../Libs/THREEJS/three.min.js" />
/// <reference path="../Controls/FirstPersonControls.js" />
/// <reference path="../FrameActions.js" />

var fingerAdjacencyAngleThreshold = 12

function isHandInAirplaneMode(hand) {
    //Airplane mode = if the index, middle, and ring are together while the thumb and pinky are stretched out
    //TODO: use the tip, pip, and dip positions of the fingers to determine if sufficient angles formed between fingers
    if (typeof (hand) != 'undefined')
        //hand.indexFinger
        //return (hand.indexFinger.extended && hand.middleFinger.extended && hand.ringFinger.extended && !hand.pinky.extended && !hand.thumb.extended);
        return (
            //hand.thumb.extended && hand.indexFinger.extended && hand.middleFinger.extended && hand.ringFinger.extended && hand.pinky.extended &&
            fingersExtendedAndAdjacent(hand.indexFinger, hand.middleFinger) &&
            fingersExtendedAndAdjacent(hand.middleFinger, hand.ringFinger) &&
            !fingersExtendedAndAdjacent(hand.thumb, hand.indexFinger) &&
            !fingersExtendedAndAdjacent(hand.ringFinger, hand.pinky)
            //hand.indexFinger.angleToFinger(hand.middleFinger) < fingerAdjacencyAngleThreshold &&
                //hand.middleFinger.angleToFinger(hand.ringFinger) < fingerAdjacencyAngleThreshold //&&
                //hand.indexFinger.angleToFinger(hand.thumb) > 9 &&
                //hand.ringFinger.angleToFinger(hand.pinky) > 9
            )
    else
        return false;
}

var fingersExtendedAndAdjacent = function (finger1, finger2)
{
    return finger1.extended && finger2.extended && finger1.angleToFinger(finger2) < fingerAdjacencyAngleThreshold;
}



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
        var geometry = new THREE.CylinderGeometry(100, 100, 2, 32);
        var material = new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 });
        navigationPlate = new THREE.Mesh(geometry, material);

        window.scene.add(navigationPlate);
    }

    if (originPosition)
    { 
        navigationPlate.position.copy(originPosition);
        navigationPlate.translateY(-20);
    }

    navigationPlate.visible = makeVisible;
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
        //controls.freeze = !enableControls

        if (enableControls) {

            //var camPosition = cam.position;
            navigationStartPosition = new THREE.Vector3(cam.position.x, cam.position.y - 20, cam.position.z - 200)
            updateNavigationControls(cam.position, true);

            var handOrigin = new THREE.Vector3().fromArray(hand.palmPosition);
            var moveSpeedDamping = 1;

            var moveLat = getLateralDistanceSegment(handOrigin, navigationStartPosition) * moveSpeedDamping;
            var moveLon = getLongitudinalDistanceSegment(handOrigin, navigationStartPosition) * moveSpeedDamping;
            var moveDir = getDirectionalDistanceSegment(handOrigin, navigationStartPosition) * moveSpeedDamping;

            message = message + "<br>AIRPLANE MODE DETECTED" 
                + "<br>" + 
                "Segments (lat, long, dist) = (" +
                moveLat
                + ", " +
                moveLon
                + ", " +
                moveDir
                + ")"

            window.camera.translateX(moveLat);
            window.camera.translateY(moveLon);
            window.camera.translateZ(moveDir);
            
            //set the start sphere here

            //cam.translateX(-1)
            controls.moveLeft = true;
            controls.moveBackward = true;
            //controls.lon -= 0.5;
            //targetPosition = new THREE.Vector3(cam.position.x, cam.position.y + 50, cam.position.z + 50);
            //controls.freeze = false;
            //controls.moveLeft = true;
            //cam.translateX(-0.3) //look left and right
            //cam.translateZ(-0.5)
            //window.camera.rotate
            //var temp = new THREE.Object3D();
            //var newAngle = cam.rotation.x + 1;
            //cam.lookAt(targetPosition);

            //cam.rotation.x = cam.rotation.x + 1;
            //cam.

            //updateNavigationPlate(new THREE.Vector3().fromArray(hand.palmPosition));
            
        }
    }
    else
    {
        message = message + "NOT in airplane mode<br>" + 
            "to fly around, extend all fingers and keep only the index, middle, and ring fingers together - thumb and index stretching out like (backswept) airplane wings";
        controls.freeze = true;
        updateNavigationControls(false);
        //navigationPlate.visible = false
    }

    info.innerHTML = message;
}

frameActions.RegisterAction("NavigateViaNUI", customNUINav);