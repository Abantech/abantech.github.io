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
        "Topic": "RightThumbsUp",
        "Source": "Input.Processed.Efficio",
        "Action": function (data) {
            if (data.gestureInformation.GestureDuration() > 1 && !data.gestureInformation.Fired) {
                alert('Good Color!');
                data.gestureInformation.Fired = true;
            }
        }
    }, {
        "Topic": "RightHandSwipe",
        "Source": "Input.Processed.Efficio",
        "Action": function (data) {
            console.log('RightHandSwipe')
            console.log(data.gestureInformation.SwipeVelocity)
            console.log(data.gestureInformation.GestureDuration())

            if (colorIndex == 3) {
                colorIndex = 0
            }
            else {
                colorIndex++;
            }
        }
    }, {
        "Topic": "LeftHandSwipe",
        "Source": "Input.Processed.Efficio",
        "Action": function (data) {
            console.log('LeftHandSwipe')

        }
    },
        {
            "Source": "Devices",
            "Topic": "Connected",
            "Action": function (Data, Device) {

            },
            "Arguments":
            [
                {
                    "Name": "name",
                    "MapTo": "Device"
                },
                {
                    "Source": "Gesture",
                    "Name": "test",
                    "MapTo": "Data"
                },
            ],
        }, ],
    AudioCommands: {
        "make :size (foot) :color container": Test.makeContainerByVoice,
    }
}