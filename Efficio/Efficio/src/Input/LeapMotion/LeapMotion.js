define(['postal', 'leapjs', 'Input/DeviceManager'], function (bus, Leap, deviceManager) {
    var source = 'Leap Motion';
    var trackingType = 'Hands';
    var controller;

    function configure(EfficioConfiguration) {
        var LeapConfiguration = EfficioConfiguration.Devices.LeapMotion;
        LeapConfiguration = {
            Host: LeapConfiguration.Host || 'localhost',
            Port: LeapConfiguration.Port || 6437,
            EnableGestures: LeapConfiguration.EnableGestures || false,
            FrameEventName: LeapConfiguration.FrameEventName || 'animationFrame',
            UseAllPlugins: LeapConfiguration.UseAllPlugins || false
        }

        return LeapConfiguration;
    }

    return {
        Initialize: function (LeapConfiguration) {

            // Load Configuration
            LeapConfiguration = configure(LeapConfiguration);

            // Create Controller
            controller = new Leap.Controller({
                host: LeapConfiguration.Host,
                port: LeapConfiguration.Port,
                enableGestures: LeapConfiguration.EnableGestures,
                frameEventName: LeapConfiguration.FrameEventName,
                useAllPlugins: LeapConfiguration.UseAllPlugins
            });

            // Register Leap Motion's native gesture recognition
            controller.on("gesture", function (gesture) {
                if (gesture.state == "stop") {
                    bus.publish({
                        channel: 'Input.Raw',
                        topic: 'Gesture',
                        source: source,
                        data: {
                            Name: gesture.type,
                            Gesture: gesture
                        }
                    });
                }
            });

            controller.connect();

            // Add Leap Motion to Device Manager
            deviceManager.Add("LeapMotion", controller);
            deviceManager.Devices["LeapMotion"].IsConnected = function () {
                return controller.connected();
            }
        },

        Start: function () {

            // Listens for input from device
            controller.loop(function (frame) {
                if (frame.valid) {
                    bus.publish({
                        channel: 'Input.Raw',
                        topic: 'Leap',
                        source: source,
                        data: {
                            TrackingType: trackingType,
                            Input: frame
                        }
                    });
                }
            });
        }
    }
});