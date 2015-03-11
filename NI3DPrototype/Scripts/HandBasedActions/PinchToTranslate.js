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

            pinchedObject.userData.isPinched = true;
        }
    }
    else
    {
        if (pinchedObject.userData.isAsset && pinchedObject.userData.isPinched)
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