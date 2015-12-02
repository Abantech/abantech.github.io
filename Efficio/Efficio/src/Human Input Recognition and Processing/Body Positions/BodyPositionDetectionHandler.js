define(['postal'], function (bus) {
    function ProcessInput(data, ActiveGesturesDictionary) {
        var source = 'Efficio Gesture Grimoire';
        var channel = 'Input.Processed.Efficio';
        var dictionary = 'BodyPosition';
        var trackingType = 'Body';
        var side;

        



        // Check if there is any input and if the input contains hands

        var wristRight;
        var shoulderRight;
        var wristLeft;
        var shoulderLeft;
        var head;

        data.input.forEach(function (jointFriendly) {

            // Get the 5 joints we are using to identify navigation
            if (jointFriendly.JointType == "ShoulderRight") {
                shoulderRight = jointFriendly;
            }

            if (jointFriendly.JointType == "ShoulderLeft") {
                shoulderLeft = jointFriendly;
            }

            if (jointFriendly.JointType == "WristRight") {
                wristRight = jointFriendly;
            }

            if (jointFriendly.JointType == "WristLeft") {
                wristLeft = jointFriendly;
            }

            if (jointFriendly.JointType == "Head") {
                head = jointFriendly;
            }

        });

        // Check for left navigation
        (function LeftNavigateDetected() {
            // ISMAEL Gesture names should reflect the description of the position of the body, not the intended action it is to cause
            var gestureName = "RightWristAcrossBody";
            var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName, dictionary, side);

            if (wristRight.Joint.Position.X < shoulderLeft.Joint.Position.X && wristRight.TrackingState == "Tracked" && shoulderLeft.TrackingState == "Tracked")
            {
                bus.publish({
                    channel: channel,
                    topic: gestureName,
                    source: source,
                    data: {
                        message: 'Right wrist across body detected',
                        gestureInformation: gestureInformation
                    }
                });
            }
        })();

        // Check for right navigation
        (function RightNavigateDetected() {

            var gestureName = "LeftWristAcrossBody";
            var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName, dictionary, side);

            if (wristLeft.Joint.Position.X > shoulderRight.Joint.Position.X && wristLeft.TrackingState == "Tracked" && shoulderRight.TrackingState == "Tracked") {
                bus.publish({
                    channel: channel,
                    topic: gestureName,
                    source: source,
                    data: {
                        message: 'Right movement detected',
                        gestureInformation: gestureInformation
                    }
                });
            }
        })();

        // Check for up navigation
        (function LeftNavigateDetected() {
            var gestureName = "RightWristAboveHead";
            var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName, dictionary, side);

            if (wristRight.Joint.Position.Y >= head.Joint.Position.Y && wristRight.TrackingState == "Tracked" && head.TrackingState == "Tracked") {
                bus.publish({
                    channel: channel,
                    topic: gestureName,
                    source: source,
                    data: {
                        message: 'Right wrist above head detected',
                        gestureInformation: gestureInformation
                    }
                });
            }
        })();

        // Check for down navigation
        (function LeftNavigateDetected() {
            var gestureName = "LeftWristAboveHead";
            var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName, dictionary, side);

            if (wristLeft.Joint.Position.Y >= head.Joint.Position.Y && wristLeft.TrackingState == "Tracked" && head.TrackingState == "Tracked") {
                bus.publish({
                    channel: channel,
                    topic: gestureName,
                    source: source,
                    data: {
                        message: 'Left wrist above head detected',
                        gestureInformation: gestureInformation
                    }
                });
            }
        })();

    }


    return {
        ProcessInput: ProcessInput
    }
})