define(['postal', 'Input/DeviceManager'], function (bus, deviceManager) {
    var source = "Geolocaiton"
    var trackingType = 'Location';
    var pollTime;
    var enabled = false;

    function getGeolocation() {
        navigator.geolocation.getCurrentPosition(publishPosition);

        // Only poll for location every 30
        setTimeout(getGeolocation, pollTime);
    }

    function publishPosition(location) {
        bus.publish({
            channel: 'Input.Raw.Device',
            topic: 'Location',
            source: source,
            data: {
                TrackingType: trackingType,
                Location: location
            }
        });
    }

    function Initialize(EfficioConfiguration) {
        if (EfficioConfiguration.Devices.Location) {
            if (window.navigator) {
                if (navigator.geolocation) {
                    enabled = true;
                    pollTime = EfficioConfiguration.Devices.Location.PollingInterval * 1000 || 3000;

                    var device = {
                        Name: 'Location',
                        Manufacturer: 'Unknown',
                        Device: navigator.geolocation
                    }

                    deviceManager.Add(source, device, function () {
                        return enabled;
                    });
                }
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