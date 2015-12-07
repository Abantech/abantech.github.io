var EfficioConfiguration = {
    Devices: {
        Microphone: false,
        Kinect: {
            Host: "ws://localhost:8181"
        },
        LeapMotion: {
            Port: 6437,
            Host: '192.168.1.8',
            EnableGestures: false,
            FrameEventName: 'animationFrame',
            UseAllPlugins: false
        }
    }
}