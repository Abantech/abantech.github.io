define(['realsense', 'Input/DeviceManager', 'promise', 'autobahn'], function (realsense, deviceManager, p, ab) {
    window.autobahn = ab;
    var source = 'Intel RealSense';
    var trackingType;
    var useNativeGestures;

    function Initialize(EfficioConfiguration) {
        // Tells RealSense what to look for
        trackingType = EfficioConfiguration.Devices.RealSense.SenseType || 'Hands';
        useNativeGestures = EfficioConfiguration.Devices.RealSense.Gestures || false;

        return {
            TrackingType: trackingType,
            UseNativeGestures: useNativeGestures
        };
    }

    function Start() {
        // TODO test with just 'realsense'
        intel.realsense.SenseManager.createInstance().then(function (result) {
            sense = result;

            if (trackingType === 'Hands') {
                require(['Input/Intel/RealSense/Sense Type/Hands/HandTracking'], function (handler) {
                    handler.Start(sense, useNativeGestures);
                });
            }

        });
    }

    return {
        Initialize: Initialize,
        Start: Start
    }

});