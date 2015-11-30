define(['postal', 'Input/DeviceManager', 'gyronorm'], function (bus, deviceManager, gnobj) {
    var source = "Accelerometer"
    var trackingType = 'Orientation';
    var gn;

    function ongnReady() {
        var gnAvailable = gn.isAvailable();

        // Add accelerometer to Device Manager
        deviceManager.Add(source, gn);
        deviceManager.Devices[source].SupportedSources = {
            DeviceOrientationAvailable: gnAvailable.deviceOrientationAvailable,
            AccelerationAvailable: gnAvailable.accelerationAvailable,
            AccelerationIncludingGravityAvailable: gnAvailable.accelerationIncludingGravityAvailable,
            RotationRateAvailable: gnAvailable.rotationRateAvailable,
            CompassNeedsCalibrationAvailable: gnAvailable.compassNeedsCalibrationAvailable
        }

        gn.start(function (data) {
            if (gnAvailable.deviceOrientationAvailable) {
                bus.publish({
                    channel: 'Input.Raw',
                    topic: 'Device Orientation',
                    source: source,
                    data: {
                        TrackingType: trackingType,
                        DeviceOrientation: data.do
                    }
                });
            }

            if (gnAvailable.accelerationAvailable) {
                bus.publish({
                    channel: 'Input.Raw',
                    topic: 'Device Acceleration',
                    source: source,
                    data: {
                        TrackingType: trackingType,
                        DeviceMotion: data.dm
                    }
                });
            }

            if (gnAvailable.accelerationIncludingGravityAvailable) {
                bus.publish({
                    channel: 'Input.Raw',
                    topic: 'Device Acceleration with Gravity',
                    source: source,
                    data: {
                        TrackingType: trackingType,
                        DeviceMotion: data.dm
                    }
                });
            }

            if (gnAvailable.rotationRateAvailable) {
                bus.publish({
                    channel: 'Input.Raw',
                    topic: 'Device Rotation',
                    source: source,
                    data: {
                        TrackingType: trackingType,
                        DeviceMotion: data.dm
                    }
                });
            }
        });
    }

    function Initialize(EfficioConfiguration) {
        gn = new GyroNorm();
    }

    function Start() {
        gn.init().then(ongnReady).catch(function (e) {
            deviceManager.Add(source, gn);
            deviceManager[source].SupportedSources = {
                DeviceOrientationAvailable: false,
                AccelerationAvailable: false,
                AccelerationIncludingGravityAvailable: false,
                RotationRateAvailable: false,
                CompassNeedsCalibrationAvailable: false
            }
        });
    }

    return {
        Initialize: Initialize,
        Start: Start
    }
});