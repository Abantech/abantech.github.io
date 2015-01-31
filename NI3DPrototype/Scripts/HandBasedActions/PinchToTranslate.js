// <reference path="../../Libs/THREEJS/three.js" />

var TranslatePinchedObject = function (hand)
{
    if (!pinchedObject)
    {
        pinchedObject = getPinchedObject(hand);

        if (pinchedObject && pinchedObject.isAsset)
        {
            if (!action)
            {
                action = new TranslationAction();

                action.Initialize(pinchedObject);
            }
        }
    }
    else
    {
        if (pinchedObject.isAsset)
        {
            var indexTipPos = hand.fingers[1].tipPosition;
            var thumbTipPos = hand.fingers[0].tipPosition;
            pinchedObject.position.set((indexTipPos[0] + thumbTipPos[0]) / 2, (indexTipPos[1] + thumbTipPos[1]) / 2, (indexTipPos[2] + thumbTipPos[2]) / 2);
            pinchedObject.isPinched = true;
            pinchedObject.hasBeenMoved = true;
        }
    }
}

var EndTranslatePinchedObject = function (hand)
{
    if (action)
    {
        action.RegisterTranslation(pinchedObject)
        actionManager.ActionPerformed(action);
        action = null;
    }

    if (pinchedObject)
    {
        pinchedObject.isPinched = false;
        pinchedObject.hasBeenMoved = false;
    }
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
        if (sceneObject.isAsset && !sceneObject.isSelected)
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

rightHandPinchGesture.registerOnFullGestureEnd(
    {
        func: EndTranslatePinchedObject
    });

rightHandPinchGesture.registerOnFullGesture(
    {
        func: TranslatePinchedObject
    });