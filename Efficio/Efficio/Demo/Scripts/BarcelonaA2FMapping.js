ActionToFunctionMapping = {
    Bridge: Barcelona,
    ActionMappings: [{
        Topic: "RightHandFlexedAndProne",
        Source: "Input.Processed.Efficio",
        Action: "stepForward",
        FireRestrictions: {
            FireOnce: false,
            FireAfterXFrames: 7
        }
    }, {
        Topic: "RightHandExtendedAndProne",
        Source: "Input.Processed.Efficio",
        Action: "stepBackward",
        FireRestrictions: {
            FireOnce: false,
            FireAfterXFrames: 7
        }
    }, {
        Topic: "LeftHandExtendedAndNeutral",
        Source: "Input.Processed.Efficio",
        Action: "stepLeft",
        FireRestrictions: {
            FireOnce: false,
            FireAfterXFrames: 7
        }
    }, {
        Topic: "LeftHandFlexedAndNeutral",
        Source: "Input.Processed.Efficio",
        Action: "stepRight",
        FireRestrictions: {
            FireOnce: false,
            FireAfterXFrames: 7
        }
    }
    ]
}