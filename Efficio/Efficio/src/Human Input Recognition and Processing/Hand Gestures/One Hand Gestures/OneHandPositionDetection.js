define(['postal', 'Human Input Recognition and Processing/Hand Gestures/Helpers/FingerHelper'], function (bus, fh) {
    var source = 'Efficio Gesture Grimoire';
    var name = 'One Hand Gesture Detector';
    var dictionary = 'OneHandPosition';
    var trackingType = 'Hands';
    var side;
    var oneHandPositionDetector;
    var ActiveGesturesDictionary;

    /*
          Name:           {Side} Hand Detected
   
          Outputs:        RightHandDetected
                          LeftHandDetected
           
          Description:    Informs consumer how many fingers fingers are extended and on which hand 
       */
    function SideHandDetected(hand, data) {
        var gestureName = side + 'HandDetected';

        //TODO: Clear all entries in agd
        var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName, dictionary, side);

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
    }

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
    function SideHandCountFingersExtended(hand, data) {
        var extendedFingerCountLabel = fh.GetExtendedFingersCountLabel(hand);
        var extendedFingersIndicies = fh.GetExtendedFingersIndicies(hand);

        //TODO: Clear all entries in agd and add new entry

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
    }; // END {Side} Hand {Count} Fingers Extended

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
    function SideHandFingerDetected(hand, data) {
        hand.fingers.forEach(function (finger) {
            var fingerName = fh.GetFingerLabel(finger.type);
            var gestureName = side + 'Hand' + fingerName + 'FingerExtended'

            if (finger.extended) {
                var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName, dictionary, side);

                bus.publish({
                    channel: "Input.Processed.Efficio",
                    topic: gestureName,
                    source: source,
                    data: {
                        input: data,
                        hand: hand,
                        finger: finger.type,
                        gestureInformation: gestureInformation
                    }
                });
            }
            else {
                ActiveGesturesDictionary.DeleteEntry(trackingType, gestureName, dictionary, side);
            }
        });
    }; // END {Side} Hand {Finger} 

    /*
    Name:           {Side} Hand Flexion Detected

    Outputs:        RightHandFlexion
                    LeftHandFlexion
*/
    function SideHandFlexionDetected(hand, data) {
        var gestureName = side + 'HandFlexed'
        if (hand.IsFlexed()) {
            var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName, dictionary, side);

            if (gestureInformation.FireCount > 25) {
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
            }
        }
        else {
            ActiveGesturesDictionary.DeleteEntry(trackingType, gestureName, dictionary, side);
        }
    };// END {Side} Hand Flexion

    /*
    Name:           {Side} Hand Extension Detected

    Outputs:        RightHandExtension
                    LeftHandExtension
*/
    function SideHandExtensionDetected(hand, data) {
        var gestureName = side + 'HandExtended'
        if (hand.IsExtended()) {
            var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName, dictionary, side);

            if (gestureInformation.FireCount > 25) {
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
            }
        }
        else {
            ActiveGesturesDictionary.DeleteEntry(trackingType, gestureName, dictionary, side);
        }
    };// END {Side} Hand Extension

    /*
    Name:           {Side} Hand Radial Deviation

    Outputs:        RightHandRadialDeviation
                    LeftHandRadialDeviation
*/
    function SideHandRadialDeviation(hand, data) {
        var gestureName = side + 'HandRadialDeviation'
        if (hand.IsRadialDeviated()) {
            var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName, dictionary, side);

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
        }
        else {
            ActiveGesturesDictionary.DeleteEntry(trackingType, gestureName, dictionary, side);
        }
    };// END {Side} Hand Radial Deviation

    /*
           Name:           {Side} Hand Ulnar Deviation

           Outputs:        RightHandUlnarDeviation
                           LeftHandUlnarDeviation
       */
    function SideHandUlnarDeviation(hand, data) {
        var gestureName = side + 'HandUlnarDeviation';
        if (hand.IsUlnarDeviated()) {
            var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName, dictionary, side);

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
        }
        else {
            ActiveGesturesDictionary.DeleteEntry(trackingType, gestureName, dictionary, side);
        }
    };// END {Side} Hand Ulnar Deviation

    /*
            Name:           {Side} Hand Supenation

            Outputs:        RightHandSupenation
                            LeftHandSupenation
        */
    function SideHandSupenation(hand, data) {
        var gestureName = side + 'HandSupine'
        if (hand.IsSupine()) {
            var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName, dictionary, side);

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
        }
        else {
            ActiveGesturesDictionary.DeleteEntry(trackingType, gestureName, dictionary, side);
        }
    };// END {Side} Hand Supenation

    /*
            Name:           {Side} Hand Pronation

            Outputs:        RightHandPronation
                            LeftHandPronation
        */
    function SideHandPronation(hand, data) {
        var gestureName = side + 'HandProne'
        if (hand.IsProne()) {
            var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName, dictionary, side);

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
        }
        else {
            ActiveGesturesDictionary.DeleteEntry(trackingType, gestureName, dictionary, side);
        }
    };// END {Side} Hand Pronation

    /*
           Name:           {Side} Hand Hyper Pronation

           Outputs:        RightHandHyperRotated
                           LeftHandHyperRotated
       */
    function SideHandHyperRotated(hand, data) {
        var gestureName = side + 'HandHyperRotated'
        if (hand.IsHyperRotated()) {
            var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName, dictionary, side);

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
        }
        else {
            ActiveGesturesDictionary.DeleteEntry(trackingType, gestureName, dictionary, side);
        }
    };// END {Side} Hand Hyper Pronation

    /*
           Name:           {Side} Hand Neutral

           Outputs:        RightHandNeutral
                           LeftHandNeutral
        */
    function SideHandNeutral(hand, data) {
        var gestureName = side + 'HandNeutral';
        if (hand.IsNeutral()) {
            var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName, dictionary, side);

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
        }
        else {
            ActiveGesturesDictionary.DeleteEntry(trackingType, gestureName, dictionary, side);
        }
    };// END {Side} Hand Neutral

    function SideHandFlexAndRotation(hand, data) {
        var rotation = hand.IsSupine() ? 'Supine' : hand.IsNeutral() ? 'Neutral' : hand.IsProne() ? 'Prone' : 'Hyperrotated';
        var flex = hand.IsFlexed() ? 'Flexed' : hand.IsExtended() ? 'Extended' : 'Neutral';
        var gestureName = side + 'Hand' + flex + 'And' + rotation;

        var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName, dictionary, side, "Combined");
        ActiveGesturesDictionary.DeleteAllBut(trackingType, gestureName, dictionary, side, "Combined")

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
    }

    function Pinch(hand, data) {
        var fingersCount = hand.fingers.length;
        for (var i = 0; i < fingersCount - 1; i++) {
            for (var j = i + 1; j < fingersCount; j++) {
                var gestureName = side + 'Hand' + fh.GetFingerLabel(i) + fh.GetFingerLabel(j) + 'Pinch';
                var pinchDistance = fh.DistanceBetweenFingers(hand.fingers[i], hand.fingers[j]);

                if (pinchDistance < 23) {
                    var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName, dictionary, side);

                    bus.publish({
                        channel: "Input.Processed.Efficio",
                        topic: gestureName,
                        source: source,
                        data: {
                            input: data,
                            hand: hand,
                            pinchDistance: pinchDistance,
                            pinchFingersIndicies: [i, j],
                            gestureInformation: gestureInformation
                        }
                    });
                }
                else {
                    ActiveGesturesDictionary.DeleteEntry(trackingType, gestureName, dictionary, side);
                }
            }
        }
    };// END Pinch

    function ThumbsUp(hand, data) {
        var gestureName = side + 'ThumbsUp';
        if (hand.IsNeutral() && fh.AreRequisiteFingersExtended([0], hand)) {
            var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName, dictionary, side);

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
        }
        else {
            ActiveGesturesDictionary.DeleteEntry(trackingType, gestureName, dictionary, side);
        }
    };// END ThumbsUp

    function ProcessInput(data, hand, agd) {
        // Hand information
        (function HandInformation() {
            side = hand.GetType();
        })();

        ActiveGesturesDictionary = agd;

        if (!oneHandPositionDetector) {
            oneHandPositionDetector = {
                Name: name,
                TrackingType: trackingType,
                Dictionary: dictionary,
                SubDictionary1: side,
                Positions: {
                    SideHandDetected: SideHandDetected,
                    SideHandCountFingersExtended: SideHandCountFingersExtended,
                    SideHandFingerDetected: SideHandFingerDetected,
                    SideHandFlexionDetected: SideHandFlexionDetected,
                    SideHandExtensionDetected: SideHandExtensionDetected,
                    SideHandRadialDeviation: SideHandRadialDeviation,
                    SideHandUlnarDeviation: SideHandUlnarDeviation,
                    SideHandSupenation: SideHandSupenation,
                    SideHandPronation: SideHandPronation,
                    SideHandHyperRotated: SideHandHyperRotated,
                    SideHandNeutral: SideHandNeutral,
                    SideHandFlexAndRotation: SideHandFlexAndRotation,
                    Pinch: Pinch,
                    ThumbsUp: ThumbsUp
                }
            }
        }

        for (var position in oneHandPositionDetector.Positions) {
            oneHandPositionDetector.Positions[position](hand, data);
        }

        return oneHandPositionDetector;
    }

    return {
        ProcessInput: ProcessInput
    }
});