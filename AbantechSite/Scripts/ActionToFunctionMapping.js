ActionToFunctionMapping = {
    "PluginName": "EfficioSitePlugin.js",
    "ActionMappings": [
        {
            "Source": "Input.Processed.Efficio",
            "Topic": "UpDirectionDetected",
            "Action": "UpDirectionDetected",
        },
        {
            "Source": "Input.Processed.Efficio",
            "Topic": "DownDirectionDetected",
            "Action": "DownDirectionDetected",
        },
        {
            "Source": "Devices",
            "Topic": "Connected",
            "Action": "DeviceRegistered",
            "Arguments":
 [
                {
                    "Source": "Gesture",
                    "Name": "name",
                    "MapTo": "Device"
                }
            ],
        },
        {
            "Source": "Input.Audio.Processed.Efficio",
            "Topic": "Hello",
            "Action": "Hello",
        },
        {
            "Source": "Input.Audio.Processed.Efficio",
            "Topic": "Next",
            "Action": "NextSection",
        },
        {
            "Source": "Input.Audio.Processed.Efficio",
            "Topic": "Last",
            "Action": "LastSection",
        },
        {
            "Source": "Input.Audio.Processed.Efficio",
            "Topic": "*",
            "Action": "GoToSection",
            "Arguments":
 [
                {
                    "Source": "Device",
                    "Name": "message",
                    "MapTo": "Message"
                }
            ],
        }, 
        {
            "Source": "Input.Processed.Efficio",
            "Topic": "OneFingersExtended",
            "Action": "Point",
            "Arguments":[
                {
                    "Source": "Gesture",
                    "Name": "frame",
                    "MapTo": "Frame"
                },
                {
                    "Source": "Gesture",
                    "Name": "extendedFingers",
                    "MapTo": "PointedFingers"
                }
            ],
        }
    ]
}