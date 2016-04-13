define(['postal', 'leapjs', 'Input/DeviceManager', 'Input/LeapMotion/HelperFunctions'], function (bus, Leap, deviceManager, helper) {
    var source = 'LeapMotion';
    var trackingType = 'Hands';
    var controller;

    function configure(EfficioConfiguration) {
        var LeapConfiguration = EfficioConfiguration.Devices.LeapMotion;
        LeapConfiguration = {
            Host: LeapConfiguration.Host || 'localhost',
            Port: LeapConfiguration.Port || 6437,
            EnableGestures: LeapConfiguration.EnableGestures || false,
            FrameEventName: LeapConfiguration.FrameEventName || 'animationFrame',
            UseAllPlugins: LeapConfiguration.UseAllPlugins || false,
            OptimizeHMD: LeapConfiguration.OptimizeHMD || false,
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
                useAllPlugins: LeapConfiguration.UseAllPlugins,
                optimizeHMD: LeapConfiguration.OptimizeHMD
            });

            // Register Leap Motion's native gesture recognition
            controller.on("gesture", function (gesture) {
                if (gesture.state == "stop") {
                    bus.publish({
                        channel: 'Input.Raw.Human',
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

            var device = {
                Name: 'Leap Motion',
                Manufacturer: 'Leap',
                Device: controller,
                Helper: helper
            }

            // Add Leap Motion to Device Manager
            deviceManager.Add(source, device, function () {
                return controller.connected();
            });
        },

        Start: function () {

            // Listens for input from device
            controller.loop(function (frame) {
                if (frame.valid) {
                    bus.publish({
                        channel: 'Input.Raw.Human',
                        topic: 'Leap',
                        source: source,
                        data: {
                            TrackingType: trackingType,
                            Frame: frame,
                            Controller: controller,
                            Hands: frame.hands
                        }
                    });
                }
            });
        }
    }
});