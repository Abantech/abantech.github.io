define(['postal', 'Human Input Recognition and Processing/ActiveGestureDictionary'], function (bus, agd) {

    var hipr = {  ActiveGesturesDictionary: agd, PrototypeExtensions: { }, };

    function Initialize(EfficioConfiguration) {
        // Extend input models for easier processing and to make them more informative

        if (EfficioConfiguration.Devices.LeapMotion) {
            (function LeapMotionPrototypeExtensions() {
                hipr.PrototypeExtensions.LeapMotion = {};

                require(['Human Input Recognition and Processing/Input Extensions/LeapMotion/HandExtensions'], function (handExtensions) {
                    hipr.PrototypeExtensions.LeapMotion.Hand = handExtensions.ExtendClasses();
                });

                require(['Human Input Recognition and Processing/Input Extensions/LeapMotion/FingerExtensions'], function (fingerExtensions) {
                    hipr.PrototypeExtensions.LeapMotion.Finger = fingerExtensions.ExtendClasses();
                });
            })();
        }
        
        if (EfficioConfiguration.Devices.RealSense) {
            (function RealSensePrototypeExtensions() {
                hipr.PrototypeExtensions.RealSense = {};

                require(['Human Input Recognition and Processing/Input Extensions/Intel/RealSense/HandExtensions'], function (handExtensions) {
                    hipr.PrototypeExtensions.RealSense.Hand = handExtensions.ExtendClasses();
                });
            })();
        }

        require(['Human Input Recognition and Processing/CustomGestureLibrariesAccess'], function (customGestureLibraries) {
            hipr.CustomGestureLibrary  = customGestureLibraries.Initialize(agd);

            bus.subscribe({
                channel: "Input.Raw",
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

        require(['Human Input Recognition and Processing/EfficioGestureGrimoire'], function (efficioGestureLibrary) {
            hipr.EfficioGestureLibrary = efficioGestureLibrary.Initialize(agd);

            bus.subscribe({
                channel: "Input.Raw",
                topic: "*",
                callback: function (data, envelope) {
                    efficioGestureLibrary.ProcessInput(data, envelope);
                }
            });
        });

        //require(['Human Input Recognition and Processing/EfficioAudioGrimoire'], function (efficioAudioGrimoire) {
        //    efficioAudioGrimoire.Initialize();

        //    bus.subscribe({
        //        channel: "Input.Audio.Raw",
        //        topic: "*",
        //        callback: function (data, envelope) {
        //            efficioAudioGrimoire.ProcessInput(data, envelope);
        //        }
        //    });
        //});

        return hipr;
    }

    return {
        Initialize: Initialize
    }
});