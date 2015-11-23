define(['postal', 'Human Input Recognition and Processing/Hand Gestures/Helpers/HandHelper', 'Human Input Recognition and Processing/Hand Gestures/Helpers/FingerHelper'], function (bus, hh, fh) {
    function ProcessInput(data, hand, ActiveGesturesDictionary) {
        var source = 'Efficio Gesture Grimoire';
        var dictionary = 'OneHandGesture';

        // Hand information
        var side = hh.GetSide(hand);

        if (!ActiveGesturesDictionary[dictionary]) {
            ActiveGesturesDictionary[dictionary] = {};
        }

        if (!ActiveGesturesDictionary[dictionary][side]) {
            ActiveGesturesDictionary[dictionary][side] = {};
        }

        /*
          Name:           {Side} Hand Detected
   
          Outputs:        RightHandDetected
                          LeftHandDetected
           
          Description:    Informs consumer how many fingers fingers are extended and on which hand 
       */
        (function SideHandCountFingersExtended() {
            var gestureName = side + 'HandDetected';

            if (!ActiveGesturesDictionary[dictionary][side][gestureName]) {
                ActiveGesturesDictionary[dictionary][side][gestureName] = {
                    StartTime: new Date()
                }
            }

            bus.publish({
                channel: "Input.Processed.Efficio",
                topic: gestureName,
                source: source,
                data: {
                    input: data,
                    hand: hand,
                    gestureLength: Math.abs((ActiveGesturesDictionary[dictionary][side][gestureName].StartTime - new Date()) / 1000)
                }
            });
        })();

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
            var extendedFingerCountLabel = fh.GetExtendedFingersCountLabel(hand);
            var extendedFingersIndicies = fh.GetExtendedFingersIndicies(hand);

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
            hand.fingers.forEach(function (finger) {
                var fingerName = fh.GetFingerLabel(finger.type);
                var gestureName = side + 'Hand' + fingerName + 'FingerExtended'

                if (finger.extended) {

                    if (!ActiveGesturesDictionary[dictionary][side][gestureName]) {
                        ActiveGesturesDictionary[dictionary][side][gestureName] = {
                            StartTime: new Date()
                        }
                    }

                    bus.publish({
                        channel: "Input.Processed.Efficio",
                        topic: gestureName,
                        source: source,
                        data: {
                            input: data,
                            hand: hand,
                            finger: finger.type,
                            gestureLength: Math.abs((ActiveGesturesDictionary[dictionary][side][gestureName].StartTime - new Date()) / 1000)
                        }
                    });
                }
                else {
                    ActiveGesturesDictionary[dictionary][side][gestureName] = null;
                }
            });
        })(); // END {Side} Hand {Finger} Extended

        /*
            Name:           {Side} Hand Flexion Detected
    
            Outputs:        RightHandFlexion
                            LeftHandFlexion
        */
        (function SideHandFlexionDetected() {
            var gestureName = side + 'HandFlexion'
            var flexion = hh.Flexion(hand);
            if (flexion) {

                if (!ActiveGesturesDictionary[dictionary][side][gestureName]) {
                    ActiveGesturesDictionary[dictionary][side][gestureName] = {
                        StartTime: new Date()
                    }
                }

                bus.publish({
                    channel: "Input.Processed.Efficio",
                    topic: gestureName,
                    source: source,
                    data: {
                        input: data,
                        hand: hand,
                        flexion: flexion,
                        gestureLength: Math.abs((ActiveGesturesDictionary[dictionary][side][gestureName].StartTime - new Date()) / 1000)
                    }
                });
            }
            else {
                ActiveGesturesDictionary[dictionary][side][gestureName] = null;
            }
        })();// END {Side} Hand Flexion

        /*
            Name:           {Side} Hand Extension Detected
    
            Outputs:        RightHandExtension
                            LeftHandExtension
        */
        (function SideHandExtensionDetected() {
            var gestureName = side + 'HandExtension'
            var extension = hh.Extension(hand);
            if (extension) {
                if (!ActiveGesturesDictionary[dictionary][side][gestureName]) {
                    ActiveGesturesDictionary[dictionary][side][gestureName] = {
                        StartTime: new Date()
                    }
                }

                bus.publish({
                    channel: "Input.Processed.Efficio",
                    topic: gestureName,
                    source: source,
                    data: {
                        input: data,
                        hand: hand,
                        extension: extension,
                        gestureLength: Math.abs((ActiveGesturesDictionary[dictionary][side][gestureName].StartTime - new Date()) / 1000)
                    }
                });
            }
            else {
                ActiveGesturesDictionary[dictionary][side][gestureName] = null;
            }
        })();// END {Side} Hand Extension

        /*
            Name:           {Side} Hand Radial Deviation

            Outputs:        RightHandRadialDeviation
                            LeftHandRadialDeviation
        */
        (function SideHandRadialDeviation() {
            var gestureName = side + 'HandRadialDeviation'
            var deviation = hh.RadialDeviation(hand);
            if (deviation) {

                if (!ActiveGesturesDictionary[dictionary][side][gestureName]) {
                    ActiveGesturesDictionary[dictionary][side][gestureName] = {
                        StartTime: new Date()
                    }
                }

                bus.publish({
                    channel: "Input.Processed.Efficio",
                    topic: gestureName,
                    source: source,
                    data: {
                        input: data,
                        hand: hand,
                        deviation: deviation,
                        gestureLength: Math.abs((ActiveGesturesDictionary[dictionary][side][gestureName].StartTime - new Date()) / 1000)
                    }
                });
            }
            else {
                ActiveGesturesDictionary[dictionary][side][gestureName] = null;
            }
        })();// END {Side} Hand Radial Deviation

        /*
            Name:           {Side} Hand Ulnar Deviation

            Outputs:        RightHandUlnarDeviation
                            LeftHandUlnarDeviation
        */
        (function SideHandUlnarDeviation() {
            var gestureName = side + 'HandUlnarDeviation'
            var deviation = hh.UlnarDeviation(hand);
            if (deviation) {
                if (!ActiveGesturesDictionary[dictionary][side][gestureName]) {
                    ActiveGesturesDictionary[dictionary][side][gestureName] = {
                        StartTime: new Date()
                    }
                }

                bus.publish({
                    channel: "Input.Processed.Efficio",
                    topic: gestureName,
                    source: source,
                    data: {
                        input: data,
                        hand: hand,
                        deviation: deviation,
                        gestureLength: Math.abs((ActiveGesturesDictionary[dictionary][side][gestureName].StartTime - new Date()) / 1000)
                    }
                });
            }
            else {
                ActiveGesturesDictionary[dictionary][side][gestureName] = null;
            }
        })();// END {Side} Hand Ulnar Deviation

        /*
            Name:           {Side} Hand Supenation

            Outputs:        RightHandSupenation
                            LeftHandSupenation
        */
        (function SideHandSupenation() {
            var gestureName = side + 'HandSupenation'
            var supenation = hh.Supination(hand);
            if (supenation) {
                if (!ActiveGesturesDictionary[dictionary][side][gestureName]) {
                    ActiveGesturesDictionary[dictionary][side][gestureName] = {
                        StartTime: new Date()
                    }
                }

                bus.publish({
                    channel: "Input.Processed.Efficio",
                    topic: gestureName,
                    source: source,
                    data: {
                        input: data,
                        hand: hand,
                        supenation: supenation,
                        gestureLength: Math.abs((ActiveGesturesDictionary[dictionary][side][gestureName].StartTime - new Date()) / 1000)
                    }
                });
            }
            else {
                ActiveGesturesDictionary[dictionary][side][gestureName] = null;
            }
        })();// END {Side} Hand Supenation

        /*
            Name:           {Side} Hand Pronation

            Outputs:        RightHandPronation
                            LeftHandPronation
        */
        (function SideHanPronation() {
            var gestureName = side + 'HandPronation'
            var pronation = hh.Pronation(hand);
            if (pronation) {
                if (!ActiveGesturesDictionary[dictionary][side][gestureName]) {
                    ActiveGesturesDictionary[dictionary][side][gestureName] = {
                        StartTime: new Date()
                    }
                }

                bus.publish({
                    channel: "Input.Processed.Efficio",
                    topic: gestureName,
                    source: source,
                    data: {
                        input: data,
                        hand: hand,
                        pronation: pronation,
                        gestureLength: Math.abs((ActiveGesturesDictionary[dictionary][side][gestureName].StartTime - new Date()) / 1000)
                    }
                });
            }
            else {
                ActiveGesturesDictionary[dictionary][side][gestureName] = null;
            }
        })();// END {Side} Hand Pronation

        /*
           Name:           {Side} Hand Hyper Pronation

           Outputs:        RightHandHyperPronation
                           LeftHandHyperPronation
       */
        (function SideHandHyperPronation() {
            var gestureName = side + 'HandHyperPronation'
            var pronation = hh.HyperPronation(hand);
            if (pronation) {
                if (!ActiveGesturesDictionary[dictionary][side][gestureName]) {
                    ActiveGesturesDictionary[dictionary][side][gestureName] = {
                        StartTime: new Date()
                    }
                }

                bus.publish({
                    channel: "Input.Processed.Efficio",
                    topic: gestureName,
                    source: source,
                    data: {
                        input: data,
                        hand: hand,
                        pronation: pronation,
                        gestureLength: Math.abs((ActiveGesturesDictionary[dictionary][side][gestureName].StartTime - new Date()) / 1000)
                    }
                });
            }
            else {
                ActiveGesturesDictionary[dictionary][side][gestureName] = null;
            }
        })();// END {Side} Hand Hyper Pronation

        /*
           Name:           {Side} Hand Neutral

           Outputs:        RightHandNeutral
                           LeftHandNeutral
        */
        (function SideHandNeutral() {
            var gestureName = side + 'HandNeutral'
            var neutral = hh.Neutral(hand);
            if (neutral) {
                if (!ActiveGesturesDictionary[dictionary][side][gestureName]) {
                    ActiveGesturesDictionary[dictionary][side][gestureName] = {
                        StartTime: new Date()
                    }
                }

                bus.publish({
                    channel: "Input.Processed.Efficio",
                    topic: gestureName,
                    source: source,
                    data: {
                        input: data,
                        hand: hand,
                        neutral: neutral,
                        gestureLength: Math.abs((ActiveGesturesDictionary[dictionary][side][gestureName].StartTime - new Date()) / 1000)
                    }
                });
            }
            else {
                ActiveGesturesDictionary[dictionary][side][gestureName] = null;
            }
        })();// END {Side} Hand Neutral

        (function Pinch() {
            for (var i = 0; i < hand.fingers.length - 1; i++) {
                for (var j = i + 1; j < hand.fingers.length; j++) {
                    var gestureName = side + 'Hand' + fh.GetFingerLabel(i) + fh.GetFingerLabel(j) + 'Pinch';
                    var pinchDistance = fh.DistanceBetweenFingers(hand.fingers[i], hand.fingers[j]);

                    if (pinchDistance < 23) {
                        if (!ActiveGesturesDictionary[dictionary][side][gestureName]) {
                            ActiveGesturesDictionary[dictionary][side][gestureName] = {
                                StartTime: new Date()
                            }
                        }

                        bus.publish({
                            channel: "Input.Processed.Efficio",
                            topic: gestureName,
                            source: source,
                            data: {
                                input: data,
                                hand: hand,
                                pinchDistance: pinchDistance,
                                pinchFingersIndicies: [i,j],
                                gestureLength: Math.abs((ActiveGesturesDictionary[dictionary][side][gestureName].StartTime - new Date()) / 1000)
                            }
                        });
                    }
                    else {
                        ActiveGesturesDictionary[dictionary][side][gestureName] = null;
                    }
                }
                


                if (true) {

                }
            }
        })();
    }

    return {
        ProcessInput: ProcessInput
    }
});