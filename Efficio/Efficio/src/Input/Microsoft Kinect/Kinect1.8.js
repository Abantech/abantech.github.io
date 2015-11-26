define(['postal'], function (bus) {
    var source = 'Kinect';
    var trackingType = 'Seated';
    var controller;
    var device = "Kinect1.8";


    return {
        Initialize: function () {

            // Create Controller
            controller = new WebSocket("ws://localhost:8181");

            // Sends message when controller is connected
            controller.onopen = function () {
                bus.publish({
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
            controller.onmessage = function (frame) {
                // SKELETON DATA
                var jsonObject = JSON.parse(frame.data);

                bus.publish({
                    channel: 'Input.Raw',
                    topic: device,
                    source: source,
                    data: {
                        trackingType: trackingType,
                        input: frame
                    }
                });
            };
        }
    }
});