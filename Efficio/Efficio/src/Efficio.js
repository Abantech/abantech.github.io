define([
    'Human Input Recognition and Processing/HumanInputRecognitionAndProcessing',
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

    function configure(EfficioConfiguration) {
        EfficioConfiguration.Devices = EfficioConfiguration.Devices || { Microphone: false, Kinect: false, LeapMotion: false };
        EfficioConfiguration.Debug = EfficioConfiguration.Debug || false;

        Efficio.Configuration = EfficioConfiguration;
    }

    return {
        Initialize: function (EfficioConfiguration) {

            if (typeof Efficio === 'undefined' || Efficio === null) {
                Efficio = {};
            }

            if (window && (window.Efficio === null || typeof window.Efficio === 'undefined')) {
                window.Efficio = Efficio
            }

            configure(EfficioConfiguration);

            Efficio.Metrics = metrics.Initialize();

            Efficio.HumanInputAndGestureRecognition =  hirp.Initialize();
            ami.Initialize();
            constraintsEngine.Initialize();
            comm.Initialize();
            internalScene.Initialize();
            sysNotificationListener.Initialize();
            Efficio.DeviceManager = deviceManager.Initialize();

            if (EfficioConfiguration.Devices.LeapMotion) {
                require(['Input/LeapMotion/LeapMotion'], function (leap) {
                    leap.Initialize(EfficioConfiguration);
                    leap.Start();
                });
            }

            
            if (EfficioConfiguration.Devices.Kinect) {
                require(['Input/Microsoft Kinect/Kinect'], function (kinect) {
                    kinect.Initialize(EfficioConfiguration);
                    kinect.Start();
                });

                require(['Input/Microsoft Kinect/JointHelper'], function (jh) {
                    console.log("Joint Helper: " + jh);
                });
            }

            if (EfficioConfiguration.Devices.Microphone) {
                require(['Input/Microphone/Microphone'], function (microphone) {
                    microphone.Intitialize();
                    microphone.Start();
                });
            }

            if (window) {
                // Accelerometer
                require(['Input/Accelerometer/Browser2'], function (browser) {
                    browser.Initialize(EfficioConfiguration);
                    browser.Start();
                })

                require(['Input/Geolocation/Browser'], function (browser) {
                    browser.Initialize(EfficioConfiguration);
                    browser.Start();
                })
            }
        },
        Start: function () {
            metrics.Start();
        }
    }
});