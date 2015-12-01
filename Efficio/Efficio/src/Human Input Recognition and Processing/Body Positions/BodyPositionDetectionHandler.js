define(['postal'], function (bus) {
    function ProcessInput(data, ActiveGesturesDictionary) {
        var source = 'Efficio Gesture Grimoire';
        var channel = 'Input.Processed.Efficio';
        var dictionary = 'BodyPosition';



        // Check if there is any input and if the input contains hands

        var wristRight;
        var shoulderRight;
        var wristLeft;
        var shoulderLeft;

        data.input.forEach(function (jointFriendly) {

            // Get the 4 joints we are using to identify navigation
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

        });

        // Check for left navigation
        (function LeftNavigateDetected() {
            // ISMAEL Gesture names should reflect the description of the position of the body, not the intended action it is to cause
            var gestureName = "RightWristAcrossBodyDetected";
            if (wristRight.Joint.Position.X < shoulderLeft.Joint.Position.X && wristRight.TrackingState == "Tracked" && shoulderLeft.TrackingState == "Tracked")
            {
                //bus.publish({
                //    channel: channel,
                //    topic: gestureName,
                //    source: source,
                //    data: {
                //        message: 'Left movement detected',
                //        gestureInformation: gestureInformation
                //    }
                //});

                console.log(gestureName);
            }
        })();

        // Check for right navigation
        (function RightNavigateDetected() {

            var gestureName = "LeftWristAcrossBodyDetected";
            if (wristLeft.Joint.Position.X > shoulderRight.Joint.Position.X && wristLeft.TrackingState == "Tracked" && shoulderRight.TrackingState == "Tracked") {
                //bus.publish({
                //    channel: channel,
                //    topic: gestureName,
                //    source: source,
                //    data: {
                //        message: 'Right movement detected',
                //        gestureInformation: gestureInformation
                //    }
                //});

                console.log(gestureName);
            }
        })();

    }


    return {
        ProcessInput: ProcessInput
    }
})