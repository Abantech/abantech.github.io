define(['postal', 'Human Input Recognition and Processing/Hand Gestures/Helpers/HandHelper', 'Human Input Recognition and Processing/Hand Gestures/Helpers/FingerHelper'], function (bus, hh, fh) {
    function ProcessInput(data, hands, ActiveGesturesDictionary) {

        var source = 'Efficio Gesture Grimoire';
        var dictionary = 'TwoHandGesture';

        if (!ActiveGesturesDictionary[dictionary]) {
            ActiveGesturesDictionary[dictionary] = {};
        }

        (function BothHandsNeutral() {
            var gestureName = 'BothHandsNeutral'
            var neutrals = [hh.Neutral(hands[0]), hh.Neutral(hands[1])]

            if (neutrals[0] && neutrals[1]) {
                if (!ActiveGesturesDictionary[dictionary][gestureName]) {
                    ActiveGesturesDictionary[dictionary][gestureName] = {
                        StartTime: new Date()
                    }
                }

                var hand0Position = hands[0].palmPosition;
                var hand1Position = hands[1].palmPosition;
                var x2 = hand1Position[0];
                var y2 = hand1Position[1];
                var z2 = hand1Position[2];
                var x1 = hand0Position[0];
                var y1 = hand0Position[1];
                var z1 = hand0Position[2];

                bus.publish({
                    channel: "Input.Processed.Efficio",
                    topic: gestureName,
                    source: source,
                    data: {
                        input: data,
                        hand: hand,
                        neutrals: neutrals,
                        distance: Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1) + (z2 - z1) * (z2 - z1)),
                        midpoint: [(x2 - x1) / 2, (y2 - y1) / 2, (z2 - z1) / 2],
                        gestureLength: Math.abs((ActiveGesturesDictionary[dictionary][gestureName].StartTime - new Date()) / 1000)
                    }
                });
            }
            else {
                ActiveGesturesDictionary[dictionary][gestureName] = null;
            }
        })();// END Both Hands Neutral

        (function BothHandsNeutral() {
            var gestureName = 'BothHandsPronation'
            var pronations = [hh.Pronation(hands[0]), hh.Pronation(hands[1])]

            if (pronations[0] && pronations[1]) {
                if (!ActiveGesturesDictionary[dictionary][gestureName]) {
                    ActiveGesturesDictionary[dictionary][gestureName] = {
                        StartTime: new Date()
                    }
                }
                var hand0Position = hands[0].palmPosition;
                var hand1Position = hands[1].palmPosition;
                var x2 = hand1Position[0];
                var y2 = hand1Position[1];
                var z2 = hand1Position[2];
                var x1 = hand0Position[0];
                var y1 = hand0Position[1];
                var z1 = hand0Position[2];

                bus.publish({
                    channel: "Input.Processed.Efficio",
                    topic: gestureName,
                    source: source,
                    data: {
                        input: data,
                        hand: hand,
                        neutrals: pronations,
                        distance: Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1) + (z2 - z1) * (z2 - z1)),
                        midpoint: [(x2 - x1) / 2, (y2 - y1) / 2, (z2 - z1) / 2],
                        gestureLength: Math.abs((ActiveGesturesDictionary[dictionary][gestureName].StartTime - new Date()) / 1000)
                    }
                });
            }
            else {
                ActiveGesturesDictionary[dictionary][gestureName] = null;
            }
        })();// END Both Hand Pronation
    }

    return {
        ProcessInput: ProcessInput
    }
});