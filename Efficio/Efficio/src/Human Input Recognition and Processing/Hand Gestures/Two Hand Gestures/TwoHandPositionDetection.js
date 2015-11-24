define(['postal', 'Human Input Recognition and Processing/Hand Gestures/Helpers/HandHelper', 'Human Input Recognition and Processing/Hand Gestures/Helpers/FingerHelper', 'Helpers/Math'], function (bus, hh, fh, math) {
    function ProcessInput(data, hands, ActiveGesturesDictionary) {

        var source = 'Efficio Gesture Grimoire';
        var dictionary = 'TwoHandPosition';
        var FireCountMinimum = 15;

        (function BothHandsNeutral() {
            var gestureName = 'BothHandsNeutral'
            var neutrals = [hh.Neutral(hands[0]), hh.Neutral(hands[1])]

            if (neutrals[0] && neutrals[1]) {
                var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(gestureName, dictionary);

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
                            neutrals: neutrals,
                            gestureInformation: gestureInformation
                        }
                    });
                }
            }
            else {
                ActiveGesturesDictionary.DeleteEntry(gestureName, dictionary);
            }
        })();// END Both Hands Neutral

        (function BothHandsPronation() {
            var gestureName = 'BothHandsPronation'
            var pronations = [hh.Pronation(hands[0]), hh.Pronation(hands[1])]

            if (pronations[0] && pronations[1]) {
                var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(gestureName, dictionary);

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
                            neutrals: pronations,
                        }
                    });
                }
            }
            else {
                ActiveGesturesDictionary.DeleteEntry(gestureName, dictionary);
            }
        })();// END Both Hand Pronation
    }

    return {
        ProcessInput: ProcessInput
    }
});