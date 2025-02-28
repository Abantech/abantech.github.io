﻿define(['postal'], function (bus) {
    var Devices = {};

    function ConnectedDevices() {
        var connectedDevices = { Count: 0 };

        for (var prop in Devices.RegisteredDevices) {
            if (prop !== 'Count' && Devices.RegisteredDevices[prop].IsConnected()) {
                connectedDevices[prop] = Devices.RegisteredDevices[prop];
                connectedDevices.Count++;
            }
        }

        return connectedDevices;
    }

    function DisconnectedDevices() {
        var disconnectedDevices = { Count: 0 };

        for (var prop in Devices.RegisteredDevices) {
            if (prop !== 'Count' && !Devices.RegisteredDevices[prop].IsConnected()) {
                disconnectedDevices[prop] = Devices.RegisteredDevices[prop];
                disconnectedDevices.Count++;
            }
        }

        return disconnectedDevices;
    }

    function Ready() {
        var deviceConfig = Efficio.Configuration.Devices;

        if (typeof deviceConfig !== 'undefined') {
            var count = 0;

            for (var prop in deviceConfig) {
                if (prop !== 'Count') {
                    if (deviceConfig[prop]) {
                        count++;
                    }
                }
            }

            deviceConfig.Count = count;
        }

        return deviceConfig.Count === Devices.RegisteredDevices.Count;
    }

    function Add(name, device, isConnected) {
        if (!Devices.RegisteredDevices[name]) {
            Devices.RegisteredDevices.Count++;
        }

        Devices.RegisteredDevices[name] = device;

        // DEV: Check is for development purposes. Remove for prod
        if (typeof isConnected === 'undefined' ) {
            throw new Exception('IsConnected method is a required argument.');
        }

        // DEV: Check is for development purposes. Remove for prod
        if (typeof isConnected !== 'function') {
            throw new Exception('IsConnected method is required to be a function.');
        }

        // DEV: Check is for development purposes. Remove for prod
        if (!device.Name) {
            throw new Exception('Name property is required when registering device in the Device Manager.');
        }

        // DEV: Check is for development purposes. Remove for prod
        if (!device.Manufacturer) {
            throw new Exception('Name property is required when registering device in the Device Manager.');
        }

        Devices.RegisteredDevices[name].IsConnected = isConnected;

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
        delete Devices[name];

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
        Devices.RegisteredDevices = { Count: 0 };
        Devices.ConnectedDevices = ConnectedDevices;
        Devices.DisconnectedDevices = DisconnectedDevices;
        Devices.Ready = Ready;

        return Devices;
    }

    return {
        Add: Add,
        Remove: Remove,
        Initialize: Initialize,
        Devices: Devices
    }
});