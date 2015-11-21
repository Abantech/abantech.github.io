define(['postal', 'leapjs'], function (bus, Leap) {
    var source = 'Leap Motion';
    var trackingType = 'Hands';
    var controller;

    function configure(LeapConfiguration)
    {
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

            // Register Leap's native gesture recognition
            controller.on("gesture", function (gesture) {
                if (gesture.state == "stop") {
                    bus.publish({
                        channel: 'Input.Raw',
                        topic: 'Gesture',
                        source: source,
                        data: {
                            name: gesture.type,
                            gesture: gesture
                        }
                    });
                }
            });

            // Sends message when controller is connected
            controller.on("connect", function () {
                bus.publish({
                    channel: 'Devices',
                    topic: 'Connected',
                    source: source,
                    data: {
                        name: source,
                        device: Leap,
                        controller: controller
                    }
                });
            });

            controller.connect();
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
                            trackingType: trackingType,
                            input: frame
                        }
                    });
                }
            });
        }
    }
});