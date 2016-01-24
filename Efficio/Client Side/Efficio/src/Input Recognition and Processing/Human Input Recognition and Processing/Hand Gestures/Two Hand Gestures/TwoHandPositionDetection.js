define(['postal', 'Helpers/Math'], function (bus, math) {
    var source = 'Efficio Gesture Grimoire';
    var dictionary = 'TwoHandPosition';
    var trackingType = 'Hands';
    var twoHandsGestureDetector;
    var ActiveGesturesDictionary = Efficio.InputAndGestureRecognition.ActiveGesturesDictionary;

    function BothHandsNeutral(data) {
        var hands = data.Hands;
        var gestureName = 'BothHandsNeutral'

        if (hands[0].IsNeutral() && hands[1].IsNeutral()) {
            var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName, dictionary);

            gestureInformation.Distance = math.DistanceBetweenTwoPoints(hands[0].palmPosition, hands[1].palmPosition);
            gestureInformation.DistanceX = math.DistanceBetweenTwoPoints(hands[0].palmPosition[0], hands[1].palmPosition[0]);
            gestureInformation.DistanceY = math.DistanceBetweenTwoPoints(hands[0].palmPosition[1], hands[1].palmPosition[1]);
            gestureInformation.DistanceZ = math.DistanceBetweenTwoPoints(hands[0].palmPosition[2], hands[1].palmPosition[2]);
            gestureInformation.Midpoint = math.MidpointBetweenTwoPoints(hands[0].palmPosition, hands[1].palmPosition);

            bus.publish({
                channel: "Input.Processed.Efficio",
                topic: gestureName,
                source: source,
                data: {
                    Input: data,
                    Hands: hands,
                    GestureInformation: gestureInformation
                }
            });
        }
        else {
            ActiveGesturesDictionary.DeleteEntry(trackingType, gestureName, dictionary);
        }
    };// END Both Hands Neutral

    function BothHandsPronation(data) {
        var hands = data.Hands;
        var gestureName = 'BothHandsPronation'

        if (hands[0].IsProne() && hands[1].IsProne()) {
            var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName, dictionary);

            gestureInformation.Distance = math.DistanceBetweenTwoPoints(hands[0].palmPosition, hands[1].palmPosition);
            gestureInformation.DistanceX = math.DistanceBetweenTwoPoints(hands[0].palmPosition[0], hands[1].palmPosition[0]);
            gestureInformation.DistanceY = math.DistanceBetweenTwoPoints(hands[0].palmPosition[1], hands[1].palmPosition[1]);
            gestureInformation.DistanceZ = math.DistanceBetweenTwoPoints(hands[0].palmPosition[2], hands[1].palmPosition[2]);
            gestureInformation.Midpoint = math.MidpointBetweenTwoPoints(hands[0].palmPosition, hands[1].palmPosition);

            bus.publish({
                channel: "Input.Processed.Efficio",
                topic: gestureName,
                source: source,
                data: {
                    Input: data,
                    Hands: hands,
                    GestureInformation: gestureInformation
                }
            });
        }
        else {
            ActiveGesturesDictionary.DeleteEntry(trackingType, gestureName, dictionary);
        }
    };// END Both Hand Pronation

    function ProcessInput(data) {

        if (!twoHandsGestureDetector) {
            twoHandsGestureDetector = {
                Name: name,
                Gestures: {
                    BothHandsNeutral: BothHandsNeutral,
                    BothHandsPronation: BothHandsPronation
                }
            };
        }


        for (gesture in twoHandsGestureDetector.Gestures) {
            twoHandsGestureDetector.Gestures[gesture](data);
        }

        return twoHandsGestureDetector;
    }

    return {
        ProcessInput: ProcessInput
    }
});