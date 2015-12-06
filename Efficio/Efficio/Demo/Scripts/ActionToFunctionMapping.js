ActionToFunctionMapping = {
    "Bridge": Test,
    "ActionMappings": [{
        "Topic": "Leap",
        "Source": "Input.Raw",
        "Action": "leapAnimate",
    }, {
        "Topic": "BothHandsNeutral",
        "Source": "Input.Processed.Efficio",
        "Action": "CreateAndScale",
    },
    {
        "Topic": "BothHandsPronation",
        "Source": "Input.Processed.Efficio",
        "Action": "Destroy",
    },
    {
        "Topic": "LeftHandNeutralAndProne",
        "Source": "Input.Processed.Efficio",
        "Action": function (data) {
            console.log('LeftHandNeutralAndProne');
        },
        FireRestrictions: {
            FireOnce: true,
            FireAfterXFrames: 15
        }
    }, {
        "Topic": "LeftHandFlexedAndProne",
        "Source": "Input.Processed.Efficio",
        "Action": function (data) {
            console.log('LeftHandFlexedAndProne');
        },
        FireRestrictions: {
            FireOnce: true,
            FireAfterXFrames: 15
        }
    }, {
        "Topic": "LeftHandExtendedAndProne",
        "Source": "Input.Processed.Efficio",
        "Action": function (data) {
            console.log('LeftHandExtendedAndProne');
        },
        FireRestrictions: {
            FireOnce: true,
            FireAfterXFrames: 15
        }
    }, {
        "Topic": "LeftHandNeutralAndNeutral",
        "Source": "Input.Processed.Efficio",
        "Action": function (data) {
            console.log('LeftHandNeutralAndNeutral');
        },
        FireRestrictions: {
            FireOnce: true,
            FireAfterXFrames: 15
        }
    }, {
        "Topic": "LeftHandFlexedAndNeutral",
        "Source": "Input.Processed.Efficio",
        "Action": function (data) {
            console.log('LeftHandFlexedAndNeutral');
        },
        FireRestrictions: {
            FireOnce: true,
            FireAfterXFrames: 15
        }
    }, {
        "Topic": "LeftHandExtendedAndNeutral",
        "Source": "Input.Processed.Efficio",
        "Action": function (data) {
            console.log('LeftHandExtendedAndNeutral');
        },
        FireRestrictions: {
            FireOnce: true,
            FireAfterXFrames: 15
        }
    }, {
        "Topic": "LeftHandSwipe",
        "Source": "Input.Processed.Efficio",
        "Action": function (data) {
            if (colorIndex == 3) {
                colorIndex = 0
            }
            else {
                colorIndex++;
            }
        }
    },
     {
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
        }]
}