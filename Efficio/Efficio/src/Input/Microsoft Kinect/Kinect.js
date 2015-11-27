define(['postal'], function (bus) {
    var source = 'Kinect';
    var trackingType = 'Seated';
    var controller;
    var device = "KinectV1";

    function configure(KinectConfiguration) {
        KinectConfiguration = {
            Host: KinectConfiguration.Host || "ws://localhost:8181"
        }

        return KinectConfiguration;
    }

    return {
        Initialize: function (KinectConfiguration) {

            // Load Configuration
            KinectConfiguration = configure(KinectConfiguration);

            console.log("Attempting Connection.");
            // Create Controller
            controller = new WebSocket(KinectConfiguration.Host);

            // Sends message when controller is connected
            controller.onopen = function () {
            console.log("Connection successful.");

                
                bus.publish
                ({
                    channel: 'Devices',
                    topic: 'Connected',
                    source: source,
                    data: {
                        name: source,
                        device: "Kinect",
                        controller: controller,
                        test: 'test'
                    }
                });
            };

            // Connection closed.
            controller.onclose = function () {
                    console.log("Connection closed.");

            }
        },

        Start: function () {

            // Listens for input from device
            controller.onmessage = function (frame)
            {

               console.log("received data from socket");              
                // SKELETON DATA
                //var jsonObject = JSON.parse(frame.data);

                console.log(frame);

                bus.publish
                ({
                    channel: 'Input.Raw',
                    topic: device,
                    source: source,
                    data:
                    {
                        trackingType: trackingType,
                        input: frame
                    }
                });
            };
        }
    }
});