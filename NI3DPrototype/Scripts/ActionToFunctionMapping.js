ActionToFunctionMapping = {
    "PluginName": "CharetPlugin.js",
    "ActionMappings": [

        {
            "Source": "Devices",
            "Topic": "Connected",
            "Action": "DeviceRegistered",
            "Arguments": [
                 {
                     "Source": "Gesture",
                     "Name": "name",
                     "MapTo": "Name"
                 }, {
                    "Source": "Gesture",
                    "Name": "device",
                    "MapTo": "Device"
                 }, {
                     "Source": "Gesture",
                     "Name": "controller",
                     "MapTo": "ctrl"
                 }
            ],
        },
        {
            "Source": "Input.Raw",
            "Topic": "Leap",
            "Action": "LeapInput",
            "Arguments": [
                {
                    "Source": "Device",
                    "Name": "input",
                    "MapTo": "Frame"
                }
            ],
        }
    ]
}