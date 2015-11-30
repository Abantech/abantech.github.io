define(['postal', 'Input/DeviceManager'], function (bus, deviceManager) {
    var source = "Geolocaiton"
    var trackingType = 'Location';
    var enabled = false;

    function getGeolocation() {
        navigator.geolocation.getCurrentPosition(publishPosition);
        window.requestAnimationFrame(getGeolocation);
    }

    function publishPosition(location) {
        bus.publish({
            channel: 'Input.Raw',
            topic: 'Location',
            source: source,
            data: {
                TrackingType: trackingType,
                Location: location
            }
        });
    }

    function Initialize(EfficioConfiguration) {
        if (window.navigator) {
            if (navigator.geolocation) {
                enabled = true;
            }
        }
    }

    function Start() {
        if (enabled) {
            window.requestAnimationFrame(getGeolocation);
        }
    }

    return {
        Initialize: Initialize,
        Start: Start
    }
});