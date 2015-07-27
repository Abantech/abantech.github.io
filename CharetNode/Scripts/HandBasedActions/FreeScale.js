var pinchedObjectDistance;
var originalScale;

var ScaleObject = function (hand)
{
    if (!pinchedObject)
    {
        //playAudioFeedback("effect");
        pinchedObject = getPinchedObjectForScale(hand);
    }
    else
    {
        if (pinchedObject.userData.isArrow)
        {
            var xScale = 1;
            var yScale = 1;
            var zScale = 1;

            var indexTipPos = hand.fingers[1].tipPosition;
            var thumbTipPos = hand.fingers[0].tipPosition;

            var midPoint = new THREE.Vector3((indexTipPos[0] + thumbTipPos[0]) / 2, (indexTipPos[1] + thumbTipPos[1]) / 2, (indexTipPos[2] + thumbTipPos[2]) / 2);

            if (!pinchedObjectDistance)
            {
                pinchedObjectDistance = pinchedObject.distance;
            }

            if (!originalScale)
            {
                originalScale = pinchedObject.parent.parent.scale.clone();
            }

            switch (pinchedObject.name)
            {
                case "XArrow":
                    {
                        var objectCenterX = pinchedObject.position.x;
                        xScale = (midPoint.x - objectCenterX) / (pinchedObjectDistance - objectCenterX);
                        break;
                    }
                case "YArrow":
                    {
                        var objectCenterX = pinchedObject.position.y;
                        yScale = (midPoint.y - objectCenterX) / (pinchedObjectDistance - objectCenterX);
                        break;
                    }
                case "ZArrow":
                    {
                        var objectCenterX = pinchedObject.position.z;
                        zScale = (midPoint.z - objectCenterX) / (pinchedObjectDistance - objectCenterX);
                        break;
                    }
            }

            pinchedObject.line.material.color = new THREE.Color([255, 215, 0]);
            pinchedObject.cone.material.color = new THREE.Color([255, 215, 0])

            for (var i = 0; i < pinchedObject.parent.children.length; i++)
            {
                if (pinchedObject.parent.children[i].uuid != pinchedObject.uuid)
                {
                    pinchedObject.parent.children[i].visible = false;
                }
            }
            

            // Set the scalar to the new value
            if (xScale > 0 && yScale > 0 && zScale > 0)
            {
                if (pinchedObject.parent.parent)
                {
                    pinchedObject.parent.parent.scale.set(originalScale.x * xScale, originalScale.y * yScale, originalScale.z * zScale);
                }
            }

        }
    }
}

var OnEndScaledObject = function (hand)
{
    if (pinchedObject && pinchedObject.userData.isArrow)
    {
        var parent = pinchedObject.parent.parent;

        if (parent)
        {
            parent.remove(pinchedObject.parent);

            parent.AddHandlesToAsset();
        }
    }
}

function getPinchedObjectForScale(hand)
{
    var indexTipVector = (new THREE.Vector3()).fromArray(hand.fingers[0].tipPosition);

    var closestObject = null;

    for (var i = 0; i < window.scene.children.length; i++)
    {
        var sceneObject = window.scene.children[i];

        if (sceneObject.userData.isAsset && sceneObject.children.length > 0)
        {
            for (var j = 0; j < sceneObject.children.length; j++)
            {
                if (sceneObject.children[j].isArrows)
                {
                    for (var k = 0; k < sceneObject.children[j].children.length; k++)
                    {
                        var position = new THREE.Vector3();
                        position.setFromMatrixPosition(sceneObject.children[j].children[k].cone.matrixWorld);
                        var distance = indexTipVector.distanceTo(position);

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

rightHandPinchGesture.registerOnFullGestureEnd(
        {
            func: OnEndScaledObject
        });