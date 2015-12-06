define(['postal'], function (bus) {
    var source = 'Efficio Gesture Grimoire';
    var name = 'Efficio Hand Gesture Detection Handler';
    var channel = 'Input.Processed.Efficio';
    var trackingType = "Hands";
    var handGestureDetectionLibrary = { Name: name };

    function ProcessInput(data, ActiveGesturesDictionary) {
        // Check if there is any input and if the input contains hands
        if (data.Input && data.Input.hands) {

            var hands = data.Input.hands;

            // Check if any hands are present
            (function NoHandsDetected() {
                var gestureName = 'NoHandsDetected'

                if (hands.length === 0) {
                    var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName)

                    bus.publish({
                        channel: channel,
                        topic: gestureName,
                        source: source,
                        data: {
                            message: 'No hands detected',
                            gestureInformation: gestureInformation
                        }
                    });

                    // Clear gesture dictionary for one and two hand gestures
                    ActiveGesturesDictionary.DeleteAllBut(trackingType, gestureName);

                    // No need for processing any further
                    return;
                }
                else {
                    ActiveGesturesDictionary.DeleteEntry(trackingType, gestureName);
                }
            })();

            // Detects each hand's presence independently
            if (hands.length > 0) {
                // Clear no hands entry
                ActiveGesturesDictionary.DeleteEntry(trackingType, 'NoHandsDetected');

                hands.forEach(function (hand) {
                    var gestureName = type + 'HandDetected';
                    var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName)

                    // Send Message saying what hand was detected
                    var type = hand.type;
                    bus.publish({
                        channel: channel,
                        topic: gestureName,
                        source: source,
                        data: {
                            hand: hand
                        }
                    });

                    // Send data to the one hand position gesture detection libraries
                    require(['Human Input Recognition and Processing/Hand Gestures/One Hand Gestures/OneHandPositionDetection'], function (ohgd) {
                        handGestureDetectionLibrary.OneHandPositionDetector = ohgd.ProcessInput(data, hand, ActiveGesturesDictionary);
                    });

                    // Send data to the one hand gesture detection library
                    require(['Human Input Recognition and Processing/Hand Gestures/One Hand Gestures/OneHandGestureDetection'], function (ohgd) {
                        handGestureDetectionLibrary.OneHandGestureDetector = ohgd.ProcessInput(data, hand, ActiveGesturesDictionary);
                    });
                });
            }

            // Check if one hand is present, clear opposite side
            (function OneHandDetected() {
                if (hands.length === 1) {
                    var hand = hands[0];
                    var oppositeHand = hand.type === 'right' ? 'Left' : 'Right'

                    // Clear other hand gesture dictionary entries
                    ActiveGesturesDictionary.DeleteEntry(trackingType, null, 'OneHandPosition', oppositeHand);
                    ActiveGesturesDictionary.DeleteEntry(trackingType, null, 'OneHandGesture', oppositeHand);
                    ActiveGesturesDictionary.DeleteEntry(trackingType, oppositeHand + 'HandDetected');
                }
            })();

            // Check if any hand present
            if (hands.length == 2) {
                (function TwoHandsDetected() {
                    if (hands.length === 2) {
                        var gestureName = 'TwoHandDetected'
                        var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName)

                        // Send Message saying that two hands were detected
                        bus.publish({
                            channel: channel,
                            topic: gestureName,
                            source: source,
                            data: {
                                gestureInformation: gestureInformation
                            }
                        });

                        // Send data to the two hand gesture detection library
                        require(['Human Input Recognition and Processing/Hand Gestures/Two Hand Gestures/TwoHandPositionDetection'], function (thgd) {
                            handGestureDetectionLibrary.TwoHandPositionDetector = thgd.ProcessInput(data, ActiveGesturesDictionary);
                        });
                    }
                    else {
                        ActiveGesturesDictionary.DeleteEntry(trackingType, 'TwoHandDetected');
                        ActiveGesturesDictionary.DeleteEntry(trackingType, null, 'TwoHandPosition');
                        ActiveGesturesDictionary.DeleteEntry(trackingType, null, 'TwoHandGesture');
                    }
                })();
            }
        }

        return handGestureDetectionLibrary;
    }


    return {
        ProcessInput: ProcessInput
    }
})