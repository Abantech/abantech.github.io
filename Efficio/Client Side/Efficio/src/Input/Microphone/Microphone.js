define(['postal', 'annyang', 'Input/DeviceManager'], function (bus, annyang, deviceManager) {
    var source = 'Microphone';
    var connected = false;

    function Initialize(LeapConfiguration) {

        if (typeof ActionToFunctionMapping.AudioCommands != 'undefined') {
            // Add our commands to annyang
            annyang.addCommands(ActionToFunctionMapping.AudioCommands);
        }

        var device = {
            Name: 'Microphone',
            Manufacturer: 'Unknown',
            Device: annyang
        }

        // Add microphone to Device Manager
        deviceManager.Add(source, device, function () {
            return connected;
        });

        annyang.addCallback('start', function () {
            connected = true;
        });

        annyang.addCallback('end', function () {
            connected = false;
        });
    }

    function Start() {
        annyang.start();
    }

    return {
        Intitialize: Initialize,
        Start: Start
    }
});