define(['postal'], function (bus) {

    var hipr = { PrototypeExtensions: {}, };

    function Initialize(EfficioConfiguration) {
        // Extend input models for easier processing and to make them more informative

        if (Efficio.Configuration.Devices.LeapMotion) {
            (function LeapMotionPrototypeExtensions() {
                hipr.PrototypeExtensions.LeapMotion = {};

                require(['Input Recognition and Processing/Human Input Recognition and Processing/Input Extensions/LeapMotion/HandExtensions'], function (handExtensions) {
                    hipr.PrototypeExtensions.LeapMotion.Hand = handExtensions.ExtendClasses();
                });

                require(['Input Recognition and Processing/Human Input Recognition and Processing/Input Extensions/LeapMotion/FingerExtensions'], function (fingerExtensions) {
                    hipr.PrototypeExtensions.LeapMotion.Finger = fingerExtensions.ExtendClasses();
                });
            })();
        }

        if (Efficio.Configuration.Devices.RealSense) {
            (function RealSensePrototypeExtensions() {
                hipr.PrototypeExtensions.RealSense = {};

                require(['Input Recognition and Processing/Human Input Recognition and Processing/Input Extensions/Intel/RealSense/HandExtensions'], function (handExtensions) {
                    hipr.PrototypeExtensions.RealSense.Hand = handExtensions.ExtendClasses();
                });
            })();
        }

        require(['Input Recognition and Processing/Human Input Recognition and Processing/CustomGestureLibrariesAccess'], function (customGestureLibraries) {
            hipr.CustomGestureLibrary = customGestureLibraries.Initialize();

            bus.subscribe({
                channel: "Input.Raw.Human",
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

        require(['Input Recognition and Processing/Human Input Recognition and Processing/EfficioGestureGrimoire'], function (efficioGestureGrimoire) {
            hipr.EfficioGestureGrimoire = efficioGestureGrimoire.Initialize();

            bus.subscribe({
                channel: "Input.Raw.Human",
                topic: "*",
                callback: function (data, envelope) {
                    efficioGestureGrimoire.ProcessInput(data, envelope);
                }
            });
        });

        return hipr;
    }

    return {
        Initialize: Initialize
    }
});