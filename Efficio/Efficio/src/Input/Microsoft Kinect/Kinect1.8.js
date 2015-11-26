define(['postal'], function (bus) {
    var source = 'Kinect';
    var trackingType = 'Seated';
    var controller;
    var device = "Kinect1.8";

    function configure(KinectConfiguration) {
        KinectConfiguration = {
            Server: KinectConfiguration.Host || "ws://localhost:8181",
            LogActions: KinectConfiguration.LogActions || false
        }

        return KinectConfiguration;
    }

    return {
        Initialize: function (KinectConfiguration) {

            // Create Controller
            controller = new WebSocket(KinectConfiguration.Server);

            // Sends message when controller is connected
            controller.onopen = function () {

                if (KinectConfiguration.LogActions == true)
                {
                    console.log("Connection successful.");
                }
                
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
                if (KinectConfiguration.LogActions == true)
                {
                    console.log("Connection closed.");
                } 
            }
        },

        Start: function () {

            // Listens for input from device
            controller.onmessage = function (frame)
            {

                if (KinectConfiguration.LogActions == true)
                {
                    console.log("received data from socket");
                }
                
                // SKELETON DATA
                var jsonObject = JSON.parse(frame.data);

                if (KinectConfiguration.LogActions == true)
                {
                    console.log(frame);
                }

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