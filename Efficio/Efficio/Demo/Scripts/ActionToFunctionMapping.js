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