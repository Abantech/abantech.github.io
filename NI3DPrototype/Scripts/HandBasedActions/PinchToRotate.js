var axis = null;
var rotationAction = null
var snapRotation = false;
var snapAngle;
var canRotateAfterSnap = true;
var lastQuaternion;
var quaternionHistory = new Array(2);
var snapTimeout = 3000;
var rotationAxis = "y"; //Possible Values: x, y, z, relative
var allowRotation = true;

function setSnapAngle(degrees)
{
    snapAngle = degrees * (Math.PI / 180)

    if (snapRotation)
    {
        Speak('Snap angle set to ' + degrees + ' degrees');
    }
}

function toggleSnapping(snapping)
{
    if (snapping === 'on')
    {
        snapRotation = true;
        Speak('Rotation snapping on');
    }

    if (snapping === 'off')
    {
        snapRotation = false;
        Speak('Rotation snapping off');
    }
}

function setRotationAxis(axis)
{
    axis = axis.toLowerCase();

    if (axis === 'x' || axis === 'y' || axis === 'z' || axis === 'relative')
    {
        rotationAxis = axis;
        Speak('Rotation axis set to ' + axis);
    }
}

function toggleRotation(rotation)
{
    if (rotation === 'on' || rotation === 'off')
    {
        allowRotation = (rotation === 'on');
        Speak('Rotation ' + rotation);
    }
}

var RotatePinchedObject = function (hand)
{
    if (allowRotation)
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

                    pinchedObject.userData.rotationOffset = pinchedObject.quaternion.clone();
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
                    var originalQuaternion;

                    if (pinchedObject.userData.rotationOffset)
                    {
                        originalQuaternion = pinchedObject.userData.rotationOffset.clone();
                    }
                    else
                    {
                        originalQuaternion = pinchedObject.quaternion.clone();
                    }

                    var newQuaternion = originalQuaternion.multiply(new THREE.Quaternion().setFromAxisAngle(axis, -1 * angle));

                    if (snapRotation)
                    {
                        if (!pinchedObject.quaternion.equals(newQuaternion))
                        {
                            if (!quaternionHistory[0])
                            {
                                quaternionHistory[0] = pinchedObject.quaternion;
                                quaternionHistory[1] = newQuaternion;
                            }

                            if (quaternionHistory[0].equals(newQuaternion))
                            {
                                if (canRotateAfterSnap)
                                {
                                    quaternionHistory[0] = quaternionHistory[1];
                                    quaternionHistory[1] = newQuaternion;

                                    pinchedObject.quaternion.copy(newQuaternion);
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
                                quaternionHistory[1] = newQuaternion;

                                pinchedObject.quaternion.copy(newQuaternion);

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
                        pinchedObject.quaternion.copy(newQuaternion);
                    }

                    if (DetectCollision(pinchedObject))
                    {
                        pinchedObject.quaternion.copy(originalQuaternion);
                    }
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
        pinchedObject.userData.rotationOffset = pinchedObject.quaternion.clone();

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
