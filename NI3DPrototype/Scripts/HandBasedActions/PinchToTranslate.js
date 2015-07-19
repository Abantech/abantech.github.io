// <reference path="../../Libs/THREEJS/three.js" />

// Can be boolean, a number, or a function that returns a vector3;
var snap = 0.1;

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

            pinchedObject.userData.isPinched = true;
        }
    }
    else
    {
        if (pinchedObject.userData.isAsset && pinchedObject.userData.isPinched)
        {
            var indexTipPos = hand.fingers[1].tipPosition;
            var thumbTipPos = hand.fingers[0].tipPosition;

            var originalPosition = pinchedObject.position.clone();
            var proposedPos = new THREE.Vector3((indexTipPos[0] + thumbTipPos[0]) / 2, (indexTipPos[1] + thumbTipPos[1]) / 2, (indexTipPos[2] + thumbTipPos[2]) / 2);
            var newPos = GetTranslationVector(originalPosition, proposedPos, snap);

            pinchedObject.position.set(newPos.x - 20, newPos.y - 90, newPos.z);

            if (DetectCollision(pinchedObject))
            {
                pinchedObject.position.set(originalPosition.x, originalPosition.y, originalPosition.z);
            }

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

var firstPinch = true;
function showHelpMeunOnBeginPinch()
{
    if (showHelp && firstPinch)
    {
        var utterance = new SpeechSynthesisUtterance("You have made the pinching gesture! The pinching gesture can be used to move objects around the scene, as well as rotate them.");
        speechSynthesis.speak(utterance);
        firstPinch = false;
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

function GetTranslationVector(currentPosition, proposedPosition, snap)
{
    var returnedVector = currentPosition.clone();

    //  Checks if the snap variable exists. If not, it will assume that snapping is not enabled.
    if (snap)
    {
        // Checks if snap is a boolean. If it is, it uses the default snap value (Here it is 10).
        if (typeof snap === 'boolean')
        {
            snap = 10;
        }

        // If a custom snapping function is passed in, we execute that custom function.
        if (typeof snap === 'function')
        {
            returnedVector = snap(currentPosition, proposedPosition);
        }
        else
        {
            if (typeof snap !== 'number')
            {
                throw new Exception('Snap value must be of type "number"');
            }

            // Checks if the distance difference on the x-axis is greater than the snap distance.
            if (Math.abs(currentPosition.x - proposedPosition.x) > snap)
            {
                // Returns the position moved on the x-axis by the closest snap distance.
                returnedVector.x = (proposedPosition.x - (proposedPosition.x % snap));
            }

            // Checks if the distance difference on the y-axis is greater than the snap distance.
            if (Math.abs(currentPosition.y - proposedPosition.y) > snap)
            {
                // Returns the position moved on the y-axis by the closest snap distance.
                returnedVector.y = (proposedPosition.y - (proposedPosition.y % snap));
            }

            // Checks if the distance difference on the z-axis is greater than the snap distance.
            if (Math.abs(currentPosition.z - proposedPosition.z) > snap)
            {
                // Returns the position moved on the z-axis by the closest snap distance.
                returnedVector.z = (proposedPosition.z - (proposedPosition.z % snap));
            }
        }
    }
    else
    {
        returnedVector = proposedPosition.clone();
    }

    return returnedVector;
}