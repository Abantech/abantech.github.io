define(['postal', 'Human Input Recognition and Processing/ActiveGestureDictionary'], function (bus, agd) {

    var hipr = {  ActiveGesturesDictionary: agd, PrototypeExtensions: { }, };

    function Initialize() {
        // Extend input models for easier processing and to make them more informative
        (function LeapMotionPrototypeExtensions() {
            hipr.PrototypeExtensions.LeapMotion = {};

            require(['Human Input Recognition and Processing/Input Extensions/LeapMotion/LeapMotionHandExtensions'], function (LMHE) {
                hipr.PrototypeExtensions.LeapMotion.Hand = LMHE.ExtendClasses();
            });
        })();


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