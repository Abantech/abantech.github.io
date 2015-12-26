Test = {};

ActionToFunctionMapping = {
    Bridge: Test,
    ActionMappings: [{
        Topic: "Device Orientation",
        Source: "Input.Raw",
        Action: function (data) {
            if (controls) {
                controls.onDeviceOrientationChangeEvent(data.DeviceOrientation);
            }
        }
    }, {
        Topic: "Orientation Change",
        Source: "Input.Raw",
        Action: function (data) {
            if (controls) {
                controls.onScreenOrientationChangeEvent(data.DeviceOrientation);
            }
        }
    },
    ]
}