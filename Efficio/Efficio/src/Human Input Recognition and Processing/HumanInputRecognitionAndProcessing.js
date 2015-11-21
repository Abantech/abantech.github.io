define(['postal'], function (bus) {
    return {
        Initialize: function () {
            require(['Human Input Recognition and Processing/CustomGestureLibrariesAccess'], function (customGestureLibraries) {
                customGestureLibraries.Initialize();

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
                efficioGestureLibrary.Initialize();

                bus.subscribe({
                    channel: "Input.Raw",
                    topic: "*",
                    callback: function (data, envelope) {
                        efficioGestureLibrary.ProcessInput(data, envelope);
                    }
                });
            });

            require(['Human Input Recognition and Processing/EfficioAudioGrimoire'], function (efficioAudioGrimoire) {
                efficioAudioGrimoire.Initialize();

                bus.subscribe({
                    channel: "Input.Audio.Raw",
                    topic: "*",
                    callback: function (data, envelope) {
                        efficioAudioGrimoire.ProcessInput(data, envelope);
                    }
                });
            });
        }
    }
});