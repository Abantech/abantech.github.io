var TranslatePinchedObject = function (hand)
{
    if (!pinchedObject)
    {
        pinchedObject = getPinchedObject(hand);

        if (pinchedObject)
        {
            if (!action)
            {
                action = new TranslationAction();

                action.Initialize(pinchedObject);
            }

            console.log("Pinching something!")
        }
    }
    else
    {
        var tipPos = hand.fingers[0].tipPosition;
        pinchedObject.position.set(tipPos[0], tipPos[1], tipPos[2]);
    }
}

var EndTranslatePinchedObject = function (hand)
{
    if (action)
    {
        action.RegisterTranslation(pinchedObject)
        actionManager.ActionPerformed(action);

        //var vector = pinchedObject.position.clone().normalize();
        //var camera = window.camera.position.clone().normalize();

        //var axis = new THREE.Vector3(vector.x - camera.x, vector.y - camera.y, vector.z - camera.z);
        //var angle = Math.PI / 4;

        //var quaternion = new THREE.Quaternion();
        //quaternion.setFromAxisAngle(axis, angle);

        //pinchedObject.quaternion.setFromAxisAngle(axis, angle);
    }

    pinchedObject = null;
    action = null;
    console.log("Gesture Ended!")
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