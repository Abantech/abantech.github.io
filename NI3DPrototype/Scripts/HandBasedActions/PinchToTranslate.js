// <reference path="../../Libs/THREEJS/three.js" />

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
        var indexTipPos = hand.fingers[1].tipPosition;
        var thumbTipPos = hand.fingers[0].tipPosition;
        //var midPoint = new THREE.Vector3();
        //midPoint.addVectors(indexTipPos, thumbTipPos);
        //midPoint.divideScalar(2);
        pinchedObject.position.set((indexTipPos[0] + thumbTipPos[0]) / 2, (indexTipPos[1] + thumbTipPos[1]) / 2, (indexTipPos[2] + thumbTipPos[2]) / 2);
    }
}

var EndTranslatePinchedObject = function (hand)
{
    if (action)
    {
        action.RegisterTranslation(pinchedObject)
        actionManager.ActionPerformed(action);

        var rotationAction = new RotationAction();

        rotationAction.Initialize(pinchedObject);

        var vector = pinchedObject.position.clone().normalize();
        var camera = window.camera.position.clone().normalize();

        var axis = new THREE.Vector3(vector.x - camera.x, vector.y - camera.y, vector.z - camera.z);
        var angle = Math.PI / 3;

        var quaternion = new THREE.Quaternion();
        quaternion.setFromAxisAngle(axis, angle);

        pinchedObject.quaternion.setFromAxisAngle(axis, angle);

        rotationAction.RegisterRotation(pinchedObject);
        actionManager.ActionPerformed(rotationAction);
    }

    pinchedObject = null;
    action = null;
    console.log("Gesture Ended!")
}

function getPinchedObject(hand)
{
    var indexTipPos = hand.fingers[1].tipPosition;
    var thumbTipPos = hand.fingers[0].tipPosition;
    var pinchMidPos = new THREE.Vector3((indexTipPos[0] + thumbTipPos[0]) / 2, (indexTipPos[1] + thumbTipPos[1]) / 2, (indexTipPos[2] + thumbTipPos[2]) / 2);

    var closestObject = null;

    for (var i = 0; i < window.scene.children.length; i++)
    {
        var sceneObject = window.scene.children[i];
        if (sceneObject.isAsset)
        {
            var distance = mathHelper.DistanceBetweenPoints(pinchMidPos, sceneObject.position);
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