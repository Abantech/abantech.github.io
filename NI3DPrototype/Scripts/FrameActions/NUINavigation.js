/// <reference path="../FrameActions.js" />

function isHandInAirplaneMode(hand) {
    //Airplane mode = if the index, middle, and ring are together while the thumb and pinky are stretched out
    //TODO: use the tip, pip, and dip positions of the fingers to determine if sufficient angles formed between fingers
    return true;
}

frameActions.RegisterAction("NavigateViaNUI",
    function (frame) {
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
);