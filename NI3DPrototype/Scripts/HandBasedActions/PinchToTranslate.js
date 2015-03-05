// <reference path="../../Libs/THREEJS/three.js" />

var TranslatePinchedObject = function (hand)
{
    if (!pinchedObject)
    {
        pinchedObject = getPinchedObject(hand);

        if (pinchedObject && pinchedObject.userData.isAsset)
        {
            if (!action)
            {
                action = new TranslationAction();

                action.Initialize(pinchedObject);

                playAudioFeedback("effect");
            }
        }
    }
    else
    {
        if (pinchedObject.userData.isAsset)
        {
            var indexTipPos = hand.fingers[1].tipPosition;
            var thumbTipPos = hand.fingers[0].tipPosition;
            pinchedObject.position.set((indexTipPos[0] + thumbTipPos[0]) / 2, (indexTipPos[1] + thumbTipPos[1]) / 2, (indexTipPos[2] + thumbTipPos[2]) / 2);
            pinchedObject.userData.isPinched = true;
            pinchedObject.userData.hasBeenMoved = true;
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
        pinchedObject.userData.isPinched = false;
        pinchedObject.userData.hasBeenMoved = false;
    }
}

function getPinchedObject(hand)
{
    var indexTipPos = hand.fingers[1].tipPosition;
    var thumbTipPos = hand.fingers[0].tipPosition;
    var pinchMidPos = new THREE.Vector3((indexTipPos[0] + thumbTipPos[0]) / 2, (indexTipPos[1] + thumbTipPos[1]) / 2, (indexTipPos[2] + thumbTipPos[2]) / 2);

    var direction = new THREE.Vector3().subVectors(indexTipPos, thumbTipPos).normalize();
    //.fingers[0].tipPosition;

    var rayCaster = new THREE.Raycaster(hand.fingers[1].tipPosition, direction, 0, direction.length());
    var closestObject = null;

    for (var i = 0; i < window.scene.children.length; i++)
    {
        var sceneObject = window.scene.children[i];
        if (rayCaster.intersectObject(sceneObject))
        {
            return sceneObject;
        }

        if (sceneObject.userData.isAsset && !assetManager.IsSelectedAsset(sceneObject))
        {
            var distance = pinchMidPos.distanceTo(sceneObject.position);
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


var firstPinch = true;
function showHelpMeunOnBeginPinch()
{
    if (showHelp && firstPinch && !$("#infoBox").dialog("isOpen"))
    {
        $("#infoBox").text("You have made the pinching gesture! The pinching gesture can be used to move objects around the scene, as well as rotate them.")
        $("#infoBox").dialog("open");
        firstPinch = false;

        setTimeout(function ()
        {
            $("#infoBox").dialog("close");
        }, 6000);
    }
}

rightHandPinchGesture.registerOnGestureBegin(
    {
        func: showHelpMeunOnBeginPinch
    });

rightHandPinchGesture.registerOnFullGestureEnd(
    {
        func: EndTranslatePinchedObject
    });

rightHandPinchGesture.registerOnFullGesture(
    {
        func: TranslatePinchedObject
    });