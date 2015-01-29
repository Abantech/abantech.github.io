var axis = null;
var rotationAction = null;

var RotatePinchedObject = function (hand)
{
    if (!pinchedObject)
    {
        pinchedObject = getPinchedObject(hand);

        if (pinchedObject)
        {
            if (!rotationAction)
            {
                rotationAction = new RotationAction();

                rotationAction.Initialize(pinchedObject);
            }
        }
    }
    else
    {
        var indexTipPos = hand.fingers[1].tipPosition;
        var thumbTipPos = hand.fingers[0].tipPosition;

        var midPoint = new THREE.Vector3((indexTipPos[0] + thumbTipPos[0]) / 2, (indexTipPos[1] + thumbTipPos[1]) / 2, (indexTipPos[2] + thumbTipPos[2]) / 2);
        var camera = window.camera.position.clone();

        if (!axis)
        {
            axis = new THREE.Vector3(midPoint.x - camera.x, midPoint.y - camera.y, midPoint.z - camera.z).normalize();
        }

        var angle = hand.roll();

        pinchedObject.quaternion.setFromAxisAngle(axis, -1 * angle);
    }
}

var EndRotatePinchedObject = function (hand)
{
    if (rotationAction)
    {
        rotationAction.RegisterRotation(pinchedObject)
        actionManager.ActionPerformed(rotationAction);
    }

    axis = null;
    pinchedObject = null;
    rotationAction = null;
}

function getPinchedObject(hand)
{
    var indexTipVector = (new THREE.Vector3()).fromArray(hand.fingers[0].tipPosition);

    var closestObject = null;

    for (var i = 0; i < window.scene.children.length; i++)
    {
        var sceneObject = window.scene.children[i];
        if (sceneObject.isAsset)
        {
            var distance = mathHelper.DistanceBetweenPoints(indexTipVector, sceneObject.position);
            if (distance < 50)
            {
                if (closestObject)
                {
                    if (distance < closestObject.distance)
                    {
                        closestObject = sceneObject;
                        closestObject.distance = distance;
                    }
                }
                else
                {
                    closestObject = sceneObject;
                    closestObject.distance = distance;
                }
            }
        }
    }

    return closestObject;
}