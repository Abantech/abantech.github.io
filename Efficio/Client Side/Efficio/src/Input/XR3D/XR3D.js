define(['postal', 'Input/DeviceManager'], function (bus, deviceManager) {
    var source = 'XR3D';
    var TrackingType = 'asdf';
    var controller;
    var device = "XR3D";

    function configure(XR3DConfiguration) {
        XR3DConfiguration = {
            Host: XR3DConfiguration.Host || "ws://localhost:8181"
        }

        return XR3DConfiguration;
    }

    function Initialize(XR3DConfiguration) {
        // Load Configuration
        XR3DConfiguration = configure(XR3DConfiguration);

        // Create Controller
        controller = new WebSocket(XR3DConfiguration.Host);

        // Sends message when controller is connected
        controller.onopen = function () {
            console.log("Connection successful.");

            var device = {
                Name: 'XR3D',
                Manufacturer: 'XR3D',
                Device: controller
            }

            // TODO: See if device can return connection status
            deviceManager.Add(source, device, function () {
                return true;
            });
        };

        // Connection closed.
        controller.onclose = function () {
            console.log("Connection closed.");

        }
    }

    function Start() {

        // Listens for input from device
        controller.onmessage = function (frame) {
            var skeleton = JSON.parse(frame.data);

            bus.publish
               ({
                   channel: 'Input.Raw',
                   topic: device,
                   source: source,
                   data:
                   {
                       TrackingType: TrackingType,
                       input: skeleton
                   }
               });
        }
    }

    return {
        Initialize: Initialize,
        Start: Start
    }
});