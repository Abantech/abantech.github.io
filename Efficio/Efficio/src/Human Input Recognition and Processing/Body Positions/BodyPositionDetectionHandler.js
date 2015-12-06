define(['postal'], function (bus) {
    function ProcessInput(data, ActiveGesturesDictionary) {
        var source = 'Efficio Gesture Grimoire';
        var channel = 'Input.Processed.Efficio';
        var dictionary = 'BodyPosition';
        var trackingType = 'Body';
        var side;

        var handRight;
        var handLeft;

        data.input.forEach(function (jointFriendly) {

            // Get the joints we are using to identify navigation
            if (jointFriendly.JointName == "HandRight") {
                handRight = jointFriendly;
            }

            if (jointFriendly.JointName == "HandLeft") {
                handLeft = jointFriendly;
            }

        });

        // only proceed with the checks if BOTH joints are tracked
        if (handRight.IsTracked && handLeft.IsTracked) {
           

            //// Check if Right Wrist is above Left Wrist
            //if (handRight.IsAboveOf(handLeft)) {
            //    var gestureName = "RightWristAboveLeftWrist"; 
            //    var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName, dictionary, side);

            //    bus.publish({
            //        channel: channel,
            //        topic: gestureName,
            //        source: source,
            //        data: {
            //            message: 'Right wrist above left wrist detected',
            //            gestureInformation: gestureInformation
            //        }
            //    });
            //}

            //// Check if Right Wrist is below Left Wrist
            //if (handRight.IsBelowOf(handLeft)) {
            //    var gestureName = "RightWristBelowLeftWrist";
            //    var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName, dictionary, side);

            //    bus.publish({
            //        channel: channel,
            //        topic: gestureName,
            //        source: source,
            //        data: {
            //            message: 'Right wrist below left wrist detected',
            //            gestureInformation: gestureInformation
            //        }
            //    });
            //}

            // Check if Right Wrist is left of Left Wrist
            if (handRight.IsLeftOf(handLeft)) {
                var gestureName = "RighthandLeftOfLeftWrist";
                var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName, dictionary, side);

                bus.publish({
                    channel: channel,
                    topic: gestureName,
                    source: source,
                    data: {
                        message: 'Right wrist left of left wrist detected',
                        gestureInformation: gestureInformation
                    }
                });
            }

            // Check if Right Wrist is right of Left Wrist
            if (handRight.IsRightOf(handLeft)) {
                var gestureName = "RighthandRightOfLeftWrist";
                var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName, dictionary, side);

                bus.publish({
                    channel: channel,
                    topic: gestureName,
                    source: source,
                    data: {
                        message: 'Right wrist right of left wrist detected',
                        gestureInformation: gestureInformation
                    }
                });
            }

            // Check if Right Wrist is ahead of Left Wrist
            if (handRight.IsForwardOf(handLeft)) {
                var gestureName = "RightWristAheadOfLeftWrist";
                var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName, dictionary, side);

                bus.publish({
                    channel: channel,
                    topic: gestureName,
                    source: source,
                    data: {
                        message: 'Right wrist ahead of left wrist detected',
                        gestureInformation: gestureInformation
                    }
                });
            }

            // Check if Right Wrist is behind of Left Wrist
            if (handRight.IsBehindOf(handLeft)) {
                var gestureName = "RightWristBehindLeftWrist";
                var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName, dictionary, side);

                bus.publish({
                    channel: channel,
                    topic: gestureName,
                    source: source,
                    data: {
                        message: 'Right wrist behindleft wrist detected',
                        gestureInformation: gestureInformation
                    }
                });
            }


        }// end if for tracking check


    }


    return {
        ProcessInput: ProcessInput
    }
})