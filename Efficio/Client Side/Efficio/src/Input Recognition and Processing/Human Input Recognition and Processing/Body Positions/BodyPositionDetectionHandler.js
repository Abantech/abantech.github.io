define(['postal'], function (bus) {

    var source = 'Efficio Gesture Grimoire';
    var channel = 'Input.Processed.Efficio';
    var dictionary = 'BodyPosition';
    var trackingType = 'Body';
    var side;
    var ActiveGesturesDictionary;

    var bodyPositionDetector;
    var name = "Body Position Detector";

    var joint1; // right wrist
    var joint2; // left wrist
    var joint3; // head

    function RightWristAheadOfLeftWrist() {
        var gestureName = "RightWristAheadOfLeftWrist";
        if (AreJointsTracked(joint1, joint2)) {
            if (joint1.IsForwardOf(joint2)) {
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
            } else {
                ActiveGesturesDictionary.DeleteEntry(trackingType, gestureName, dictionary, side);
            }
        }
    };// END RightWristAheadOfLeftWrist

    function RightWristBehindOfLeftWrist() {
        var gestureName = "RightWristBehindLeftWrist";
        if (AreJointsTracked(joint1, joint2)) {
            if (joint1.IsBehindOf(joint2)) {
                var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName, dictionary, side);

                bus.publish({
                    channel: channel,
                    topic: gestureName,
                    source: source,
                    data: {
                        message: 'Right wrist behind left wrist detected',
                        gestureInformation: gestureInformation
                    }
                });
            } else {
                ActiveGesturesDictionary.DeleteEntry(trackingType, gestureName, dictionary, side);
            }
        }
    };// END RightWristBehindLeftWrist

    function RightWristAboveHead() {
        var gestureName = "RightWristAboveHead";
        if (AreJointsTracked(joint1, joint3)) {
            if (joint1.IsAboveOf(joint3)) {
                var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName, dictionary, side);

                bus.publish({
                    channel: channel,
                    topic: gestureName,
                    source: source,
                    data: {
                        message: 'Right wrist above head detected',
                        gestureInformation: gestureInformation
                    }
                });
            } else {
                ActiveGesturesDictionary.DeleteEntry(trackingType, gestureName, dictionary, side);
            }
        }
    };// END RightWristAboveHead

    function LeftWristAboveHead() {
        var gestureName = "LeftWristAboveHead";
        if (AreJointsTracked(joint2, joint3)) {
            if (joint2.IsAboveOf(joint3)) {
                var gestureInformation = ActiveGesturesDictionary.CreateOrUpdateEntry(trackingType, gestureName, dictionary, side);

                bus.publish({
                    channel: channel,
                    topic: gestureName,
                    source: source,
                    data: {
                        message: 'Left wrist above head detected',
                        gestureInformation: gestureInformation
                    }
                });
            } else {
                ActiveGesturesDictionary.DeleteEntry(trackingType, gestureName, dictionary, side);
            }
        }
    };// END LeftWristAboveHead

    function GetJoints(data) {
        data.input.forEach(function (jointFriendly) {

            // Get the joints we are using to identify navigation
            if (jointFriendly.JointName == "WristRight") {
                joint1 = jointFriendly;
            }

            if (jointFriendly.JointName == "WristLeft") {
                joint2 = jointFriendly;
            }

            if (jointFriendly.JointName == "Head") {
                joint3 = jointFriendly;
            }

        });
    }// END GetJoints

    function AreJointsTracked(joint1, joint2) {
        return joint1.IsTracked && joint2.IsTracked;
    }

    function ProcessInput(data, agd) {

        ActiveGesturesDictionary = agd;
        GetJoints(data);

        if (!bodyPositionDetector) {
            bodyPositionDetector = {
                Name: name,
                TrackingType: trackingType,
                Dictionary: dictionary,
                SubDictionary1: side,
                Positions: {
                    //RightWristAheadOfLeftWrist: RightWristAheadOfLeftWrist,  // Not In Use for Demo on 12/7/15
                    //RightWristBehindOfLeftWrist: RightWristBehindOfLeftWrist,
                    RightWristAboveHead: RightWristAboveHead,
                    LeftWristAboveHead: LeftWristAboveHead,
                }
            }
        }

        for (var position in bodyPositionDetector.Positions) {
            bodyPositionDetector.Positions[position]();
        }

        return bodyPositionDetector;

    }


    return {
        ProcessInput: ProcessInput
    }
})