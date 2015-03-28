var axis = null;
var rotationAction = null
var snapRotation = true;
var snapAngle;
var canRotateAfterSnap = true;
var lastQuaternion;
var quaternionHistory = new Array(2);
var snapTimeout = 3000;
var rotationAxis = "y"; //Possible Values: x, y, z, relative

function setSnapAngle(degrees)
{
    snapAngle = degrees * (Math.PI / 180)
}

var RotatePinchedObject = function (hand)
{
    if (!pinchedObject)
    {
        pinchedObject = getPinchedObject(hand);

        if (pinchedObject && pinchedObject.userData.isAsset)
        {
            if (!rotationAction)
            {
                rotationAction = new RotationAction();

                rotationAction.Initialize(pinchedObject);
                pinchedObject.userData.isPinched = true;
            }
        }
    }
    else
    {
        if (pinchedObject && pinchedObject.userData.isAsset)
        {
            if (!rotationAction)
            {
                rotationAction = new RotationAction();

                rotationAction.Initialize(pinchedObject);
                pinchedObject.userData.isPinched = true;
            }

            var angle = null;

            if (snapRotation)
            {
                angle = hand.roll() - hand.roll() % snapAngle;
            }
            else
            {
                angle = hand.roll();
            }

            var indexTipPos = hand.fingers[1].tipPosition;
            var thumbTipPos = hand.fingers[0].tipPosition;

            var midPoint = new THREE.Vector3((indexTipPos[0] + thumbTipPos[0]) / 2, (indexTipPos[1] + thumbTipPos[1]) / 2, (indexTipPos[2] + thumbTipPos[2]) / 2);
            var camera = window.camera.position.clone();

            if (!axis)
            {
                switch (rotationAxis)
                {
                    case 'x':
                        {
                            axis = new THREE.Vector3(1, 0, 0);
                            break;
                        }
                    case 'y':
                        {
                            axis = new THREE.Vector3(0, 1, 0);
                            break;
                        }
                    case 'z':
                        {
                            axis = new THREE.Vector3(0, 0, 1);
                            break;
                        }
                    case 'relative':
                        {
                            axis = new THREE.Vector3(midPoint.x - camera.x, midPoint.y - camera.y, midPoint.z - camera.z).normalize();
                            break;
                        }
                }
            }

            if (angle != null)
            {
                var quaternion = new THREE.Quaternion();
                quaternion.setFromAxisAngle(axis, -1 * angle);

                if (snapRotation)
                {
                    if (!pinchedObject.quaternion.equals(quaternion))
                    {
                        if (!quaternionHistory[0])
                        {
                            quaternionHistory[0] = pinchedObject.quaternion;
                            quaternionHistory[1] = quaternion;
                        }

                        if (quaternionHistory[0].equals(quaternion))
                        {
                            if (canRotateAfterSnap)
                            {
                                quaternionHistory[0] = quaternionHistory[1];
                                quaternionHistory[1] = quaternion;

                                pinchedObject.quaternion.setFromAxisAngle(axis, -1 * angle);
                                canRotateAfterSnap = false;

                                setTimeout(function ()
                                {
                                    canRotateAfterSnap = true;
                                }, snapTimeout);
                            }
                        }
                        else
                        {
                            quaternionHistory[0] = quaternionHistory[1];
                            quaternionHistory[1] = quaternion;

                            pinchedObject.quaternion.setFromAxisAngle(axis, -1 * angle);

                            canRotateAfterSnap = false;

                            setTimeout(function ()
                            {
                                canRotateAfterSnap = true;
                            }, snapTimeout);
                        }
                    }
                }
                else
                {
                    pinchedObject.quaternion.setFromAxisAngle(axis, -1 * angle);
                }
            }
        }
    }
}

var EndRotatePinchedObject = function (hand)
{
    if (rotationAction)
    {
        rotationAction.RegisterRotation(pinchedObject)
        actionManager.ActionPerformed(rotationAction);
        rotationAction = null;

        if (pinchedObject)
        {
            pinchedObject.geometry.computeBoundingBox();

            pinchedObject.userData.isPinched = false;
        }
    }

    axis = null;
}

setSnapAngle(30);

rightHandPinchGesture.registerOnFullGesture(
    {
        func: RotatePinchedObject
    });

rightHandPinchGesture.registerOnFullGestureEnd(
{
    func: EndRotatePinchedObject
});

leftHandPinchGesture.options.distance = 40;

leftHandPinchGesture.registerOnFullGesture(
{
    func: RotatePinchedObject
});

leftHandPinchGesture.registerOnFullGestureEnd(
    {
        func: EndRotatePinchedObject
    });
