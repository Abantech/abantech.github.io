define(['postal', 'Helpers/Math'], function (bus, math) {
    var source = 'Efficio Gesture Grimoire';
    var name = 'One Hand Gesture Detector';
    var dictionary = 'OneHandPosition';
    var trackingType = 'Hands';
    var side;
    var oneHandPositionDetector;
    var ActiveGesturesDictionary = Efficio.InputAndGestureRecognition.ActiveGesturesDictionary;

    //TODO add start and end hands/positions to all gestures

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
                Input: data,
                Hand: hand,
                GestureInformation: gestureInformation
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
        var possibleGestureNames = ['HandZeroFingersExtended', 'HandOneFingersExtended', 'HandTwoFingersExtended', 'HandThreeFingersExtended', 'HandFourFingersExtended', 'HandFiveFingersExtended'];
        var extendedFingerCountLabel = hand.GetExtendedFingersCountLabel();
        var extendedFingersIndicies = hand.GetExtendedFingersIndicies();

        var gestureName = side + 'Hand' + extendedFingerCountLabel + 'FingersExtended';

        // Add gesture to dictionary
        var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName, dictionary, side);

        if (!gestureInformation.StartPosition) {
            gestureInformation.StartPosition = hand.palmPosition;
        }
        else {
            gestureInformation.EndPosition = hand.palmPosition;
        }

        // Remove all other possible entries
        possibleGestureNames.forEach(function (tempGestureName) {
            if (side + tempGestureName != gestureName) {
                ActiveGesturesDictionary.DeleteEntry(trackingType, side + tempGestureName, dictionary, side);
            }
        })

        //TODO: Clear all entries in agd and add new entry

        bus.publish({
            channel: "Input.Processed.Efficio",
            topic: gestureName,
            source: source,
            data: {
                Input: data,
                Hand: hand,
                GestureInformation: gestureInformation,
                ExtendedFingers: extendedFingersIndicies
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
        var fingers = hand.Fingers();
        fingers.forEach(function (finger) {
            var fingerName = finger.GetFingerLabel();
            var gestureName = side + 'Hand' + fingerName + 'FingerExtended'

            if (finger.IsExtended()) {
                var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName, dictionary, side);

                bus.publish({
                    channel: "Input.Processed.Efficio",
                    topic: gestureName,
                    source: source,
                    data: {
                        Input: data,
                        Hand: hand,
                        GestureInformation: gestureInformation,
                        Finger: finger.type,
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
        var gestureName = side + 'HandFlexion'
        if (hand.IsFlexed()) {
            var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName, dictionary, side);

            if (gestureInformation.FireCount > 10) {
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
        var gestureName = side + 'HandExtension'
        if (hand.IsExtended()) {
            var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName, dictionary, side);

            if (gestureInformation.FireCount > 10) {
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
                    Input: data,
                    Hand: hand,
                    GestureInformation: gestureInformation
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
                    Input: data,
                    Hand: hand,
                    GestureInformation: gestureInformation
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
        var gestureName = side + 'HandSupenation'
        if (hand.IsSupine()) {
            var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName, dictionary, side);

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
        var gestureName = side + 'HandPronation'
        if (hand.IsProne()) {
            var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName, dictionary, side);
            
            if (!gestureInformation.StartPosition) {
                gestureInformation.StartPosition = hand.palmPosition;
            }

            if (!gestureInformation.StartHand) {
                gestureInformation.StartHand = hand;
            }

            gestureInformation.EndPosition = hand.palmPosition;

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
                    Input: data,
                    Hand: hand,
                    GestureInformation: gestureInformation
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
                    Input: data,
                    Hand: hand,
                    GestureInformation: gestureInformation
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
                Input: data,
                Hand: hand,
                GestureInformation: gestureInformation
            }
        });
    }

    function Pinch(hand, data) {
        var fingers = hand.Fingers();
        for (var i = 0; i < fingers.length - 1; i++) {
            for (var j = i + 1; j < fingers.length; j++) {
                var gestureName = side + 'Hand' + fingers[i].GetFingerLabel() + fingers[j].GetFingerLabel() + 'Pinch';
                var pinchDistance = fingers[i].DistanceToFinger(fingers[j]);

                if (pinchDistance < 23) {
                    var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName, dictionary, side);
                    gestureInformation.PinchFingersIndicies = [i, j];
                    gestureInformation.PinchDistance = pinchDistance;
                    gestureInformation.PinchMidpoint = math.MidpointBetweenTwoPoints(fingers[i].TipPosition(), fingers[j].TipPosition())

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
                }
                else {
                    ActiveGesturesDictionary.DeleteEntry(trackingType, gestureName, dictionary, side);
                }
            }
        }
    };// END Pinch

    function ThumbsUp(hand, data) {
        var gestureName = side + 'ThumbsUp';
        if (hand.IsNeutral() && hand.AreRequisiteFingersExtended([0])) {
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

    //function Airplane(hand, data){
    //    var gestureName = side + "HandAirplane";
    //    var fingerAdjacencyAngleThreshold = 30;

    //    // All fingers extended
    //    var handIsAirplane = hand.AreRequisiteFingersExtended([0, 1, 2, 3, 4]);

    //    // Index and middle touching
    //    handIsAirplane = handIsAirplane && hand.indexFinger.AngleToFinger(hand.middleFinger) < fingerAdjacencyAngleThreshold;

    //    // Middle and ring touching
    //    handIsAirplane = handIsAirplane && hand.middleFinger.AngleToFinger(hand.ringFinger) < fingerAdjacencyAngleThreshold;

    //    // Thumb and index separated
    //    handIsAirplane = handIsAirplane && hand.thumb.AngleToFinger(hand.indexFinger) > fingerAdjacencyAngleThreshold;

    //    // Ring and pinky separated
    //    handIsAirplane = handIsAirplane && hand.ringFinger.AngleToFinger(hand.pinky) > fingerAdjacencyAngleThreshold;


    //    if (handIsAirplane) {
    //        var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName, dictionary, side);

    //        bus.publish({
    //            channel: "Input.Processed.Efficio",
    //            topic: gestureName,
    //            source: source,
    //            data: {
    //                input: data,
    //                hand: hand,
    //                GestureInformation: gestureInformation
    //            }
    //        });
    //    }
    //    else {
    //        ActiveGesturesDictionary.DeleteEntry(trackingType, gestureName, dictionary, side);
    //    }
    //}

    function ProcessInput(data, hand) {
        // Hand information
        (function HandInformation() {
            side = hand.GetSide();
        })();

        if (!oneHandPositionDetector) {
            oneHandPositionDetector = {
                Name: name,
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
                    ThumbsUp: ThumbsUp,
                    //Airplane: Airplane
                }
            }
        }

        for (position in oneHandPositionDetector.Positions) {
            oneHandPositionDetector.Positions[position](hand, data);
        }

        return oneHandPositionDetector;
    }

    return {
        ProcessInput: ProcessInput
    }
});