define(['postal'], function (bus) {
    var source = 'Kinect';
    var trackingType = 'Body';
    var controller;
    var device = "KinectV1";
    var jointHelper;

    function configure(KinectConfiguration) {
        KinectConfiguration = {
            Host: KinectConfiguration.Host || "ws://localhost:8181"
        }

        return KinectConfiguration;
    }

    return {
        Initialize: function (KinectConfiguration) {

            require(['Input/Microsoft Kinect/JointHelper'], function (jh) {
                jointHelper = jh;
            });

            // Load Configuration
            KinectConfiguration = configure(KinectConfiguration);

            console.log("Attempting Connection.");
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
                        device: "Kinect",
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

                console.log("received data from socket");

                var kinectFriendly = [];
               
               var skeleton = JSON.parse(frame.data);
               skeleton.Joints.forEach(function (joint) {
                   var jointType = jointHelper.GetJointName(joint.JointType);
                   var jointTracking = jointHelper.GetJointTrackingStatus(joint.TrackingState);

                   var jointFriendly = { JointType: jointType, TrackingState: jointTracking, Joint: joint };

                   kinectFriendly.push(jointFriendly);
                   
                   console.log(jointFriendly);
               });

                bus.publish
                ({
                    channel: 'Input.Raw',
                    topic: device,
                    source: source,
                    data:
                    {
                        trackingType: trackingType,
                        input: skeleton
                    }
                });
            };
        }
    }
});