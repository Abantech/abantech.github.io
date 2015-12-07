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
    },

    {
        Topic: "BothHandsSupine",
        Source: "Input.Processed.Efficio",
        Action: "stepBackward",
        FireRestrictions: {
            FireOnce: false,
            FireAfterXFrames: 7
        }
    },

    {
        Topic: "RightHandSupineLeftHandProne",
        Source: "Input.Processed.Efficio",
        Action: "stepLeft",
        FireRestrictions: {
            FireOnce: false,
            FireAfterXFrames: 7
       }
    },

    {
        Topic: "LeftHandSupineRightHandProne",
        Source: "Input.Processed.Efficio",
        Action: "stepRight",
        FireRestrictions: {
            FireOnce: false,
            FireAfterXFrames: 7
        }
    },

    {
        Topic: "RightHandFlexedAndProne",
        Source: "Input.Processed.Efficio",
        Action: "lookDown",
        FireRestrictions: {
            FireOnce: false,
            FireAfterXFrames: 7
        }
    },

    {
        Topic: "RightHandExtendedAndProne",
        Source: "Input.Processed.Efficio",
        Action: "lookUp",
        FireRestrictions: {
            FireOnce: false,
            FireAfterXFrames: 7
        }
    },

    {
        Topic: "LeftHandExtendedAndNeutral",
        Source: "Input.Processed.Efficio",
        Action: "lookLeft",
        FireRestrictions: {
            FireOnce: false,
            FireAfterXFrames: 7
        }
    },

    {
        Topic: "RighHandFlexedAndNeutral",
        Source: "Input.Processed.Efficio",
        Action: "lookRight",
        FireRestrictions: {
            FireOnce: false,
            FireAfterXFrames: 3
         }
    },

    {
        "Topic": "LeftWristAboveHead",
        "Source": "Input.Processed.Efficio",
        "Action": "stepLeft",
        FireRestrictions: {
            FireOnce: false,
            FireAfterXFrames: 1
        }
    },

    {
        "Topic": "RightWristAboveHead",
        "Source": "Input.Processed.Efficio",
        "Action": "stepRight",
        FireRestrictions: {
            FireOnce: false,
            FireAfterXFrames: 1
        }
    },

    {
        "Topic": "RightWristBehindLeftWrist",
        "Source": "Input.Processed.Efficio",
        "Action": "stepBackward",
        FireRestrictions: {
            FireOnce: false,
            FireAfterXFrames: 1
        }
    },

    {
        "Topic": "RightWristAheadOfLeftWrist",
        "Source": "Input.Processed.Efficio",
        "Action": "stepForward",
        FireRestrictions: {
            FireOnce: false,
            FireAfterXFrames: 1
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