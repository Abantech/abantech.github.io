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
                            "Name": "device",
                            "MapTo": "Device"
                        }
                    ],
                }
    ]
}