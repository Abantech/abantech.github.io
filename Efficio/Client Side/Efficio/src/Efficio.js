define([
    'Input Recognition and Processing/InputRecognitionAndProcessing',
    'Asset Management and Inventory/AssetManager',
    'Constraints Engine/ConstraintsEngine',
    'Command Issuance and Control/CommandIssuanceAndControl',
    'InternalScene',
    'Logging/SystemNotificationListener',
    'Input/DeviceManager',
    'Metrics/Metrics',
    'postal'
    //'Sequence Execution and Action Scheduling/CollisionDetectionAndGravitySimulation',
],

function (hirp, ami, constraintsEngine, comm, internalScene, sysNotificationListener, deviceManager, metrics, bus) {
    var Efficio;
    var readyFired = false;

    function Configure(EfficioConfiguration) {
        EfficioConfiguration.Devices = EfficioConfiguration.Devices || {};
        EfficioConfiguration.Debug = EfficioConfiguration.Debug || false;
        EfficioConfiguration.ActionToFunctionMapping = EfficioConfiguration.ActionToFunctionMapping || { PluginName: 'NO PLUGIN CONFIGURED', ActionMappings: [] }

        Efficio.Configuration = EfficioConfiguration;
    }

    function CheckReady(func) {
        var ready = false;
        ready = CheckReadyConditions(func);
        if (ready && !readyFired) {
            readyFired = true;
            FireReadyEvent();
            Efficio.IsReady = true;
        }

        return ready;
    }

    function CheckReadyConditions(func) {
        var ready = true;

        if (typeof Efficio === 'undefined' || Efficio.Configuration === null) {
            return false;
        }

        // Check if DeviceManager Ready
        ready = ready && (Efficio.DeviceManager !== null) && (Efficio.DeviceManager.Ready());

        // Check if Metrics Ready
        ready = ready && (Efficio.Metrics !== null) && (Efficio.Metrics.Ready());

        // Check if external app is ready
        if (typeof func === 'function') {
            ready = ready && (func());
        }

        return ready
    }

    function FireReadyEvent() {
        bus.publish({
            channel: "Efficio",
            topic: "Ready",
            data: {
            }
        });
    }

    return {
        Initialize: function (EfficioConfiguration) {

            if (typeof Efficio === 'undefined' || Efficio === null) {
                Efficio = {
                    Started: false,
                    CheckReady: CheckReady,
                    IsReady: false
                };
            }

            if (window && (window.Efficio === null || typeof window.Efficio === 'undefined')) {
                window.Efficio = Efficio
            }

            Configure(EfficioConfiguration);

            Efficio.Metrics = metrics.Initialize();

            Efficio.InputAndGestureRecognition = hirp.Initialize(EfficioConfiguration);
            ami.Initialize();
            constraintsEngine.Initialize();
            Efficio.CommandIssuanceAndControl = comm.Initialize();
            Efficio.InternalScene = internalScene.Initialize();
            sysNotificationListener.Initialize();
            Efficio.DeviceManager = deviceManager.Initialize();

            if (EfficioConfiguration.Devices.LeapMotion) {
                require(['Input/LeapMotion/LeapMotion'], function (leap) {
                    leap.Initialize(EfficioConfiguration);
                    leap.Start();
                });
            }

            // JAMES -- I had to change this to get it to work
            if (EfficioConfiguration.Devices.Kinect) {
                require(['Input/Microsoft Kinect/Kinect'], function (kinect) {
                    kinect.Initialize();
                    kinect.Start();
                });
            }

            if (EfficioConfiguration.Devices.Microphone) {
                require(['Input/Microphone/Microphone'], function (microphone) {
                    microphone.Intitialize();
                    microphone.Start();
                });
            }

            if (EfficioConfiguration.Devices.XR3D) {
                require(['Input/XR3D/XR3D'], function (XR3D) {
                    XR3D.Initialize();
                    XR3D.Start();
                });
            }

            if (EfficioConfiguration.Devices.RealSense) {
                require(['Input/Intel/RealSense/RealSense'], function (realsense) {
                    realsense.Initialize();
                    realsense.Start();
                });
            }

            if (EfficioConfiguration.Devices.Location && window) {
                // Geolocation
                require(['Input/Geolocation/Browser'], function (browser) {
                    browser.Initialize(EfficioConfiguration);
                    browser.Start();
                })
            }

            if (EfficioConfiguration.Devices.Orientation && window) {
                // Accelerometer
                require(['Input/Accelerometer/Browser2'], function (browser) {
                    browser.Initialize(EfficioConfiguration);
                    browser.Start();
                })
            }
        },
        Start: function () {
            Efficio.Started = true;
            metrics.Start();
        }
    }
});