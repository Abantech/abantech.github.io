define([
    'Input Recognition and Processing/InputRecognitionAndProcessing',
    'Asset Management and Inventory/AssetManager',
    'Constraints Engine/ConstraintsEngine',
    'Command Issuance and Control/CommandIssuanceAndControl',
    'InternalScene',
    'Logging/SystemNotificationListener',
    'Input/DeviceManager',
    'Metrics/Metrics'
    //'Sequence Execution and Action Scheduling/CollisionDetectionAndGravitySimulation',
],

function (hirp, ami, constraintsEngine, comm, internalScene, sysNotificationListener, deviceManager, metrics) {
    var Efficio;
    var readyFired = false;

    function Configure(EfficioConfiguration) {
        EfficioConfiguration.Devices = EfficioConfiguration.Devices || {};
        EfficioConfiguration.Debug = EfficioConfiguration.Debug || false;
        EfficioConfiguration.ActionToFunctionMapping = EfficioConfiguration.ActionToFunctionMapping || { PluginName: 'NO PLUGIN CONFIGURED', ActionMappings: [] }

        Efficio.Configuration = EfficioConfiguration; 
    }

    function Ready() {
        var ready = false;
        ready = CheckReadyConditions();
        if (ready && !readyFired) {
            readyFired = true;

            if (typeof window !== 'undefined' && window != null) {
                FireReadyEvent();
            }
        }

        return ready;
    }

    function CheckReadyConditions() {
        var ready = true;

        if (typeof Efficio === 'undefined' || Efficio.Configuration === null) {
            return false;
        }

        // Check if DeviceManager Ready
        ready = ready && (Efficio.DeviceManager !== null) && (Efficio.DeviceManager.Ready());

        // Check if Metrics Ready
        ready = ready && (Efficio.Metrics !== null) && (Efficio.Metrics.Ready());

        return ready
    }

    function FireReadyEvent() {
        var element = document.createElement('div');
        var event; // The custom event that will be created

        if (document.createEvent) {
            event = document.createEvent("HTMLEvents");
            event.initEvent("dataavailable", true, true);
        } else {
            event = document.createEventObject();
            event.eventType = "dataavailable";
        }

        event.eventName = "Efficio Ready";

        if (document.createEvent) {
            element.dispatchEvent(event);
        } else {
            element.fireEvent("on" + event.eventType, event);
        }
    }

    return {
        Initialize: function (EfficioConfiguration) {

            if (typeof Efficio === 'undefined' || Efficio === null) {
                Efficio = {
                    Started: false,
                    Ready: Ready
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
            comm.Initialize();
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