EfficioConfiguration = {
    Devices: {
        Microphone: false,
        Kinect: {
			 Host: "ws://localhost:8181",
			 Version: 2.0
		},
        Leapmotion: {
			Host: 'localhost',
            Port: 6437,
            EnableGestures: false,
            FrameEventName: 'animationFrame',
            UseAllPlugins:false
		},
        RealSense: {
			            SenseType: 'Hands',
            Gestures: false
		},
		XR3D:{
			Host: "ws://localhost:8181"
		},
        Location: {
			PollingInterval: 3
		},
        Orientation: true
    },
    ActionToFunctionMapping: ActionToFunctionMapping
}