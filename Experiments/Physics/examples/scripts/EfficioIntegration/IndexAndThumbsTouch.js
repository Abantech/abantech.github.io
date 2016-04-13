var IndexAndThumbsTouch = function (data) {
    var hands = data.Hands;
    var gestureName = 'IndexAndThumbsTouch'

    if (hands[0].fingers[0].DistanceToFinger(hands[1].fingers[0]) < 15 && hands[0].fingers[1].DistanceToFinger(hands[1].fingers[1])) {
        var gestureInformation = Efficio.InputAndGestureRecognition.ActiveGesturesDictionary.CreateOrUpdateEntry('Hands', gestureName, 'TwoHandPosition');

        Efficio.MessagingSystem.publish({
            channel: "Input.Processed.Efficio",
            topic: gestureName,
            source: 'My Custom Gesture',
            data: {
                GestureInformation: gestureInformation,
                Hands: hands
            }
        });
    }
    else {
        Efficio.InputAndGestureRecognition.ActiveGesturesDictionary.DeleteEntry('Hands', gestureName, 'TwoHandPosition');
    }
}

AttachGesture();


function AttachGesture() {
    if (typeof(Efficio) === 'undefined' || !Efficio.IsReady || !Efficio.InputAndGestureRecognition || !Efficio.InputAndGestureRecognition.HumanInputRecognitionAndProcessing || !Efficio.InputAndGestureRecognition.HumanInputRecognitionAndProcessing.EfficioGestureGrimoire || !Efficio.InputAndGestureRecognition.HumanInputRecognitionAndProcessing.EfficioGestureGrimoire.HandProcessor || !Efficio.InputAndGestureRecognition.HumanInputRecognitionAndProcessing.EfficioGestureGrimoire.HandProcessor.TwoHandPositionDetector) {
        setTimeout(AttachGesture, 200);
    }
    else {
        Efficio.InputAndGestureRecognition.HumanInputRecognitionAndProcessing.EfficioGestureGrimoire.HandProcessor.TwoHandPositionDetector.Gestures["IndexAndThumbsTouch"] = IndexAndThumbsTouch;
    }
}