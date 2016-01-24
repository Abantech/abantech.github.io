define(['postal', 'Helpers/Math'], function (bus, math) {
    var source = 'Efficio Gesture Grimoire';
    var name = 'One Hand Gesture Detector';
    var dictionary = 'OneHandGesture';
    var trackingType = 'Hands';
    var side;
    var oneHandGestureDetector;
    var ActiveGesturesDictionary = Efficio.InputAndGestureRecognition.ActiveGesturesDictionary;

    function SideHandSwipe(hand, data) {
        var gestureName = side + 'HandSwipe';
        var isExecuting = false;
        var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName, dictionary, side);

        if (hand.IsExtended() && hand.IsNeutral()) {
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
            if (gestureInformation.ExtensionFramesCount > 10 && hand.IsNeutral()) {
                if (typeof gestureInformation.NeutralFramesCount === 'undefined') {
                    gestureInformation.NeutralFramesCount = 0;
                } else {
                    gestureInformation.NeutralFramesCount++;
                }

                isExecuting = true;
            }
        }

        if (gestureInformation.ExtensionFramesCount > 10 && gestureInformation.NeutralFramesCount > 10 && hand.IsFlexed() && !gestureInformation.Fired) {
            gestureInformation.EndTime = new Date();
            gestureInformation.PalmEndPosition = hand.palmPosition;
            gestureInformation.MiddleFingerEndPosition = hand.middleFinger.tipPosition;
            gestureInformation.EndFrame = hand.frame;
            gestureInformation.SwipeVelocity = math.Velocity(gestureInformation.MiddleFingerStartPosition, gestureInformation.MiddleFingerEndPosition, gestureInformation.GestureDuration());
            gestureInformation.Fired = true;

            bus.publish({
                channel: "Input.Processed.Efficio",
                topic: gestureName,
                source: source,
                data: {
                    Input: data,
                    Hand: hand,
                    GestureInformation: gestureInformation
                }
            });

            setTimeout(function () {
                ActiveGesturesDictionary.DeleteEntry(trackingType, gestureName, dictionary, side);
            }, 250);
        }

        if (!isExecuting) {
            ActiveGesturesDictionary.DeleteEntry(trackingType, gestureName, dictionary, side);
        }
    }

    function ProcessInput(data, hand) {
        // Hand information
        (function HandInformation() {
            side = hand.GetSide();
        })();


        if (!oneHandGestureDetector) {
            oneHandGestureDetector = {
                Name: name,
                Gestures: {
                    SideHandSwipe: SideHandSwipe
                }
            }
        }

        for (gesture in oneHandGestureDetector.Gestures) {
            oneHandGestureDetector.Gestures[gesture](hand, data);
        }

        return oneHandGestureDetector;
    }

    return {
        ProcessInput: ProcessInput
    }
});