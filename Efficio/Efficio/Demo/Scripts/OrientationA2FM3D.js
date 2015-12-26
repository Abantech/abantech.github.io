Test = {};

ActionToFunctionMapping = {
    Bridge: Test,
    ActionMappings: [{
        Topic: "Device Orientation",
        Source: "Input.Raw",
        Action: function (data) {
            controls.onDeviceOrientationChangeEvent(data.DeviceOrientation);
        }
    }, {
        Topic: "Orientation Change",
        Source: "Input.Raw",
        Action: function (data) {
            controls.onScreenOrientationChangeEvent(data.DeviceOrientation);
        }
    }, ]
}