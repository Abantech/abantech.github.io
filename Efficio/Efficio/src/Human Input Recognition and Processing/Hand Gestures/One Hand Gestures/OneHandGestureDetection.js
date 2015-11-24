define(['postal', 'Human Input Recognition and Processing/Hand Gestures/Helpers/HandHelper', 'Human Input Recognition and Processing/Hand Gestures/Helpers/FingerHelper', 'Helpers/Math'], function (bus, hh, fh, math) {
    function ProcessInput(data, hand, ActiveGesturesDictionary) {
        var source = 'Efficio Gesture Grimoire';
        var dictionary = 'OneHandGesture';
        var side;

        // Hand information
        (function HandInformation() {
            side = hh.GetSide(hand);
        })();

        (function SideHandSwipe() {
            var gestureName = side + 'HandSwipe';
            var isExecuting = false;
            var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(gestureName, dictionary);

            if (hh.Extension(hand) && hh.Neutral(hand)) {
                if (typeof gestureInformation.ExtensionFramesCount === 'undefined') {
                    gestureInformation.ExtensionFramesCount = 0;
                    gestureInformation.PalmStartPosition = hand.palmPosition;
                    gestureInformation.MiddleFingerStartPosition = hand.middleFinger.tipPosition;
                    gestureInformation.StartFrame = hand.frame;

                    setTimeout(function () {
                        isExecuting = false;
                    }, 2000);
                } else {
                    gestureInformation.ExtensionFramesCount++;
                }

                isExecuting = true;
            } else {
                if (gestureInformation.ExtensionFramesCount > 10 && hh.Neutral(hand)) {
                    if (typeof gestureInformation.NeutralFramesCount === 'undefined') {
                        gestureInformation.NeutralFramesCount = 0;
                    } else {
                        gestureInformation.NeutralFramesCount++;
                    }

                    isExecuting = true;
                }
            }

            if (gestureInformation.ExtensionFramesCount > 10 && gestureInformation.NeutralFramesCount > 10 && hh.Flexion(hand) && !gestureInformation.Fired) {
                gestureInformation.EndTime = new Date();
                gestureInformation.PalmEndPosition = hand.palmPosition;
                gestureInformation.MiddleFingerEndPosition = hand.middleFinger.tipPosition;
                gestureInformation.StartFrame = hand.frame;
                gestureInformation.SwipeVelocity = math.Velocity(gestureInformation.MiddleFingerStartPosition, gestureInformation.MiddleFingerEndPosition, gestureInformation.GestureDuration());
                gestureInformation.Fired = true;

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

                setTimeout(function () {
                    ActiveGesturesDictionary.DeleteEntry(gestureName, dictionary);
                }, 250);
            }

            if (!isExecuting) {
                ActiveGesturesDictionary.DeleteEntry(gestureName, dictionary);
            }
        })();
    }

    return {
        ProcessInput: ProcessInput
    }
});