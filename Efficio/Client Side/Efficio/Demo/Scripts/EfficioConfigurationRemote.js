var EfficioConfiguration = {
    devices: {
        microphone: true,
        Kinect: {
            Host: "ws://localhost:8181"
        },
        Leapmotion: {
            Port: 6437,
            Host: '127.0.0.1',
            EnableGestures: false,
            FrameEventName: 'animationFrame',
            UseAllPlugins: false
        }
    }
}