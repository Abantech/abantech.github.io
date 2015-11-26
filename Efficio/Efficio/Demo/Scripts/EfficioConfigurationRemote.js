var EfficioConfiguration = {
    devices: {
        microphone: true,
        kinect: {
            Server: "ws://localhost:8181",
            LogActions: true
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