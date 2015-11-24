define(['postal', 'Human Input Recognition and Processing/Hand Gestures/Helpers/HandHelper'], function (bus, hh) {
    function ProcessInput(data, ActiveGesturesDictionary) {
        var source = 'Efficio Gesture Grimoire';
        var channel = 'Input.Processed.Efficio';

        // Check if there is any input and if the input contains hands
        if (data.input && data.input.hands) {

            var hands = data.input.hands;

            // Check if any hands are present
            (function NoHandsDetected() {
                var gestureName = 'NoHandsDetected'

                if (hands.length === 0) {
                    var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(gestureName)

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
                    ActiveGesturesDictionary.DeleteEntry(null, 'OneHandPosition');
                    ActiveGesturesDictionary.DeleteEntry(null, 'OneHandGesture');
                    ActiveGesturesDictionary.DeleteEntry(null, 'TwoHandPositione');
                    ActiveGesturesDictionary.DeleteEntry(null, 'TwoHandGesture');

                    // No need for processing any further
                    return;
                }
                else {
                    ActiveGesturesDictionary.DeleteEntry(gestureName);
                }
            })();

            // Detects each hand's presence independently
            if (hands.length > 0) {
                hands.forEach(function (hand) {
                    var gestureName = type + 'HandDetected';

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
                        ohgd.ProcessInput(data, hand, ActiveGesturesDictionary);
                    });

                    // Send data to the one hand gesture detection library
                    require(['Human Input Recognition and Processing/Hand Gestures/One Hand Gestures/OneHandGestureDetection'], function (ohgd) {
                        ohgd.ProcessInput(data, hand, ActiveGesturesDictionary);
                    });
                });
            }

                // Check if one hand is present
                (function OneHandDetected() {
                    if (hands.length === 1) {
                        var side = hh.GetSide(hands[0]);
                        var gestureName = 'OneHandDetected'
                        var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(gestureName)

                        var oppositeHand = side === 'Right' ? 'Left' : 'Right'

                        // Clear other hand gesture dictionary entries
                        ActiveGesturesDictionary.DeleteEntry(null, 'OneHandPosition', oppositeHand);
                        ActiveGesturesDictionary.DeleteEntry(null, 'OneHandGesture', oppositeHand);

                        // Clear two hand gesture dictionary entries
                        ActiveGesturesDictionary.DeleteEntry(null, 'TwoHandGesture');

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
                        ActiveGesturesDictionary.DeleteEntry(gestureName);
                    }
                })();

                // Check if any hand present
                if (hands.length  == 2) {
                    (function TwoHandsDetected(){
                        if (hands.length === 2) {
                            var gestureName = 'TwoHandDetected'
                            var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(gestureName)

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
                                thgd.ProcessInput(data, hands, ActiveGesturesDictionary);
                            });
                        }
                        else {

                        }
                    })();
                }
            }
        }


        return {
            ProcessInput: ProcessInput
        }
    })