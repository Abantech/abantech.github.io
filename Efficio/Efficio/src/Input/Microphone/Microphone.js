define(['postal', 'annyang'], function (bus, annyang) {

    var source = 'Microphone';
    var recognition;
    var autoRestart = true;
    var lastStartedAt = 0;

    return {
        Intitialize: function () {

            if (typeof annyang != 'undefined') {
                
                if (typeof AudioCommands != 'undefined') {
                    // Add our commands to annyang
                    annyang.addCommands(AudioCommands);
                }
            }
        },
        Start: function () {
            if (annyang) {
                annyang.start();

                bus.publish({
                    channel: 'Devices',
                    topic: 'Connected',
                    source: source,
                    data: {
                        name : source,
                    }
                });
            }
        }
    }
});