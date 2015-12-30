define(['postal'], function (bus) {

    var dipr = { PrototypeExtensions: {}, };

    function Initialize(EfficioConfiguration) {
        // Extend input models for easier processing and to make them more informative

        require(['Input Recognition and Processing/Device Input Recognition and Processing/CustomDeviceLibrary'], function (customGestureLibraries) {
            dipr.CustomGestureLibrary = customGestureLibraries.Initialize();

            bus.subscribe({
                channel: "Input.Raw.Device",
                topic: "*",
                callback: function (data, envelope) {
                    customGestureLibraries.ProcessInput(data, envelope);
                }
            });
        }), function (err) {
            bus.publish({
                channel: 'UserNotification',
                topic: 'Warn',
                source: source,
                data: {
                    message: 'No custom gesture library configured'
                }
            });
        };

        require(['Input Recognition and Processing/Device Input Recognition and Processing/EfficioDeviceGrimoire'], function (efficioGestureLibrary) {
            dipr.EfficioGestureLibrary = efficioGestureLibrary.Initialize();

            bus.subscribe({
                channel: "Input.Raw.Device",
                topic: "*",
                callback: function (data, envelope) {
                    efficioGestureLibrary.ProcessInput(data, envelope);
                }
            });
        });

        return dipr;
    }

    return {
        Initialize: Initialize
    }
});