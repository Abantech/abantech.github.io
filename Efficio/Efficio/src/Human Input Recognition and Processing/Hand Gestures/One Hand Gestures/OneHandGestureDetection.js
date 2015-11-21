define(['postal', 'Human Input Recognition and Processing/Hand Gestures/Helpers/HandHelper', 'Human Input Recognition and Processing/Hand Gestures/Helpers/FingerHelper'], function (bus, hh, fh) {
    function ProcessInput(data, hand) {
        var source = 'Efficio Gesture Grimoire';

        // Hand information
        var side = hh.GetSide(hand);
        var angle = hh.GetAngle(hand);

        // Finger information
        var extendedFingerCount = fh.GetExtendedFingersCount(hand);
        var extendedFingerCountLabel = fh.GetExtendedFingersCountLabel(hand);
        var extendedFingersIndicies = fh.GetExtendedFingersIndicies(hand);
        var extendedFingers = fh.GetExtendedFingers(hand);

        /*
          Name:           {Side} Hand {Count} Fingers Extended
   
          Outputs:        RightHandZeroFingersExtended
                          RightHandOneFingersExtended
                          RightHandTwoFingersExtended
                          RightHandThreeFingersExtended
                          RightHandFourFingersExtended
                          RightHandFiveFingersExtended
                          LeftHandZeroFingersExtended
                          LeftHandOneFingersExtended
                          LeftHandTwoFingersExtended
                          LeftHandThreeFingersExtended
                          LeftHandFourFingersExtended
                          LeftHandFiveFingersExtended
           
          Description:    Informs consumer how many fingers fingers are extended and on which hand 
       */
        (function SideHandCountFingersExtended() {
            bus.publish({
                channel: "Input.Processed.Efficio",
                topic: side + 'Hand' + extendedFingerCountLabel + 'FingersExtended',
                source: source,
                data: {
                    input: data,
                    hand: hand,
                    extendedFingers: extendedFingersIndicies
                }
            });
        })(); // END {Side} Hand {Count} Fingers Extended

        /*
           Name:           {Side} Hand {Finger} Extended
   
           Outputs:        RightHandThumbFingerExtended
                           RightHandIndexFingerExtended
                           RightHandMiddleFingerExtended
                           RightHandRingFingerExtended
                           RightHandPinkyFingerExtended
                           LeftHandThumbFingerExtended
                           LeftHandIndexFingerExtended
                           LeftHandMiddleFingerExtended
                           LeftHandRingFingerExtended
                           LeftHandPinkyFingerExtended
           
           Description:    Informs consumer which fingers are extended and on which hand 
       */
        (function SideHandFingerDetected() {
            extendedFingersIndicies.forEach(function (index) {
                var fingerName = fh.GetFingerLabel(index);

                bus.publish({
                    channel: "Input.Processed.Efficio",
                    topic: side + 'Hand' + fingerName + 'FingerExtended',
                    source: source,
                    data: {
                        input: data,
                        hand: hand,
                        finger: index,
                    }
                });
            })

        })(); // END {Side} Hand {Finger} Extended

        /*
            Name:           {Side} Hand {Direction} Detected
    
            Outputs:        RightHandUpDetected
                            RightHandDownDetected
                            LeftHandUpDetected
                            LeftHandDownDetected
            
            Description:    Informs consumer which hand is in view, if four fingers are extended, and if the fingers are above or below the palm.
                            {Side} 
        */
        (function SideHandDirectionDetected() {
            var requisiteFingers = [1, 2, 3, 4];
            if (fh.AreRequisiteFingersExtended(hand, requisiteFingers)) {

                // Determine direction
                var direction = '';
                if (angle > .5) {
                    direction = 'Up'
                }
                else {
                    if (angle < .2) {
                        direction = 'Down'
                    }
                }

                if (direction != '') {
                    bus.publish({
                        channel: "Input.Processed.Efficio",
                        topic: side + 'Hand' + direction + 'Detected',
                        source: source,
                        data: {
                            message: side + ' hand ' + direction + ' direction detected.'
                        }
                    });
                }
            }
        })();// END {Side} Hand {Direction} Detected
    }

    return {
        ProcessInput: ProcessInput
    }
});