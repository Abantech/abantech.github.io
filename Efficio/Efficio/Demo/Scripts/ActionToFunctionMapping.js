ActionToFunctionMapping = {
    Bridge: Test,
    ActionMappings: [{
        Topic: "Leap",
        Source: "Input.Raw",
        Action: "leapAnimate",
    }, {
        Topic: "RightHandExtended",
        Source: "Input.Processed.Efficio",
        Action: function () {
            console.log("RightHandExtended")
        }
    }, {
        Topic: "LeftHandExtended",
        Source: "Input.Processed.Efficio",
        Action: function () {
            console.log("LeftHandExtended")
        }
    }, {
        Topic: "RightHandFlexed",
        Source: "Input.Processed.Efficio",
        Action: function () {
            console.log("RightHandFlexed")
        }
    }, {
        Topic: "LeftHandFlexed",
        Source: "Input.Processed.Efficio",
        Action: function () {
            console.log("LeftHandFlexed")
        }
    }, {
        Topic: "Device Orientation",
        Source: "Input.Raw",
        Action: function (data) {
            controls.registerOrientationData(data.DeviceOrientation);
        }
    }, {
        Topic: "Orientation Change",
        Source: "Input.Raw",
        Action: function () {
            controls.onScreenOrientationChangeEvent(data.DeviceOrientation);
        }
    }, ]
}