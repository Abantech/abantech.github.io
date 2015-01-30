var ScaleObject = function (hand)
{
    if (!pinchedObject)
    {
        pinchedObject = getPinchedObject(hand);
    }
    else
    {
        var indexTipPos = hand.fingers[1].tipPosition;
        var thumbTipPos = hand.fingers[0].tipPosition;

        var midPoint = new THREE.Vector3((indexTipPos[0] + thumbTipPos[0]) / 2, (indexTipPos[1] + thumbTipPos[1]) / 2, (indexTipPos[2] + thumbTipPos[2]) / 2);

        var startPoition = pinchedObject.position.clone();

        var xScale = midPoint.x / startPoition.x;
        var yScale = midPoint.y / startPoition.y;
        var zScale = midPoint.z / startPoition.z;

            // Set the scalar to the new value
        pinchedObject.parent.parent.scale.set(pinchedObject.parent.parent.scale.x * xScale, pinchedObject.parent.parent.scale.y * yScale, pinchedObject.parent.parent.scale.z * zScale);
    }
}

function getPinchedObject(hand)
{
    var indexTipVector = (new THREE.Vector3()).fromArray(hand.fingers[0].tipPosition);

    var closestObject = null;

    for (var i = 0; i < window.scene.children.length; i++)
    {
        var sceneObject = window.scene.children[i];

        if (sceneObject.isAsset && sceneObject.children.length > 0)
        {
            for (var j = 0; j < sceneObject.children.length; j++)
            {
                if (sceneObject.children[j].isHandles)
                {
                    for (var k = 0; k < sceneObject.children[j].children.length; k++)
                    {
                        var distance = mathHelper.DistanceBetweenPoints(indexTipVector, sceneObject.children[j].children[k].position);

                        if (distance < 50)
                        {
                            if (closestObject)
                            {
                                if (distance < closestObject.distance)
                                {
                                    closestObject = sceneObject.children[j].children[k];
                                    closestObject.distance = distance;
                                }
                            }
                            else
                            {
                                closestObject = sceneObject.children[j].children[k];
                                closestObject.distance = distance;
                            }
                        }
                    }
                }
            }
        }
    }

    return closestObject;
}

rightHandPinchGesture.registerOnFullGesture(
            {
                func: ScaleObject
            });