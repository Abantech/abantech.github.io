/// <reference path="../FrameActions.js" />

function isHandInPlaneMode(hand) {
    return true;
}

frameActions.RegisterAction("NavigateViaNUI",
    function (frame) {
        var hand, pitchAng, yawAng;

        if (frame.hands.length >= 1 ||
            //TODO: make it so that it's either hand
            isHandInPlaneMode(frame.hand[0])) {
            controls.freeze = false;
            hand = frame.hands[0];

            if (hand) {
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
                //} else {
                // yawAng = 0;
                //}

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
                var tmp = (controls.freeze) ? 'class=red' : '';

                //info.innerHTML = info.txt + 'freeze: <scan ' + tmp + '>' + controls.freeze + '</scan> lookSpeed: ' + controls.lookSpeed.toFixed(3) + ' movementSpeed:  ' + controls.movementSpeed +
                //' mouseX: ' + controls.mouseX.toFixed() + ' mouseY: ' + controls.mouseY.toFixed() + '<br>' +
                //'hand.x: ' + hand.stabilizedPalmPosition[0].toFixed(0) + ' hand.y: ' + hand.stabilizedPalmPosition[1].toFixed(0) + ' hand.z: ' + hand.stabilizedPalmPosition[2].toFixed(0) + '<br>' +
                //'pitchAng: ' + pitchAng.toFixed(2) + ' yawAng: ' + yawAng.toFixed(2) ;
            }
        }
        else {
            controls.freeze = true;
        }
    }
);



