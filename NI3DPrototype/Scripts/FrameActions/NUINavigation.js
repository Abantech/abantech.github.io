/// <reference path="../../Libs/THREEJS/three.min.js" />
/// <reference path="../Controls/FirstPersonControls.js" />
/// <reference path="../FrameActions.js" />

function isHandInAirplaneMode(hand) {
    //Airplane mode = if the index, middle, and ring are together while the thumb and pinky are stretched out
    //TODO: use the tip, pip, and dip positions of the fingers to determine if sufficient angles formed between fingers
    if (typeof (hand) != 'undefined')
        return (hand.indexFinger.extended && hand.middleFinger.extended && hand.ringFinger.extended && !hand.pinky.extended && !hand.thumb.extended);
    else
        return false;
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

var targetPosition;

var navigationPlate;

var initNavigationPlate = function(){
    var geometry = new THREE.CylinderGeometry(100, 100, 2, 32);
    var material = new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 });
    navigationPlate = new THREE.Mesh(geometry, material);

    window.scene.add(navigationPlate);
}

var updateNavigationPlate = function (originPosition) {
    //if (typeof (navigationPlate) == 'undefined') {
    //    var geometry = new THREE.CylinderGeometry(100, 100, 2, 32);
    //    var material = new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 });
    //    navigationPlate = new THREE.Mesh(geometry, material);

    //    window.scene.add(navigationPlate);
    //}
    if (typeof (originPosition) != 'undefined') {
        navigationPlate.position.copy(originPosition);
        navigationPlate.translateY(-20);
        navigationPlate.visible = true;
    }
}

initNavigationPlate();

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

        controls.freeze = !(frame.hands.length >= 1 && isHandInAirplaneMode(hand))

        if (!controls.freeze) {
            message = message + "<br>AIRPLANE MODE DETECTED";

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

            updateNavigationPlate(new THREE.Vector3().fromArray(hand.palmPosition));
        }
    }
    else
    {
        message = message + "<br>Not in airplane mode";
        controls.freeze = true;
        navigationPlate.visible = false
    }

    info.innerHTML = message;
}

frameActions.RegisterAction("NavigateViaNUI", customNUINav);