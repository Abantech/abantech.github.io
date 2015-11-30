var EfficioConfiguration = {
    devices: {
        microphone: true,
        kinect: {
            Host: "ws://localhost:8181"
        },
        leapmotion: {
            Port: 6437,
            Host: '127.0.0.1',
            EnableGestures: false,
            FrameEventName: 'animationFrame',
            UseAllPlugins: false
        }
    }
}