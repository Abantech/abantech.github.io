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
                    if (!ActiveGesturesDictionary[gestureName]) {
                        ActiveGesturesDictionary[gestureName] = {
                            StartTime: new Date()
                        }
                    }

                    bus.publish({
                        channel: channel,
                        topic: gestureName,
                        source: source,
                        data: {
                            message: 'No hands detected',
                            gestureLength: Math.abs((ActiveGesturesDictionary[gestureName].StartTime - new Date()) / 1000)
                        }
                    });

                    // Clear gesture dictionary for one and two hand gestures
                    ActiveGesturesDictionary['OneHandGesture'] = null;
                    ActiveGesturesDictionary['TwoHandGesture'] = null;
                    
                    // No need for processing any further
                    return;
                }
                else {
                    ActiveGesturesDictionary[gestureName] = null;
                }
            })();

            // Check if one hand is present
            (function OneHandDetected() {
                if (hands.length === 1) {
                    var side = hh.GetSide(hands[0]);
                    var gestureName = 'OneHandDetected'

                    if (!ActiveGesturesDictionary[gestureName]) {
                        ActiveGesturesDictionary[gestureName] = {
                            StartTime: new Date()
                        }
                    }

                    var oppositeHand = side === 'Right' ? 'Left' : 'Right'

                    // Clear other hand gesture dictionary entries
                    if (ActiveGesturesDictionary['OneHandGesture']) {
                        ActiveGesturesDictionary['OneHandGesture'][oppositeHand] = null;
                    }

                    // Clear two hand gesture dictionary entries
                    if (ActiveGesturesDictionary['TwoHandGesture']) {
                        ActiveGesturesDictionary['TwoHandGesture'] = null;
                    }

                    // Send Message saying that a hand was detected
                    bus.publish({
                        channel: channel,
                        topic: gestureName,
                        source: source,
                        data: {
                            handCount: hands[0],
                            gestureLength: Math.abs((ActiveGesturesDictionary[gestureName].StartTime - new Date()) / 1000)
                        }
                    });
                }
                else {
                    ActiveGesturesDictionary[gestureName] = null;
                }
            })();

            // Check if any hand present
            if (hands.length > 0) {

                // Process Gestures for each hand
                hands.forEach(function (hand) {

                    // Send Message saying what hand was detected
                    var type = hand.type;
                    bus.publish({
                        channel: channel,
                        topic: type + 'HandDetected',
                        source: source,
                        data: {
                            hand: hand
                        }
                    });

                    // Send data to the one hand gesture detection library
                    require(['Human Input Recognition and Processing/Hand Gestures/One Hand Gestures/OneHandGestureDetection'], function (ohgd) {
                        ohgd.ProcessInput(data, hand, ActiveGesturesDictionary);
                    });
                });

                // Send Message saying that two hands were detected
                bus.publish({
                    channel: channel,
                    topic: 'TwoHandDetected',
                    source: source,
                    data: {
                    }
                });

                if (hands.length === 2) {
                    // Send data to the two hand gesture detection library
                    require(['Human Input Recognition and Processing/Hand Gestures/Two Hand Gestures/TwoHandGestureDetection'], function (thgd) {
                        thgd.ProcessInput(data, hands, ActiveGesturesDictionary);
                    });
                }
            }
        }
    }


    return {
        ProcessInput: ProcessInput
    }
})