define(['postal'], function (bus) {
    var source = 'Microsoft Kinect';
    var trackingType = 'Body';
    var controller;
    var device = "Kinect";
    var jointHelper;

    function configure(KinectConfiguration) {
        KinectConfiguration = {
            Host: KinectConfiguration.Host || "ws://localhost:8181"
        }

        return KinectConfiguration;
    }

    return {
        Initialize: function (KinectConfiguration) {

            // Retrieve Joint Helper
            require(['Input/Microsoft Kinect/JointHelper'], function (jh) {
                jointHelper = jh;
            });

            // Load Configuration
            KinectConfiguration = configure(KinectConfiguration);

            // Create Controller
            controller = new WebSocket(KinectConfiguration.Host);

            // Sends message when controller is connected
            controller.onopen = function ()
            {
                console.log("Connection successful.");
                bus.publish
                ({
                    channel: 'Devices',
                    topic: 'Connected',
                    source: source,
                    data: {
                        name: source,
                        device: device,
                        controller: controller,
                        test: 'test'
                    }
                });
            };

            // Connection closed.
            controller.onclose = function () {
                    console.log("Connection closed.");

            }
        },

        Start: function () {

            // Listens for input from device
            controller.onmessage = function (frame)
            {
                var kinectFriendly = [];
               
               var skeleton = JSON.parse(frame.data);
               skeleton.Joints.forEach(function (joint)
               {
                   // Get the Joint Type and Tracking Status
                   var jointType = jointHelper.GetJointName(joint.JointType);
                   var jointTracking = jointHelper.GetJointTrackingStatus(joint.TrackingState);
                   var jointFriendly = { JointType: jointType, TrackingState: jointTracking, Joint: joint };

                   kinectFriendly.push(jointFriendly);
               });


                bus.publish
                ({
                    channel: 'Input.Raw',
                    topic: device,
                    source: source,
                    data:
                    {
                        trackingType: trackingType,
                        input: kinectFriendly
                    }
                });
            };
        }
    }
});