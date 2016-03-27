ActionToFunctionMapping = {
    "Bridge": ThreeDRoomPlugin,
    "ActionMappings": [
    {
        Topic: "Ready",
        Source: "Efficio",
        Action: "Ready"
    },
    {
        Topic: "Leap",
        Source: "Input.Raw.Human",
        Action: "DrawHands"
    },
    {
        Topic: "RawOrientationData",
        Source: "Input.Processed.Efficio.Device",
        Action: "CameraUpdate"
    },
    {
        Topic: "Orientation Change",
        Source: "Input.Raw.Device",
        Action: "SceneRotate"
    }]
}