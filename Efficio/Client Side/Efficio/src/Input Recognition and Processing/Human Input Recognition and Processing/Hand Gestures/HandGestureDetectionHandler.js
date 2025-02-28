﻿define(['postal'], function (bus) {
    var source = 'Efficio Gesture Grimoire';
    var name = 'Efficio Hand Gesture Detection Handler';
    var channel = 'Input.Processed.Efficio';
    var trackingType = "Hands";
    var handGestureDetectionLibrary = { Name: name };
    var ActiveGesturesDictionary = Efficio.InputAndGestureRecognition.ActiveGesturesDictionary;

    function ProcessInput(data) {
        // Check if there is any input and if the input contains hands
        if (data.Hands) {

            var hands = data.Hands;

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
                    ActiveGesturesDictionary.DeleteEntry(trackingType, null, 'OneHandPosition');
                    ActiveGesturesDictionary.DeleteEntry(trackingType, null, 'OneHandGesture');
                    ActiveGesturesDictionary.DeleteEntry(trackingType, null, 'TwoHandPositions');
                    ActiveGesturesDictionary.DeleteEntry(trackingType, null, 'TwoHandGestures');

                    // No need for processing any further
                    return;
                }
                else {
                    ActiveGesturesDictionary.DeleteEntry(trackingType, gestureName);
                }
            })();

            // Detects each hand's presence independently
            if (hands.length > 0) {
                hands.forEach(function (hand) {
                    var type = hand.GetSide();
                    var gestureName = type + 'HandDetected';

                    // Send Message saying what hand was detected
                    bus.publish({
                        channel: channel,
                        topic: gestureName,
                        source: source,
                        data: {
                            hand: hand
                        }
                    });

                    // Send data to the one hand position gesture detection libraries
                    require(['Input Recognition and Processing/Human Input Recognition and Processing/Hand Gestures/One Hand Gestures/OneHandPositionDetection'], function (ohgd) {
                        handGestureDetectionLibrary.OneHandPositionDetector = ohgd.ProcessInput(data, hand);
                    });

                    // Send data to the one hand gesture detection library
                    require(['Input Recognition and Processing/Human Input Recognition and Processing/Hand Gestures/One Hand Gestures/OneHandGestureDetection'], function (ohgd) {
                        handGestureDetectionLibrary.OneHandGestureDetector = ohgd.ProcessInput(data, hand);
                    });
                });
            }

            // Check if one hand is present
            (function OneHandDetected() {
                var gestureName = 'OneHandDetected';

                if (hands.length === 1) {
                    var hand = hands[0];
                    var side = hand.GetSide();
                    var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName)

                    var oppositeHand = side === 'Right' ? 'Left' : 'Right'

                    // Clear other hand gesture dictionary entries
                    ActiveGesturesDictionary.DeleteEntry(trackingType, null, 'OneHandPosition', oppositeHand);
                    ActiveGesturesDictionary.DeleteEntry(trackingType, null, 'OneHandGesture', oppositeHand);

                    // Clear two hand gesture dictionary entries
                    ActiveGesturesDictionary.DeleteEntry(trackingType, null, 'TwoHandPositions');
                    ActiveGesturesDictionary.DeleteEntry(trackingType, null, 'TwoHandGestures');

                    // Send Message saying that a hand was detected
                    bus.publish({
                        channel: channel,
                        topic: gestureName,
                        source: source,
                        data: {
                            handCount: hands[0],
                            gestureInformation: gestureInformation
                        }
                    });
                }
                else {
                    ActiveGesturesDictionary.DeleteEntry(trackingType, gestureName);
                }
            })();

            // Check if any hand present
            if (hands.length == 2) {
                (function TwoHandsDetected() {
                    var gestureName = 'TwoHandDetected'

                    if (hands.length === 2) {
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
                        require(['Input Recognition and Processing/Human Input Recognition and Processing/Hand Gestures/Two Hand Gestures/TwoHandPositionDetection'], function (thgd) {
                            handGestureDetectionLibrary.TwoHandPositionDetector = thgd.ProcessInput(data);
                        });
                    }
                    else {
                        ActiveGesturesDictionary.DeleteEntry(trackingType, gestureName);
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