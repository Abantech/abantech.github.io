define(['postal'], function (bus) {
    var Efficio;
    var Devices = {};

    function Add(name, device) {
        Devices[name] = device;

        bus.publish({
            channel: 'Devices',
            topic: 'Added',
            source: name,
            data: {
                Name: name,
                Device: device
            }
        });
    }

    function Remove(name) {
        Devices[name] = null;

        bus.publish({
            channel: 'Devices',
            topic: 'Removed',
            source: name,
            data: {
                Name: name
            }
        });
    }

    function Initialize(Efficio) {
        return Devices;
    }

    return {
        Add: Add,
        Remove: Remove,
        Initialize: Initialize,
        Devices: Devices
    }
});