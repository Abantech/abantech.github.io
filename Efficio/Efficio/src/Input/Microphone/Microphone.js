define(['postal', 'annyang', 'Input/DeviceManager'], function (bus, annyang, deviceManager) {

    var source = 'Microphone';

    function Initialize(LeapConfiguration) {

        if (typeof ActionToFunctionMapping.AudioCommands != 'undefined') {
            // Add our commands to annyang
            annyang.addCommands(ActionToFunctionMapping.AudioCommands);
        }

        // Add microphone to Device Manager
        deviceManager.Add(source, annyang);
    }

    function Start() {
        annyang.start();
    }

    return {
        Intitialize: Initialize,
        Start: Start
    }
});