define(['postal', 'annyang', 'Input/DeviceManager'], function (bus, annyang, deviceManager) {
    var source = 'Microphone';
    var connected = false;

    function Initialize(LeapConfiguration) {

        var device = {
            Name: 'Microphone',
            Manufacturer: 'Unknown',
            Device: annyang
        }

        if (annyang) {
            if (typeof ActionToFunctionMapping.AudioCommands != 'undefined') {
                // Add our commands to annyang
                annyang.addCommands(ActionToFunctionMapping.AudioCommands);
            }

            annyang.addCallback('start', function () {
                connected = true;
            });

            annyang.addCallback('end', function () {
                connected = false;
            });
        }
        
        // Add microphone to Device Manager
        deviceManager.Add(source, device, function () {
            return connected;
        });

    }

    function Start() {
        if (annyang) {
            annyang.start();
        }
    }

    return {
        Intitialize: Initialize,
        Start: Start
    }
});