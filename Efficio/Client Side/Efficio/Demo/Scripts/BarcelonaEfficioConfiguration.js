var EfficioConfiguration = {
    Devices: {
        Microphone: false,
        Kinect: {
            Host: "ws://localhost:8181"
        },
        LeapMotion: {
            Port: 6437,
            Host: 'localhost',
            EnableGestures: false,
            FrameEventName: 'animationFrame',
            UseAllPlugins: false
        }
    }
}