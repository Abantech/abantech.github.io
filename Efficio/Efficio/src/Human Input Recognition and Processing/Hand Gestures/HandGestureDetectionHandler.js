define(['postal'], function (bus) {
    function ProcessInput(data) {
        var source = 'Efficio Gesture Grimoire';
        var channel = 'Input.Processed.Efficio';

        // Check if there is any input and if the input contains hands
        if (data.input && data.input.hands) {

            var hands = data.input.hands;

            // Check if any hands are present
            if (hands.length === 0) {
                bus.publish({
                    channel: channel,
                    topic: 'NoHandsDetected',
                    source: source,
                    data: {
                        message: 'No hands detected'
                    }
                });

                // No need for processing any further
                return;
            }

            // Check if one hand is present
            if (hands.length === 1) {

                // Send Message saying that a hand was detected
                bus.publish({
                    channel: channel,
                    topic: 'OneHandDetected',
                    source: source,
                    data: {
                        handCount: hands[0]
                    }
                });
            }

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
                        ohgd.ProcessInput(data, hand);
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

                // Send data to the two hand gesture detection library
                require(['Human Input Recognition and Processing/Hand Gestures/Two Hand Gestures/TwoHandGestureDetection'], function (thgd) {
                    thgd.ProcessInput(data, hands);
                });
            }
        }
    }

    return {
        ProcessInput: ProcessInput
    }
})