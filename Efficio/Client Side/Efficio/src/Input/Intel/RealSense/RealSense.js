define(['realsense', 'Input/DeviceManager', 'promise', 'autobahn'], function (realsense, deviceManager, p, ab) {
    window.autobahn = ab;
    var source = 'Intel RealSense';
    var trackingType;
    var useNativeGestures;

    function Configure(RealSenseConfiguration) {
        RealSenseConfiguration ={
            SenseType: RealSenseConfiguration.SenseType || 'Hands',
            Gestures: RealSenseConfiguration.Gestures || false
        }

        return RealSenseConfiguration;
    }

    function Initialize() {
        // Tells RealSense what to look for
        RealSenseConfiguration = Configure(Efficio.Configuration.Devices.RealSense);
        trackingType = RealSenseConfiguration.SenseType;
        useNativeGestures = RealSenseConfiguration.Gestures;

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