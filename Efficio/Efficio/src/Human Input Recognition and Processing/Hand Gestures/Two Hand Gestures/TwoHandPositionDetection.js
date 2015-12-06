define(['postal', 'Human Input Recognition and Processing/Hand Gestures/Helpers/FingerHelper', 'Helpers/Math'], function (bus, fh, math) {
    var source = 'Efficio Gesture Grimoire';
    var dictionary = 'TwoHandPosition';
    var FireCountMinimum = 15;
    var trackingType = 'Hands';
    var twoHandsGestureDetector;
    var ActiveGesturesDictionary;

    function BothHandsNeutral(data) {
        var hands = data.Input.hands;
        var gestureName = 'BothHandsNeutral'

        if (hands[0].IsNeutral() && hands[1].IsNeutral()) {
            var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName, dictionary);

            if (gestureInformation.FireCount > FireCountMinimum) {
                gestureInformation.distance = math.DistanceBetweenTwoPoints(hands[0].palmPosition, hands[1].palmPosition);
                gestureInformation.midpoint = math.MidpointBetweenTwoPoints(hands[0].palmPosition, hands[1].palmPosition);

                bus.publish({
                    channel: "Input.Processed.Efficio",
                    topic: gestureName,
                    source: source,
                    data: {
                        input: data,
                        hand: hand,
                        gestureInformation: gestureInformation
                    }
                });
            }
        }
        else {
            ActiveGesturesDictionary.DeleteEntry(trackingType, gestureName, dictionary);
        }
    };// END Both Hands Neutral

    function BothHandsProne(data) {
        var hands = data.Input.hands;
        var gestureName = 'BothHandsProne'

        if (hands[0].IsProne() && hands[1].IsProne()) {
            var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName, dictionary);

            if (gestureInformation.FireCount > FireCountMinimum) {
                gestureInformation.distance = math.DistanceBetweenTwoPoints(hands[0].palmPosition, hands[1].palmPosition);
                gestureInformation.midpoint = math.MidpointBetweenTwoPoints(hands[0].palmPosition, hands[1].palmPosition);

                bus.publish({
                    channel: "Input.Processed.Efficio",
                    topic: gestureName,
                    source: source,
                    data: {
                        input: data,
                        hand: hands,
                    }
                });
            }
        }
        else {
            ActiveGesturesDictionary.DeleteEntry(trackingType, gestureName, dictionary);
        }
    };// END Both Hand Pronation

    function BothHandsSupine(data) {
        var hands = data.Input.hands;
        var gestureName = 'BothHandsSupine'

        if (hands[0].IsSupine() && hands[1].IsSupine()) {
            var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName, dictionary);

            if (gestureInformation.FireCount > FireCountMinimum) {
                gestureInformation.distance = math.DistanceBetweenTwoPoints(hands[0].palmPosition, hands[1].palmPosition);
                gestureInformation.midpoint = math.MidpointBetweenTwoPoints(hands[0].palmPosition, hands[1].palmPosition);

                bus.publish({
                    channel: "Input.Processed.Efficio",
                    topic: gestureName,
                    source: source,
                    data: {
                        input: data,
                        hand: hands,
                    }
                });
            }
        }
        else {
            ActiveGesturesDictionary.DeleteEntry(trackingType, gestureName, dictionary);
        }
    };

    function LeftHandSupineRightHandProne(data) {
        var hands = data.Input.hands;
        var gestureName = 'LeftHandSupineRightHandProne'

        if (hands[0].IsSupine() && hands[1].IsProne()) {
            var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName, dictionary);

            if (gestureInformation.FireCount > FireCountMinimum) {
                gestureInformation.distance = math.DistanceBetweenTwoPoints(hands[0].palmPosition, hands[1].palmPosition);
                gestureInformation.midpoint = math.MidpointBetweenTwoPoints(hands[0].palmPosition, hands[1].palmPosition);

                bus.publish({
                    channel: "Input.Processed.Efficio",
                    topic: gestureName,
                    source: source,
                    data: {
                        input: data,
                        hand: hands,
                    }
                });
            }
        }
        else {
            ActiveGesturesDictionary.DeleteEntry(trackingType, gestureName, dictionary);
        }
    };

    function RightHandsSupineLeftHandProne(data) {
        var hands = data.Input.hands;
        var gestureName = 'RightHandsSupineLeftHandProne'

        if (hands[0].IsProne() && hands[1].IsSupine()) {
            var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName, dictionary);

            if (gestureInformation.FireCount > FireCountMinimum) {
                gestureInformation.distance = math.DistanceBetweenTwoPoints(hands[0].palmPosition, hands[1].palmPosition);
                gestureInformation.midpoint = math.MidpointBetweenTwoPoints(hands[0].palmPosition, hands[1].palmPosition);

                bus.publish({
                    channel: "Input.Processed.Efficio",
                    topic: gestureName,
                    source: source,
                    data: {
                        input: data,
                        hand: hands,
                    }
                });
            }
        }
        else {
            ActiveGesturesDictionary.DeleteEntry(trackingType, gestureName, dictionary);
        }
    };

    function ProcessInput(data, agd) {
        ActiveGesturesDictionary = agd;

        if (!twoHandsGestureDetector) {
            twoHandsGestureDetector = {
                Name: name,
                Gestures: {
                    BothHandsNeutral: BothHandsNeutral,
                    BothHandsProne: BothHandsProne,
                    BothHandsSupine: BothHandsSupine,
                    LeftHandSupineRightHandProne: LeftHandSupineRightHandProne,
                    RightHandSupineLeftHandProne: RightHandSupineLeftHandProne
                }
            };
        }


        for (var gesture in twoHandsGestureDetector.Gestures) {
            twoHandsGestureDetector.Gestures[gesture](data);
        }

        return twoHandsGestureDetector;
    }

    return {
        ProcessInput: ProcessInput
    }
});