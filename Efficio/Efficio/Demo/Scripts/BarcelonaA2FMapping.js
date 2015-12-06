ActionToFunctionMapping = {
    Bridge: Barcelona,
    ActionMappings: [{
        Topic: "BothHandsProne",
        Source: "Input.Processed.Efficio",
        Action: "stepForward",
        FireRestrictions: {
            FireOnce: false,
            FireAfterXFrames: 7
        }
    }, {
        Topic: "BothHandsSupine", //To be developed
        Source: "Input.Processed.Efficio",
        Action: "stepBackward",
        FireRestrictions: {
            FireOnce: false,
            FireAfterXFrames: 7
        }
    }, {
        Topic: "RightHandsSupineLeftHandProne",
        Source: "Input.Processed.Efficio",
        Action: "stepLeft",
        FireRestrictions: {
            FireOnce: false,
            FireAfterXFrames: 7
        }
    }, {
        Topic: "LeftHandSupineRightHandProne",
        Source: "Input.Processed.Efficio",
        Action: "stepRight",
        FireRestrictions: {
            FireOnce: false,
            FireAfterXFrames: 7
        }
    }
    , {
        "Topic": "RightWristLeftOfLeftWrist",
        "Source": "Input.Processed.Efficio",
        "Action": "stepLeft",
        FireRestrictions: {
            FireOnce: false,
            FireAfterXFrames: 3
        }
    },
    {
        "Topic": "RightWristRightOfLeftWrist",
        "Source": "Input.Processed.Efficio",
        "Action": "stepRight",
        FireRestrictions: {
            FireOnce: false,
            FireAfterXFrames: 3
        }
    },
    {
        "Topic": "RightWristBehindLeftWrist",
        "Source": "Input.Processed.Efficio",
        "Action": "stepBackward",
        FireRestrictions: {
            FireOnce: false,
            FireAfterXFrames: 3
        }
    },
    {
        "Topic": "RightWristAheadOfLeftWrist",
        "Source": "Input.Processed.Efficio",
        "Action": "stepForward",
        FireRestrictions: {
            FireOnce: false,
            FireAfterXFrames: 3
        }
    }
    //,
    //{
    //    Topic: "Device Orientation",
    //    Source: "Input.Raw",
    //    Action: function(data) {
    //        controller.onDeviceOrientationChangeEvent( {
    //            gamma: data.DeviceOrientation.gamma,
    //            beta: data.DeviceOrientation.beta,
    //            alpha: data.DeviceOrientation.alpha
    //        } )
    //    }
    //}
    ]
}