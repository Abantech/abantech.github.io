define(['postal', 'Input/DeviceManager'], function (bus, deviceManager) {
    var source = "Accelerometer"
    var trackingType = 'Orientation';
    var started = false;

    function Initialize(EfficioConfiguration) {
        // Listen for orientation changes
        window.addEventListener("deviceorientation", function (event) {
            if (started) {
                bus.publish({
                    channel: 'Input.Raw.Device',
                    topic: 'Device Orientation',
                    source: source,
                    data: {
                        TrackingType: trackingType,
                        DeviceOrientation: event
                    }
                });
            }
        }, false);

        window.addEventListener("orientationchange", function () {
            if (started) {
                bus.publish({
                    channel: 'Input.Raw.Device',
                    topic: 'Orientation Change',
                    source: source,
                    data: {
                        TrackingType: trackingType,
                        DeviceOrientation: window.orientation || 0
                    }
                });
            }
        }, false);
    }

    function Start() {
        started = true;
        deviceManager.Add(source, {
            Name: source,
            Manufacturer: "Unknown"
        },
        function () {
            return true;
        });
    }

    return {
        Initialize: Initialize,
        Start: Start
    }

});