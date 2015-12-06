define(['postal'], function (bus) {
    function ProcessInput(data, ActiveGesturesDictionary) {
        var source = 'Efficio Gesture Grimoire';
        var channel = 'Input.Processed.Efficio';
        var dictionary = 'BodyPosition';
        var trackingType = 'Body';
        var side;

        var jointHelper;
        var wristRight;
        var wristLeft;

        data.input.forEach(function (jointFriendly) {

            // Get the joints we are using to identify navigation
            if (jointFriendly.JointType == "WristRight") {
                wristRight = jointFriendly;
            }

            if (jointFriendly.JointType == "WristLeft") {
                wristLeft = jointFriendly;
            }

        });

        // only proceed with the checks if the joints are tracked
        if (wristRight.TrackingState == "Tracked" && wristLeft.TrackingState == "Tracked") {
            require(['../Input Extensions/Microsoft Kinect/KinectJointExtensions'], function (kje) {
                jointHelper = kje;
            });

            //// Check if Right Wrist is above Left Wrist
            //if (jointHelper.IsAbove(wristLeft, wristRight)) {
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
            //if (jointHelper.IsBelow(wristLeft, wristRight)) {
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
            if (jointHelper.IsLeft(wristLeft, wristRight)) {
                var gestureName = "RightWristLeftOfLeftWrist";
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
            if (jointHelper.IsRight(wristLeft, wristRight)) {
                var gestureName = "RightWristRightOfLeftWrist";
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
            if (jointHelper.IsForward(wristLeft, wristRight)) {
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
            if (jointHelper.IsBehind(wristLeft, wristRight)) {
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