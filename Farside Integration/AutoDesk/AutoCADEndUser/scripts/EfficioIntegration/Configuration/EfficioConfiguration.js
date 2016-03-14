EfficioConfiguration = {
    Devices: {
        Microphone: false,
        Kinect: false,
        LeapMotion: true,
        RealSense: false,
        XR3D: false,
        Location: false,
        Orientation: true
    },

    ActionToFunctionMapping: ActionToFunctionMapping
}

/*
To use broadcaster use:

        LeapMotion: {
            Host: "127.0.0.1", // replace with external IP address
            port: 3003, // make sure this port is open on firewall/router
            EnableGestures: true
        }
*/