define([
    'Message Bus/MessageBus',
    'Human Input Recognition and Processing/HumanInputRecognitionAndProcessing',
    'Asset Management and Inventory/AssetManager',
    'Constraints Engine/ConstraintsEngine',
    'Command Issuance and Control/CommandIssuanceAndControl',
    'InternalScene',
    'Logging/SystemNotificationListener',
    //'Sequence Execution and Action Scheduling/CollisionDetectionAndGravitySimulation',
],

function (bus, hirp, ami, constraintsEngine, comm, internalScene, sysNotificationListener) {
    var leapmotion;
    var microphone;
    var kinect;

    function configure(EfficioConfiguration) {
        EfficioConfiguration.devices = EfficioConfiguration.devices || { microphone: false, kinect: false, leapmotion: false };
        EfficioConfiguration.debug = EfficioConfiguration.debug || false;
    }

    return {
        Initialize: function (EfficioConfiguration) {
            configure(EfficioConfiguration);
            bus.Initialize();
            hirp.Initialize();
            ami.Initialize();
            constraintsEngine.Initialize();
            comm.Initialize();
            internalScene.Initialize();
            sysNotificationListener.Initialize();

            if (EfficioConfiguration.devices.leapmotion) {
                require(['Input/LeapMotion/LeapMotion'], function (leap) {
                    leapmotion = leap;
                    leapmotion.Initialize(EfficioConfiguration.devices.leapmotion);
                    leapmotion.Start();
                });
            }

            
            if (EfficioConfiguration.devices.kinect) {
                require(['Input/Microsoft Kinect/Kinect'], function (kin) {
                    kinect = kin;
                    kinect.Initialize(EfficioConfiguration.devices.kinect);
                    kinect.Start();
                });

                require(['Input/Microsoft Kinect/JointHelper'], function (jh) {
                    console.log("Joint Helper: " + jh);
                });
            }

            if (EfficioConfiguration.devices.microphone) {
                require(['Input/Microphone/Microphone'], function (mic) {
                    microphone = mic;
                    microphone.Intitialize();
                    microphone.Start();
                });
            }
        },
        Start: function () {

        }
    }
});